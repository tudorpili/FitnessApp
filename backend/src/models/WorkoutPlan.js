// src/models/WorkoutPlan.js
const db = require('../config/db'); // Adjust path if needed

const WorkoutPlan = {
  /**
   * Creates a new workout plan and links its exercises, including target sets. Uses a transaction.
   * @param {number} userId - ID of the user creating the plan.
   * @param {object} planData - Object with plan details { name, description }.
   * @param {Array<object>} exercises - Array of exercise objects { exerciseId, targetSets }.
   * @returns {Promise<object>} The created workout plan header.
   */
  create: async (userId, planData, exercises) => { // Changed exerciseIds to exercises
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      // 1. Insert the plan header
      const planSql = 'INSERT INTO workout_plans (user_id, name, description) VALUES (?, ?, ?)';
      const [planResult] = await connection.query(planSql, [userId, planData.name, planData.description || null]);
      const newPlanId = planResult.insertId;

      if (!newPlanId) {
        throw new Error('Failed to create workout plan header.');
      }

      // 2. Insert exercise links with target sets if provided
      if (exercises && exercises.length > 0) {
        // Updated SQL to include target_sets
        const linkSql = 'INSERT INTO workout_plan_exercises (plan_id, exercise_id, target_sets, order_index) VALUES ?';
        // Prepare bulk insert values: [[planId, exerciseId, targetSets, index], ...]
        const linkValues = exercises.map((ex, index) => [
            newPlanId,
            ex.exerciseId,
            ex.targetSets || null, // Use provided targetSets or NULL
            index // Use index for order_index
        ]);
        await connection.query(linkSql, [linkValues]);
      }

      await connection.commit();

      // Fetch and return the created plan header
      const [createdPlan] = await connection.query('SELECT * FROM workout_plans WHERE id = ?', [newPlanId]);
      return createdPlan.length > 0 ? createdPlan[0] : null;

    } catch (error) {
      if (connection) await connection.rollback();
      console.error('Error creating workout plan:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  /**
   * Finds all workout plans, including creator username and associated exercise details (with target sets).
   * @returns {Promise<Array>} Array of workout plan objects.
   */
  findAllWithDetails: async () => {
    const plansSql = `
        SELECT wp.*, u.username as creator_username
        FROM workout_plans wp
        JOIN users u ON wp.user_id = u.id
        ORDER BY wp.created_at DESC
    `;
    const [plans] = await db.query(plansSql);

    if (plans.length === 0) return [];

    const planIds = plans.map(p => p.id);

    // Updated SQL to select target_sets
    const exercisesSql = `
        SELECT wpe.plan_id, wpe.exercise_id, wpe.target_sets, wpe.order_index, e.name as exercise_name
        FROM workout_plan_exercises wpe
        JOIN exercises e ON wpe.exercise_id = e.id
        WHERE wpe.plan_id IN (?)
        ORDER BY wpe.plan_id, wpe.order_index ASC
    `;
    const [exercises] = await db.query(exercisesSql, [planIds]);

    const exercisesByPlanId = exercises.reduce((acc, ex) => {
      if (!acc[ex.plan_id]) {
        acc[ex.plan_id] = [];
      }
      acc[ex.plan_id].push({
        exerciseId: ex.exercise_id,
        name: ex.exercise_name,
        targetSets: ex.target_sets, // Include target_sets
        orderIndex: ex.order_index
      });
      return acc;
    }, {});

    const plansWithDetails = plans.map(plan => ({
      ...plan,
      exercises: exercisesByPlanId[plan.id] || []
    }));

    return plansWithDetails;
  },

  /**
   * Finds a single workout plan by ID, including details (with target sets).
   * @param {number} planId - The ID of the plan to find.
   * @returns {Promise<object|null>} The plan object or null if not found.
   */
  findByIdWithDetails: async (planId) => {
    const planSql = `
        SELECT wp.*, u.username as creator_username
        FROM workout_plans wp
        JOIN users u ON wp.user_id = u.id
        WHERE wp.id = ?
    `;
    const [planResult] = await db.query(planSql, [planId]);

    if (planResult.length === 0) return null;
    const plan = planResult[0];

    // Updated SQL to select target_sets
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
        targetSets: ex.target_sets, // Include target_sets
        orderIndex: ex.order_index
    }));

    return plan;
  },

  /**
   * Updates an existing workout plan and its exercises (with target sets). Uses a transaction.
   * Checks for ownership before updating.
   * @param {number} planId - ID of the plan to update.
   * @param {number} userId - ID of the user attempting the update.
   * @param {object} planData - Object with updated plan details { name, description }.
   * @param {Array<object>} exercises - Array of the *new* set of exercise objects { exerciseId, targetSets }.
   * @returns {Promise<object|null>} The updated workout plan header or null if not found/not owner.
   */
  update: async (planId, userId, planData, exercises) => { // Changed exerciseIds to exercises
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      // 1. Verify ownership and update the plan header
      const updatePlanSql = 'UPDATE workout_plans SET name = ?, description = ? WHERE id = ? AND user_id = ?';
      const [updateResult] = await connection.query(updatePlanSql, [ planData.name, planData.description || null, planId, userId ]);

      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        console.log(`Plan update failed: Plan ID ${planId} not found or user ID ${userId} mismatch.`);
        return null;
      }

      // 2. Delete existing exercise links
      const deleteLinksSql = 'DELETE FROM workout_plan_exercises WHERE plan_id = ?';
      await connection.query(deleteLinksSql, [planId]);

      // 3. Insert new exercise links with target sets if provided
      if (exercises && exercises.length > 0) {
        // Updated SQL to include target_sets
        const linkSql = 'INSERT INTO workout_plan_exercises (plan_id, exercise_id, target_sets, order_index) VALUES ?';
        // Prepare bulk insert values: [[planId, exerciseId, targetSets, index], ...]
        const linkValues = exercises.map((ex, index) => [
            planId,
            ex.exerciseId,
            ex.targetSets || null, // Use provided targetSets or NULL
            index
        ]);
        await connection.query(linkSql, [linkValues]);
      }

      await connection.commit();

      // Fetch and return the updated plan header
      const [updatedPlan] = await connection.query('SELECT * FROM workout_plans WHERE id = ?', [planId]);
      return updatedPlan.length > 0 ? updatedPlan[0] : null;

    } catch (error) {
      if (connection) await connection.rollback();
      console.error('Error updating workout plan:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  deleteByIdAndUser: async (planId, userId) => { /* ... (delete function remains the same) ... */ const sql = 'DELETE FROM workout_plans WHERE id = ? AND user_id = ?'; try { const [result] = await db.query(sql, [planId, userId]); return result.affectedRows > 0; } catch (error) { console.error('Error deleting workout plan:', error); throw error; } },

};

module.exports = WorkoutPlan;
