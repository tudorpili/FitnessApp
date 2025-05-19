// src/models/WorkoutSession.js
const db = require('../config/db'); 

const WorkoutSession = {
  
  create: async (sessionData, exercisesData) => {
    
    let connection;
    try {
      connection = await db.getConnection(); 
      await connection.beginTransaction();

      
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

      
      if (exercisesData && exercisesData.length > 0) {
        const exerciseInsertPromises = exercisesData.flatMap((exercise, exerciseIndex) => {
          
          const sets = Array.isArray(exercise.sets) ? exercise.sets : [];

          return sets.map((set, setIndex) => {
            const exerciseSql = `
              INSERT INTO workout_session_exercises (session_id, exercise_id, set_number, reps, weight, unit)
              VALUES (?, ?, ?, ?, ?, ?)
            `;
            const exerciseValues = [
              newSessionId,
              exercise.exerciseId,
              setIndex + 1, 
              set.reps || null,
              set.weight || null,
              set.unit || null,
            ];
            
            return connection.query(exerciseSql, exerciseValues);
          });
        });

        
        await Promise.all(exerciseInsertPromises);
      }

      
      await connection.commit();

      
      const [createdSession] = await connection.query('SELECT * FROM workout_sessions WHERE id = ?', [newSessionId]);
      return createdSession.length > 0 ? createdSession[0] : { id: newSessionId, ...sessionData }; 

    } catch (error) {
      
      if (connection) {
        await connection.rollback();
      }
      console.error('Error creating workout session log:', error);
      throw error; 
    } finally {
      
      if (connection) {
        connection.release();
      }
    }
  },

  
  findUserSessionsWithDetails: async (userId, startDate, endDate) => {
    let connection;
    try {
        connection = await db.getConnection();

        
        let sessionsSql = `
            SELECT ws.*
            FROM workout_sessions ws
            WHERE ws.user_id = ?
        `;
        const queryParams = [userId];

        
        if (startDate) {
            sessionsSql += ' AND ws.session_date >= ?';
            queryParams.push(startDate);
        }
        if (endDate) {
            sessionsSql += ' AND ws.session_date <= ?';
            queryParams.push(endDate);
        }
        sessionsSql += ' ORDER BY ws.session_date DESC, ws.created_at DESC'; 

        
        const [sessions] = await connection.query(sessionsSql, queryParams);

        if (sessions.length === 0) {
            return []; 
        }

        
        const sessionIds = sessions.map(s => s.id);

        
        
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

        
        const sessionsWithDetails = sessions.map(session => {
            const sessionExercisesMap = new Map(); 

            exerciseSets
                .filter(es => es.session_id === session.id)
                .forEach(es => {
                    const exerciseKey = es.exercise_id || `deleted-${es.id}`; 
                    if (!sessionExercisesMap.has(exerciseKey)) {
                        sessionExercisesMap.set(exerciseKey, {
                            exerciseId: es.exercise_id, 
                            name: es.exercise_name || 'Deleted Exercise', 
                            muscle: es.exercise_muscle, 
                            sets: []
                        });
                    }
                    
                    sessionExercisesMap.get(exerciseKey).sets.push({
                        id: es.id, 
                        setNumber: es.set_number,
                        reps: es.reps,
                        weight: es.weight,
                        unit: es.unit
                    });
                });

            return {
                ...session,
                exercises: Array.from(sessionExercisesMap.values()) 
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

  

};

module.exports = WorkoutSession;
