// backend/src/models/WorkoutPlanLike.js
const db = require('../config/db');

const WorkoutPlanLike = {
    addLike: async (userId, planId) => {
        const sql = 'INSERT INTO workout_plan_likes (user_id, plan_id) VALUES (?, ?)';
        try {
            const [result] = await db.query(sql, [userId, planId]);
            return result.insertId;
        } catch (error) {
            // Handle unique constraint violation (user already liked) gracefully
            if (error.code === 'ER_DUP_ENTRY') {
                console.log(`User ${userId} already liked plan ${planId}.`);
                // Optionally, find and return existing like ID or just indicate success
                const existing = await WorkoutPlanLike.findByUserAndPlan(userId, planId);
                return existing ? existing.id : null; // Or throw a specific error if needed
            }
            console.error('Error adding like to workout plan:', error);
            throw error;
        }
    },

    removeLike: async (userId, planId) => {
        const sql = 'DELETE FROM workout_plan_likes WHERE user_id = ? AND plan_id = ?';
        try {
            const [result] = await db.query(sql, [userId, planId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error removing like from workout plan:', error);
            throw error;
        }
    },

    findByUserAndPlan: async (userId, planId) => {
        const sql = 'SELECT * FROM workout_plan_likes WHERE user_id = ? AND plan_id = ?';
        try {
            const [rows] = await db.query(sql, [userId, planId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error finding like by user and plan:', error);
            throw error;
        }
    },

    countLikesByPlanId: async (planId) => {
        const sql = 'SELECT COUNT(*) as likeCount FROM workout_plan_likes WHERE plan_id = ?';
        try {
            const [rows] = await db.query(sql, [planId]);
            return rows.length > 0 ? rows[0].likeCount : 0;
        } catch (error) {
            console.error('Error counting likes for plan:', error);
            throw error;
        }
    }
};

module.exports = WorkoutPlanLike;
