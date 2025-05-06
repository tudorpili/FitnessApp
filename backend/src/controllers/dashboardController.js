// src/controllers/dashboardController.js
const db = require('../config/db'); // Adjust path if needed

// Helper function to get today's date in YYYY-MM-DD format
// (Ensure you have this utility or define it here)
const getDbTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const dashboardController = {
  /**
   * Handles GET request to fetch recent activity for the authenticated user.
   * Fetches the latest workout sessions, weight logs, and meal logs.
   * Requires user authentication.
   * @param {object} req - Express request object. Assumes req.user contains authenticated user info.
   * @param {object} res - Express response object.
   */
  getRecentActivity: async (req, res) => {
    try {
      // 1. Check for authenticated user
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }
      const userId = req.user.id;
      const limit = parseInt(req.query.limit, 10) || 10; // Default limit

      // 2. --- REVISED SQL QUERY ---
      const sql = `
        SELECT id, type, description, activity_date, created_at
        FROM (
            (
              -- Recent Workout Sessions
              SELECT id, 'Workout' as type, COALESCE(name, CONCAT('Workout on ', DATE_FORMAT(session_date, '%b %d, %Y'))) as description, session_date as activity_date, created_at
              FROM workout_sessions WHERE user_id = ?
            )
            UNION ALL
            (
              -- Recent Weight Logs
              SELECT id, 'Weight' as type, CONCAT('Logged weight: ', FORMAT(weight_kg, 1), ' kg') as description, log_date as activity_date, created_at
              FROM weight_logs WHERE user_id = ?
            )
            UNION ALL
            (
              -- Recent Meal Logs (Individual items)
              SELECT id, 'Meal' as type, CONCAT('Logged ', meal_type, ': ', food_name_at_log_time) as description, log_date as activity_date, created_at
              FROM meal_logs WHERE user_id = ?
            )
        ) AS recent_activity_union
        ORDER BY activity_date DESC, created_at DESC
        LIMIT ?;
      `;
      const queryParams = [userId, userId, userId, limit];
      const [results] = await db.query(sql, queryParams);

      // 3. Format date for display
      const formattedResults = results.map(item => ({
          id: item.id, type: item.type, description: item.description,
          date: new Date(item.activity_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      }));

      // 4. Send success response
      res.status(200).json(formattedResults);

    } catch (error) {
      console.error('Error in getRecentActivity controller:', error);
      if (error.sqlMessage) { console.error('SQL Error:', error.sqlMessage); }
      res.status(500).json({ message: 'Error fetching recent activity', error: error.message });
    }
  },

  // --- FIX: Add the missing getTodaySummary function ---
  /**
   * Handles GET request to fetch nutritional, step, and water summary for today.
   * Requires user authentication.
   */
  getTodaySummary: async (req, res) => {
    try {
        // 1. Check for authenticated user
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const userId = req.user.id;
        const todayDate = getDbTodayDate();

        // 2. Fetch Nutritional Summary
        const nutritionSql = `
            SELECT SUM(calories) as total_calories, SUM(protein_g) as total_protein_g,
                   SUM(carbs_g) as total_carbs_g, SUM(fat_g) as total_fat_g
            FROM meal_logs WHERE user_id = ? AND log_date = ?`;
        const [nutritionResults] = await db.query(nutritionSql, [userId, todayDate]);

        // 3. Fetch Today's Steps
        const stepsSql = `SELECT steps FROM daily_step_logs WHERE user_id = ? AND log_date = ?`;
        const [stepResults] = await db.query(stepsSql, [userId, todayDate]);

        // 4. Fetch Today's Water
        const waterSql = `SELECT water_ml FROM daily_water_logs WHERE user_id = ? AND log_date = ?`;
        const [waterResults] = await db.query(waterSql, [userId, todayDate]);

        // 5. Process results
        const summary = {
            calories: parseFloat(nutritionResults[0]?.total_calories) || 0,
            protein: parseFloat(nutritionResults[0]?.total_protein_g) || 0,
            carbs: parseFloat(nutritionResults[0]?.total_carbs_g) || 0,
            fat: parseFloat(nutritionResults[0]?.total_fat_g) || 0,
            steps: parseInt(stepResults[0]?.steps, 10) || 0,
            waterMl: parseInt(waterResults[0]?.water_ml, 10) || 0,
            // Placeholder goals - replace with fetched user goals later
            goals: {
                calories: 2200, protein: 150, carbs: 250, fat: 70,
                steps: 8000, waterMl: 2000
            }
        };

        // 6. Send success response
        res.status(200).json(summary);

    } catch (error) {
        console.error('Error in getTodaySummary controller:', error);
        if (error.sqlMessage) { console.error('SQL Error:', error.sqlMessage); }
        res.status(500).json({ message: "Error fetching today's summary", error: error.message });
    }
  }
  // --- End added function ---

};

module.exports = dashboardController;
