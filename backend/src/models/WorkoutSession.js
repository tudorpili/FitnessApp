// src/models/WorkoutSession.js
const db = require('../config/db'); // Adjust path if needed

const WorkoutSession = {
  /**
   * Creates a new workout session log, including its exercises and sets.
   * Uses a transaction to ensure atomicity.
   * @param {object} sessionData - Data for the workout session.
   * Expected fields: userId, sessionDate, name (optional), notes (optional), durationSeconds (optional)
   * @param {Array<object>} exercisesData - Array of exercises performed in the session.
   * Each object expected fields: exerciseId, sets (array of {reps, weight, unit})
   * @returns {Promise<object>} A promise resolving to the created workout session object (from workout_sessions table).
   * @throws {Error} Throws an error if the transaction fails.
   */
  create: async (sessionData, exercisesData) => {
    // Get a connection from the pool to manage the transaction
    let connection;
    try {
      connection = await db.getConnection(); // Assumes db exports a pool with getConnection method
      await connection.beginTransaction();

      // 1. Insert into workout_sessions table
      const sessionSql = `
        INSERT INTO workout_sessions (user_id, session_date, name, notes, duration_seconds)
        VALUES (?, ?, ?, ?, ?)
      `;
      const sessionValues = [
        sessionData.userId,
        sessionData.sessionDate,
        sessionData.name || null,
        sessionData.notes || null,
        sessionData.durationSeconds || null,
      ];
      const [sessionResult] = await connection.query(sessionSql, sessionValues);
      const newSessionId = sessionResult.insertId;

      if (!newSessionId) {
        throw new Error('Failed to create workout session entry.');
      }

      // 2. Prepare inserts for workout_session_exercises table
      if (exercisesData && exercisesData.length > 0) {
        const exerciseInsertPromises = exercisesData.flatMap((exercise, exerciseIndex) => {
          // Ensure sets is an array
          const sets = Array.isArray(exercise.sets) ? exercise.sets : [];

          return sets.map((set, setIndex) => {
            const exerciseSql = `
              INSERT INTO workout_session_exercises (session_id, exercise_id, set_number, reps, weight, unit)
              VALUES (?, ?, ?, ?, ?, ?)
            `;
            const exerciseValues = [
              newSessionId,
              exercise.exerciseId,
              setIndex + 1, // set_number (1-based index)
              set.reps || null,
              set.weight || null,
              set.unit || null,
            ];
            // Execute each set insert query within the transaction
            return connection.query(exerciseSql, exerciseValues);
          });
        });

        // Wait for all exercise set inserts to complete
        await Promise.all(exerciseInsertPromises);
      }

      // 3. Commit the transaction
      await connection.commit();

      // 4. Fetch and return the created session header (optional, but good practice)
      const [createdSession] = await connection.query('SELECT * FROM workout_sessions WHERE id = ?', [newSessionId]);
      return createdSession.length > 0 ? createdSession[0] : { id: newSessionId, ...sessionData }; // Fallback

    } catch (error) {
      // If any error occurred, roll back the transaction
      if (connection) {
        await connection.rollback();
      }
      console.error('Error creating workout session log:', error);
      throw error; // Re-throw the error to be handled by the controller
    } finally {
      // Always release the connection back to the pool
      if (connection) {
        connection.release();
      }
    }
  },

  /**
   * Finds workout sessions for a specific user, optionally filtered by date range.
   * Fetches associated exercises and sets for each session.
   * @param {number} userId - The ID of the user.
   * @param {string} [startDate] - Optional start date (YYYY-MM-DD).
   * @param {string} [endDate] - Optional end date (YYYY-MM-DD).
   * @returns {Promise<Array>} A promise resolving to an array of workout session objects,
   * each containing an 'exercises' array with their respective 'sets'.
   */
  findUserSessionsWithDetails: async (userId, startDate, endDate) => {
    let connection;
    try {
        connection = await db.getConnection();

        // Base query for sessions
        let sessionsSql = `
            SELECT ws.*
            FROM workout_sessions ws
            WHERE ws.user_id = ?
        `;
        const queryParams = [userId];

        // Add date filtering if provided
        if (startDate) {
            sessionsSql += ' AND ws.session_date >= ?';
            queryParams.push(startDate);
        }
        if (endDate) {
            sessionsSql += ' AND ws.session_date <= ?';
            queryParams.push(endDate);
        }
        sessionsSql += ' ORDER BY ws.session_date DESC, ws.created_at DESC'; // Order by date descending

        // Fetch all matching sessions for the user
        const [sessions] = await connection.query(sessionsSql, queryParams);

        if (sessions.length === 0) {
            return []; // No sessions found
        }

        // Get all session IDs to fetch exercises efficiently
        const sessionIds = sessions.map(s => s.id);

        // Fetch all exercises and sets for the retrieved sessions in one go
        // Also fetch the exercise name from the exercises table
        const exercisesSql = `
            SELECT
                wse.*,
                e.name as exercise_name,
                e.muscle as exercise_muscle
            FROM workout_session_exercises wse
            LEFT JOIN exercises e ON wse.exercise_id = e.id -- Join to get exercise name
            WHERE wse.session_id IN (?)
            ORDER BY wse.session_id, wse.id ASC -- Order ensures sets are grouped correctly
        `;
        const [exerciseSets] = await connection.query(exercisesSql, [sessionIds]);

        // Structure the data: Group exercises and sets under each session
        const sessionsWithDetails = sessions.map(session => {
            const sessionExercisesMap = new Map(); // Use a map to group sets by exercise

            exerciseSets
                .filter(es => es.session_id === session.id)
                .forEach(es => {
                    const exerciseKey = es.exercise_id || `deleted-${es.id}`; // Handle potentially null exercise_id
                    if (!sessionExercisesMap.has(exerciseKey)) {
                        sessionExercisesMap.set(exerciseKey, {
                            exerciseId: es.exercise_id, // Can be null if exercise was deleted
                            name: es.exercise_name || 'Deleted Exercise', // Display name or fallback
                            muscle: es.exercise_muscle, // Include muscle group
                            sets: []
                        });
                    }
                    // Add the set details to the correct exercise entry
                    sessionExercisesMap.get(exerciseKey).sets.push({
                        id: es.id, // ID of the workout_session_exercises entry
                        setNumber: es.set_number,
                        reps: es.reps,
                        weight: es.weight,
                        unit: es.unit
                    });
                });

            return {
                ...session,
                exercises: Array.from(sessionExercisesMap.values()) // Convert map values to array
            };
        });

        return sessionsWithDetails;

    } catch (error) {
        console.error('Error fetching user workout sessions with details:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
  },

  // Add other methods if needed (e.g., deleteSession, updateSession)

};

module.exports = WorkoutSession;
