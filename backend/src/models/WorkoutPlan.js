// backend/src/models/WorkoutPlan.js
const db = require('../config/db');

const WorkoutPlan = {
    create: async (userId, planData, exercises) => {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            const planSql = 'INSERT INTO workout_plans (user_id, name, description, status) VALUES (?, ?, ?, ?)';
            // Explicitly set status to 'pending' on creation, though DB has a default
            const [planResult] = await connection.query(planSql, [userId, planData.name, planData.description || null, 'pending']);
            const newPlanId = planResult.insertId;

            if (!newPlanId) {
                throw new Error('Failed to create workout plan header.');
            }

            if (exercises && exercises.length > 0) {
                const linkSql = 'INSERT INTO workout_plan_exercises (plan_id, exercise_id, target_sets, order_index) VALUES ?';
                const linkValues = exercises.map((ex, index) => [
                    newPlanId,
                    ex.exerciseId,
                    ex.targetSets || null,
                    index
                ]);
                await connection.query(linkSql, [linkValues]);
            }

            await connection.commit();
            return await WorkoutPlan.findByIdWithDetails(newPlanId, userId);

        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Error creating workout plan:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    findAllWithDetails: async (requestingUserId = null, isAdmin = false, sortBy = 'created_at', sortOrder = 'DESC') => {
        let plansSql = `
            SELECT 
                wp.*, 
                u.username as creator_username,
                (SELECT COUNT(*) FROM workout_plan_likes wpl WHERE wpl.plan_id = wp.id) as likes_count
                ${requestingUserId ? ', (SELECT COUNT(*) FROM workout_plan_likes wpl_user WHERE wpl_user.plan_id = wp.id AND wpl_user.user_id = ?) AS user_has_liked' : ''}
            FROM workout_plans wp
            LEFT JOIN users u ON wp.user_id = u.id /* Changed to LEFT JOIN to handle potential null user_id if data integrity issue */
        `;
        const queryParams = [];
        if (requestingUserId) {
            queryParams.push(requestingUserId);
        }

        let conditions = [];
        if (!isAdmin) {
            if (requestingUserId) {
                conditions.push("(wp.status = 'approved' OR wp.user_id = ?)");
                queryParams.push(requestingUserId);
            } else {
                conditions.push("wp.status = 'approved'");
            }
        }
        if (conditions.length > 0) {
            plansSql += ` WHERE ${conditions.join(' AND ')}`;
        }
        
        const validSortColumns = {
            'created_at': 'wp.created_at',
            'name': 'wp.name',
            'likes_count': 'likes_count'
        };
        const sortColumn = validSortColumns[sortBy] || 'wp.created_at';
        const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        plansSql += ` ORDER BY ${sortColumn} ${orderDirection}, wp.id ${orderDirection}`;


        const [plans] = await db.query(plansSql, queryParams);

        if (plans.length === 0) return [];

        const planIds = plans.map(p => p.id);

        const exercisesSql = `
            SELECT wpe.plan_id, wpe.exercise_id, wpe.target_sets, wpe.order_index, e.name as exercise_name
            FROM workout_plan_exercises wpe
            JOIN exercises e ON wpe.exercise_id = e.id
            WHERE wpe.plan_id IN (?)
            ORDER BY wpe.plan_id, wpe.order_index ASC
        `;
        const [exercises] = await db.query(exercisesSql, [planIds.length > 0 ? planIds : [0]]);


        const exercisesByPlanId = exercises.reduce((acc, ex) => {
            if (!acc[ex.plan_id]) {
                acc[ex.plan_id] = [];
            }
            acc[ex.plan_id].push({
                exerciseId: ex.exercise_id,
                name: ex.exercise_name,
                targetSets: ex.target_sets,
                orderIndex: ex.order_index
            });
            return acc;
        }, {});

        const plansWithDetails = plans.map(plan => ({
            ...plan,
            likes_count: parseInt(plan.likes_count, 10) || 0,
            user_has_liked: requestingUserId ? (parseInt(plan.user_has_liked, 10) > 0) : false,
            exercises: exercisesByPlanId[plan.id] || []
        }));

        return plansWithDetails;
    },

    findByIdWithDetails: async (planId, requestingUserId = null, isAdmin = false) => {
        const planSql = `
            SELECT 
                wp.*, 
                u.username as creator_username,
                (SELECT COUNT(*) FROM workout_plan_likes wpl WHERE wpl.plan_id = wp.id) as likes_count
                ${requestingUserId ? ', (SELECT COUNT(*) FROM workout_plan_likes wpl_user WHERE wpl_user.plan_id = wp.id AND wpl_user.user_id = ?) AS user_has_liked' : ''}
            FROM workout_plans wp
            LEFT JOIN users u ON wp.user_id = u.id
            WHERE wp.id = ?
        `;
        const queryParams = [];
        if (requestingUserId) {
            queryParams.push(requestingUserId);
        }
        queryParams.push(planId);

        const [planResult] = await db.query(planSql, queryParams);

        if (planResult.length === 0) return null;
        const plan = planResult[0];

        if (!isAdmin && plan.status !== 'approved' && (!requestingUserId || plan.user_id !== requestingUserId)) {
            return null;
        }
        
        plan.likes_count = parseInt(plan.likes_count, 10) || 0;
        plan.user_has_liked = requestingUserId ? (parseInt(plan.user_has_liked, 10) > 0) : false;

        const exercisesSql = `
            SELECT wpe.exercise_id, wpe.target_sets, wpe.order_index, e.name as exercise_name
            FROM workout_plan_exercises wpe
            JOIN exercises e ON wpe.exercise_id = e.id
            WHERE wpe.plan_id = ?
            ORDER BY wpe.order_index ASC
        `;
        const [exercises] = await db.query(exercisesSql, [planId]);

        plan.exercises = exercises.map(ex => ({
            exerciseId: ex.exercise_id,
            name: ex.exercise_name,
            targetSets: ex.target_sets,
            orderIndex: ex.order_index
        }));

        return plan;
    },

    update: async (planId, userId, planData, exercises, userRole) => { // Added userRole
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            const [existingPlanRows] = await connection.query('SELECT user_id, status FROM workout_plans WHERE id = ?', [planId]);
            if (existingPlanRows.length === 0) {
                throw new Error('Plan not found.');
            }
            const existingPlan = existingPlanRows[0];

            // Permission check: Only owner or admin can update
            if (existingPlan.user_id !== userId && userRole !== 'Admin') {
                throw new Error('User does not have permission to update this plan.');
            }

            let newStatus;
            // If an admin is editing, they are likely using the dedicated status update endpoint.
            // If a regular user edits their own *approved* plan, it goes back to 'pending'.
            // If a regular user edits their own *pending* or *rejected* plan, it stays that way.
            // If an admin edits a plan (not via status endpoint), status should ideally remain unchanged unless explicitly part of planData.
            // For simplicity here, if user is not admin and plan was approved, set to pending. Otherwise, keep current status.
            if (userRole !== 'Admin' && existingPlan.status === 'approved') {
                newStatus = 'pending';
            } else {
                newStatus = existingPlan.status || 'pending'; // Default to 'pending' if current status is somehow null
            }
            
            // Admins can change status directly via updatePlanStatus, so this update keeps current status unless user is not admin and plan was approved
            // Or if status is part of planData (which it isn't in current frontend form for general update)
            const statusToSet = (planData.status && userRole === 'Admin') ? planData.status : newStatus;


            const updatePlanSql = 'UPDATE workout_plans SET name = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            const queryParams = [
                planData.name,
                planData.description || null,
                statusToSet, // Use the determined status
                planId
            ];
            // If not an admin, ensure they can only update their own plan
            // This is an additional safeguard, primary check was done above.
            // if (userRole !== 'Admin') {
            //     updatePlanSql += ' AND user_id = ?';
            //     queryParams.push(userId);
            // }

            const [updateResult] = await connection.query(updatePlanSql, queryParams);

            if (updateResult.affectedRows === 0) {
                 // This could happen if the WHERE clause (id = ? AND user_id = ?) didn't match,
                 // but we already checked ownership for non-admins.
                 // For admins, if planId is wrong, it won't match.
                throw new Error('Plan update failed. Plan not found or no changes made.');
            }

            const deleteLinksSql = 'DELETE FROM workout_plan_exercises WHERE plan_id = ?';
            await connection.query(deleteLinksSql, [planId]);

            if (exercises && exercises.length > 0) {
                const linkSql = 'INSERT INTO workout_plan_exercises (plan_id, exercise_id, target_sets, order_index) VALUES ?';
                const linkValues = exercises.map((ex, index) => [
                    planId,
                    ex.exerciseId,
                    ex.targetSets || null,
                    index
                ]);
                await connection.query(linkSql, [linkValues]);
            }

            await connection.commit();
            return await WorkoutPlan.findByIdWithDetails(planId, userId, userRole === 'Admin');

        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Error updating workout plan:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    deleteByIdAndUser: async (planId, userId, isAdmin = false) => {
        let sql = 'DELETE FROM workout_plans WHERE id = ?';
        const params = [planId];
        if (!isAdmin) {
            // Before deleting, ensure the user owns the plan if not an admin
            const [planRows] = await db.query('SELECT user_id FROM workout_plans WHERE id = ?', [planId]);
            if (planRows.length === 0 || planRows[0].user_id !== userId) {
                throw new Error('Plan not found or user does not have permission to delete it.');
            }
        }
        try {
            const [result] = await db.query(sql, params);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting workout plan:', error);
            throw error;
        }
    },

    updateStatus: async (planId, status, adminUserId) => {
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status value.');
        }
        const sql = `
            UPDATE workout_plans SET
                status = ?,
                approved_by_user_id = ?,
                approved_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        try {
            const [result] = await db.query(sql, [status, adminUserId, planId]);
            if (result.affectedRows > 0) {
                return await WorkoutPlan.findByIdWithDetails(planId, adminUserId, true);
            }
            return null;
        } catch (error) {
            console.error(`Error updating status for workout plan ${planId}:`, error);
            throw error;
        }
    }
};

module.exports = WorkoutPlan;
