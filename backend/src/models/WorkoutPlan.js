// src/models/WorkoutPlan.js
const db = require('../config/db'); 

const WorkoutPlan = {
  
  create: async (userId, planData, exercises) => { 
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      
      const planSql = 'INSERT INTO workout_plans (user_id, name, description) VALUES (?, ?, ?)';
      const [planResult] = await connection.query(planSql, [userId, planData.name, planData.description || null]);
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
        targetSets: ex.target_sets, 
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

  
  update: async (planId, userId, planData, exercises) => { 
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      
      const updatePlanSql = 'UPDATE workout_plans SET name = ?, description = ? WHERE id = ? AND user_id = ?';
      const [updateResult] = await connection.query(updatePlanSql, [ planData.name, planData.description || null, planId, userId ]);

      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        console.log(`Plan update failed: Plan ID ${planId} not found or user ID ${userId} mismatch.`);
        return null;
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

  deleteByIdAndUser: async (planId, userId) => {  const sql = 'DELETE FROM workout_plans WHERE id = ? AND user_id = ?'; try { const [result] = await db.query(sql, [planId, userId]); return result.affectedRows > 0; } catch (error) { console.error('Error deleting workout plan:', error); throw error; } },

};

module.exports = WorkoutPlan;
