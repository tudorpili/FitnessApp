// src/models/Exercise.js
const db = require('../config/db');

const Exercise = {
    // ... (findAll, findById, create, update, deleteById methods remain the same) ...
    findAll: async () => {
        const sql = 'SELECT * FROM exercises ORDER BY name ASC';
        try {
            const [rows] = await db.query(sql);
            return rows;
        } catch (error) {
            console.error('Error fetching all exercises:', error);
            throw error;
        }
    },

    findById: async (id) => {
        const sql = 'SELECT * FROM exercises WHERE id = ?';
        try {
            const [rows] = await db.query(sql, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error fetching exercise with id ${id}:`, error);
            throw error;
        }
    },

    create: async (exerciseData) => {
        const {
            name, description, muscle, difficulty, equipment, image_url, videos
        } = exerciseData;
        const videosJson = JSON.stringify(videos || []);
        const sql = `
            INSERT INTO exercises (name, description, muscle, difficulty, equipment, image_url, videos)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            name, description || null, muscle || null, difficulty || null,
            equipment || null, image_url || null, videosJson
        ];
        try {
            const [result] = await db.query(sql, values);
            const insertId = result.insertId;
            if (!insertId) {
                throw new Error('Exercise creation failed, no insert ID returned.');
            }
            return await Exercise.findById(insertId);
        } catch (error) {
            console.error('Error creating exercise:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error(`An exercise with the name "${name}" already exists.`);
            }
            throw error;
        }
    },

    update: async (id, exerciseData) => {
        const {
            name, description, muscle, difficulty, equipment, image_url, videos
        } = exerciseData;
        const videosJson = JSON.stringify(videos || []);
        const sql = `
            UPDATE exercises SET
                name = ?, description = ?, muscle = ?, difficulty = ?,
                equipment = ?, image_url = ?, videos = ?
            WHERE id = ?
        `;
        const values = [
            name, description || null, muscle || null, difficulty || null,
            equipment || null, image_url || null, videosJson,
            id
        ];
        try {
            const [result] = await db.query(sql, values);
            if (result.affectedRows === 0) {
                return null;
            }
            return await Exercise.findById(id);
        } catch (error) {
            console.error(`Error updating exercise with id ${id}:`, error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error(`An exercise with the name "${name}" already exists.`);
            }
            throw error;
        }
    },

    deleteById: async (id) => {
        const sql = 'DELETE FROM exercises WHERE id = ?';
        try {
            const [result] = await db.query(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting exercise with id ${id}:`, error);
            throw error;
        }
    },

    // --- NEW FUNCTION ---
    /**
     * Fetches progress data for a specific exercise for a given user.
     * Tracks the maximum weight lifted for the exercise on each day it was performed.
     * @param {number} userId - The ID of the user.
     * @param {number} exerciseId - The ID of the exercise.
     * @param {string|null} startDate - Optional start date for filtering (YYYY-MM-DD).
     * @param {string|null} endDate - Optional end date for filtering (YYYY-MM-DD).
     * @returns {Promise<Array<object>>} An array of objects { session_date, metric_value }.
     */
    getExerciseProgress: async (userId, exerciseId, metric = 'max_weight', startDate = null, endDate = null) => {
        let metricSelection;
        switch (metric) {
            case 'total_volume': // Sum of (weight * reps) for the exercise in a session
                metricSelection = 'SUM(wse.weight * wse.reps)';
                break;
            case 'max_reps_at_weight': // Needs a specific weight, more complex for a general trend
                 // For simplicity, we'll stick to max_weight or total_volume for now.
                 // This would require another parameter for the specific weight to track reps for.
                metricSelection = 'MAX(wse.reps)'; // Simplified: max reps regardless of weight for that day
                break;
            case 'max_weight':
            default: // Default to max weight
                metricSelection = 'MAX(wse.weight)';
                break;
        }

        let sql = `
            SELECT
                ws.session_date,
                ${metricSelection} as metric_value
            FROM workout_sessions ws
            JOIN workout_session_exercises wse ON ws.id = wse.session_id
            WHERE ws.user_id = ? AND wse.exercise_id = ?
        `;
        const queryParams = [userId, exerciseId];

        // Add date filtering if provided
        if (startDate) {
            sql += ' AND ws.session_date >= ?';
            queryParams.push(startDate);
        }
        if (endDate) {
            sql += ' AND ws.session_date <= ?';
            queryParams.push(endDate);
        }

        sql += `
            GROUP BY ws.session_date
            HAVING metric_value IS NOT NULL AND metric_value > 0 
            ORDER BY ws.session_date ASC
        `;

        try {
            const [rows] = await db.query(sql, queryParams);
            // Ensure metric_value is a number
            return rows.map(row => ({
                session_date: row.session_date,
                metric_value: parseFloat(row.metric_value)
            }));
        } catch (error) {
            console.error(`Error fetching progress for exercise ${exerciseId} for user ${userId}:`, error);
            throw error;
        }
    }
    // --- END NEW FUNCTION ---
};

module.exports = Exercise;
