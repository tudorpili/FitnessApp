// src/controllers/dashboardController.js
const db = require('../config/db');
const Goal = require('../models/Goal'); 
const getDbTodayDate = require('../utils/dateUtils');


const getStartOfWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0); 
    const year = startOfWeek.getFullYear();
    const month = String(startOfWeek.getMonth() + 1).padStart(2, '0');
    const day = String(startOfWeek.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const dashboardController = {
  getRecentActivity: async (req, res) => { /* ... (getRecentActivity remains the same) ... */ try { if (!req.user || !req.user.id) { return res.status(401).json({ message: 'User not authenticated.' }); } const userId = req.user.id; const limit = parseInt(req.query.limit, 10) || 10; const sql = ` SELECT id, type, description, activity_date, created_at FROM ( ( SELECT id, 'Workout' as type, COALESCE(name, CONCAT('Workout on ', DATE_FORMAT(session_date, '%b %d, %Y'))) as description, session_date as activity_date, created_at FROM workout_sessions WHERE user_id = ? ) UNION ALL ( SELECT id, 'Weight' as type, CONCAT('Logged weight: ', FORMAT(weight_kg, 1), ' kg') as description, log_date as activity_date, created_at FROM weight_logs WHERE user_id = ? ) UNION ALL ( SELECT id, 'Meal' as type, CONCAT('Logged ', meal_type, ': ', food_name_at_log_time) as description, log_date as activity_date, created_at FROM meal_logs WHERE user_id = ? ) ) AS recent_activity_union ORDER BY activity_date DESC, created_at DESC LIMIT ?; `; const queryParams = [userId, userId, userId, limit]; const [results] = await db.query(sql, queryParams); const formattedResults = results.map(item => ({ id: item.id, type: item.type, description: item.description, date: new Date(item.activity_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) })); res.status(200).json(formattedResults); } catch (error) { console.error('Error in getRecentActivity controller:', error); if (error.sqlMessage) { console.error('SQL Error:', error.sqlMessage); } res.status(500).json({ message: 'Error fetching recent activity', error: error.message }); } },

  getTodaySummary: async (req, res) => { /* ... (getTodaySummary remains the same) ... */ try { if (!req.user || !req.user.id) { return res.status(401).json({ message: 'User not authenticated.' }); } const userId = req.user.id; const todayDate = getDbTodayDate(); const nutritionSql = ` SELECT SUM(calories) as total_calories, SUM(protein_g) as total_protein_g, SUM(carbs_g) as total_carbs_g, SUM(fat_g) as total_fat_g FROM meal_logs WHERE user_id = ? AND log_date = ?`; const [nutritionResults] = await db.query(nutritionSql, [userId, todayDate]); const stepsSql = `SELECT steps FROM daily_step_logs WHERE user_id = ? AND log_date = ?`; const [stepResults] = await db.query(stepsSql, [userId, todayDate]); const waterSql = `SELECT water_ml FROM daily_water_logs WHERE user_id = ? AND log_date = ?`; const [waterResults] = await db.query(waterSql, [userId, todayDate]); const summary = { calories: parseFloat(nutritionResults[0]?.total_calories) || 0, protein: parseFloat(nutritionResults[0]?.total_protein_g) || 0, carbs: parseFloat(nutritionResults[0]?.total_carbs_g) || 0, fat: parseFloat(nutritionResults[0]?.total_fat_g) || 0, steps: parseInt(stepResults[0]?.steps, 10) || 0, waterMl: parseInt(waterResults[0]?.water_ml, 10) || 0, goals: { calories: 2200, protein: 150, carbs: 250, fat: 70, steps: 8000, waterMl: 2000 } }; res.status(200).json(summary); } catch (error) { console.error('Error in getTodaySummary controller:', error); if (error.sqlMessage) { console.error('SQL Error:', error.sqlMessage); } res.status(500).json({ message: "Error fetching today's summary", error: error.message }); } },

  // --- NEW: Function to get weight trend data ---
  /**
   * Handles GET request to fetch weight trend data for the authenticated user.
   * Fetches data points (date, weight_kg) suitable for charting.
   * Requires user authentication.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  getWeightTrend: async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const userId = req.user.id;
        // Optional: Add date range filtering later if needed (?startDate=...&endDate=...)
        // const { startDate, endDate } = req.query;

        // Fetch date and weight, ordered by date for charting
        const sql = `
            SELECT log_date, weight_kg
            FROM weight_logs
            WHERE user_id = ?
            ORDER BY log_date ASC
        `;
        // Add LIMIT later if performance becomes an issue for users with lots of data

        const [results] = await db.query(sql, [userId]);

        // Format data for chart.js (labels array, data array)
        const chartData = {
            labels: results.map(row => row.log_date), // Dates as labels
            data: results.map(row => parseFloat(row.weight_kg) || 0) // Weights as data points
        };

        res.status(200).json(chartData);

    } catch (error) {
        console.error('Error in getWeightTrend controller:', error);
        if (error.sqlMessage) { console.error('SQL Error:', error.sqlMessage); }
        res.status(500).json({ message: "Error fetching weight trend data", error: error.message });
    }
  },

  // --- NEW: Function to get calorie trend data ---
   /**
   * Handles GET request to fetch calorie trend data for the authenticated user.
   * Fetches daily total calories grouped by date.
   * Requires user authentication.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  getCalorieTrend: async (req, res) => {
     try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const userId = req.user.id;
        // Optional: Add date range filtering later

        // Group meal logs by date and sum calories
        const sql = `
            SELECT
                log_date,
                SUM(calories) as total_calories
            FROM meal_logs
            WHERE user_id = ? AND calories IS NOT NULL -- Only include days with logged calories
            GROUP BY log_date
            ORDER BY log_date ASC
        `;
        // Add LIMIT later if needed

        const [results] = await db.query(sql, [userId]);

         // Format data for chart.js
        const chartData = {
            labels: results.map(row => row.log_date),
            data: results.map(row => parseFloat(row.total_calories) || 0)
        };

        res.status(200).json(chartData);

    } catch (error) {
        console.error('Error in getCalorieTrend controller:', error);
        if (error.sqlMessage) { console.error('SQL Error:', error.sqlMessage); }
        res.status(500).json({ message: "Error fetching calorie trend data", error: error.message });
    }
  },
  
  
  getGoalsProgress: async (req, res) => {
    try {
        if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
        const userId = req.user.id;
        const todayDate = getDbTodayDate();
        const startOfWeekDate = getStartOfWeek();

        
        const activeGoals = await Goal.findActiveByUserId(userId);

        if (!activeGoals || activeGoals.length === 0) {
            return res.status(200).json([]); 
        }

        
        

        
        const [weightResult] = await db.query(
            'SELECT weight_kg FROM weight_logs WHERE user_id = ? ORDER BY log_date DESC LIMIT 1',
            [userId]
        );
        const currentWeightKg = weightResult[0]?.weight_kg;

        
        const [workoutCountResult] = await db.query(
            'SELECT COUNT(DISTINCT session_date) as count FROM workout_sessions WHERE user_id = ? AND session_date >= ?',
            [userId, startOfWeekDate]
        );
        const workoutsThisWeek = workoutCountResult[0]?.count || 0;

        
        const [stepResult] = await db.query(
            'SELECT steps FROM daily_step_logs WHERE user_id = ? AND log_date = ?',
            [userId, todayDate]
        );
        const stepsToday = stepResult[0]?.steps || 0;

        
        const [waterResult] = await db.query(
            'SELECT water_ml FROM daily_water_logs WHERE user_id = ? AND log_date = ?',
            [userId, todayDate]
        );
        const waterTodayMl = waterResult[0]?.water_ml || 0;

        
        const [nutritionResult] = await db.query(
            'SELECT SUM(calories) as cals, SUM(protein_g) as prot, SUM(carbs_g) as carbs, SUM(fat_g) as fat FROM meal_logs WHERE user_id = ? AND log_date = ?',
            [userId, todayDate]
        );
        const nutritionToday = {
            calories: parseFloat(nutritionResult[0]?.cals) || 0,
            protein: parseFloat(nutritionResult[0]?.prot) || 0,
            carbs: parseFloat(nutritionResult[0]?.carbs) || 0,
            fat: parseFloat(nutritionResult[0]?.fat) || 0,
        };


        
        const goalsWithProgress = activeGoals.map(goal => {
            let current_progress = 0;
            switch (goal.goal_type) {
                case 'WEIGHT_TARGET':
                    current_progress = currentWeightKg !== undefined ? parseFloat(currentWeightKg) : null;
                    
                    
                    
                    break;
                case 'WORKOUT_FREQUENCY':
                    current_progress = workoutsThisWeek;
                    break;
                case 'STEP_TARGET_DAILY':
                    current_progress = stepsToday;
                    break;
                case 'WATER_TARGET_DAILY':
                    current_progress = waterTodayMl;
                    break;
                case 'CALORIE_TARGET_DAILY':
                    current_progress = nutritionToday.calories;
                    break;
                case 'PROTEIN_TARGET_DAILY':
                    current_progress = nutritionToday.protein;
                    break;
                 case 'CARB_TARGET_DAILY':
                    current_progress = nutritionToday.carbs;
                    break;
                 case 'FAT_TARGET_DAILY':
                    current_progress = nutritionToday.fat;
                    break;
                default:
                    current_progress = null; 
            }
            return {
                ...goal,
                
                target_value: parseFloat(goal.target_value) || 0,
                current_progress: current_progress
            };
        });

        res.status(200).json(goalsWithProgress);

    } catch (error) {
        console.error('Error fetching goals progress:', error);
        res.status(500).json({ message: 'Error fetching goals progress', error: error.message });
    }
  }

};

module.exports = dashboardController;
