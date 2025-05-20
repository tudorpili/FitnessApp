// backend/src/models/Recipe.js
const db = require('../config/db');

const Recipe = {
  findAll: async (isAdmin = false) => {
    let sql = `
      SELECT 
        r.id, r.user_id, r.title, r.description, r.image_url, 
        r.prep_time, r.cook_time, r.servings, r.tags, 
        r.ingredients, r.instructions, 
        r.nutrition_calories, r.nutrition_protein, r.nutrition_carbs, r.nutrition_fat,
        r.status, r.approved_by_user_id, r.approved_at,
        r.created_at, r.updated_at,
        u.username as creator_username,  -- Username of the recipe creator
        ua.username as approver_username -- Username of the admin who approved/rejected
      FROM recipes r
      LEFT JOIN users u ON r.user_id = u.id -- Changed to LEFT JOIN
      LEFT JOIN users ua ON r.approved_by_user_id = ua.id 
    `;

    if (!isAdmin) {
      sql += " WHERE r.status = 'approved'";
    }
    sql += ' ORDER BY r.created_at DESC';

    try {
      const [rows] = await db.query(sql);
      return rows.map(row => ({
        ...row,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
        ingredients: typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : row.ingredients,
        instructions: typeof row.instructions === 'string' ? JSON.parse(row.instructions) : row.instructions,
      }));
    } catch (error) {
      console.error('Error fetching all recipes:', error);
      throw error;
    }
  },

  findById: async (id) => {
    const sql = `
      SELECT 
        r.*, 
        u.username as creator_username,
        ua.username as approver_username 
      FROM recipes r
      LEFT JOIN users u ON r.user_id = u.id -- Changed to LEFT JOIN
      LEFT JOIN users ua ON r.approved_by_user_id = ua.id
      WHERE r.id = ?
    `;
    try {
      const [rows] = await db.query(sql, [id]);
      if (rows.length > 0) {
        const recipe = rows[0];
        recipe.tags = typeof recipe.tags === 'string' ? JSON.parse(recipe.tags) : recipe.tags;
        recipe.ingredients = typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients;
        recipe.instructions = typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : recipe.instructions;
        return recipe;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching recipe with id ${id}:`, error);
      throw error;
    }
  },

  // create, update, updateStatus, delete methods remain the same as in artifact backend_model_recipe_validation
  create: async (recipeData, userId) => {
    const {
      title, description, image_url, prep_time, cook_time, servings,
      tags, ingredients, instructions,
      nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat
    } = recipeData;
    const status = 'pending';
    const sql = `
      INSERT INTO recipes (
        user_id, title, description, image_url, prep_time, cook_time, servings,
        tags, ingredients, instructions,
        nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat,
        status 
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      userId, title, description || null, image_url || null, prep_time || null, cook_time || null, servings || null,
      JSON.stringify(tags || []),
      JSON.stringify(ingredients || []),
      JSON.stringify(instructions || []),
      nutrition_calories || null, nutrition_protein || null, nutrition_carbs || null, nutrition_fat || null,
      status
    ];
    try {
      const [result] = await db.query(sql, values);
      if (result.insertId) {
        return await Recipe.findById(result.insertId);
      } else {
        throw new Error('Recipe creation failed, no insert ID returned.');
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  },

  update: async (id, recipeData, currentUserId, currentUserRole) => {
    const {
      title, description, image_url, prep_time, cook_time, servings,
      tags, ingredients, instructions,
      nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat
    } = recipeData;
    const existingRecipe = await Recipe.findById(id);
    if (!existingRecipe) return null;
    if (existingRecipe.user_id !== currentUserId && currentUserRole !== 'Admin') {
      throw new Error('You do not have permission to update this recipe.');
    }
    const sql = `
      UPDATE recipes SET
        title = ?, description = ?, image_url = ?, prep_time = ?, cook_time = ?, servings = ?,
        tags = ?, ingredients = ?, instructions = ?,
        nutrition_calories = ?, nutrition_protein = ?, nutrition_carbs = ?, nutrition_fat = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const values = [
      title, description || null, image_url || null, prep_time || null, cook_time || null, servings || null,
      JSON.stringify(tags || []), JSON.stringify(ingredients || []), JSON.stringify(instructions || []),
      nutrition_calories || null, nutrition_protein || null, nutrition_carbs || null, nutrition_fat || null,
      id
    ];
    try {
      const [result] = await db.query(sql, values);
      if (result.affectedRows > 0) {
        return await Recipe.findById(id);
      }
      return null;
    } catch (error) {
      console.error(`Error updating recipe with id ${id}:`, error);
      throw error;
    }
  },

  updateStatus: async (recipeId, status, adminUserId) => {
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status value.');
    }
    const sql = `
      UPDATE recipes SET
        status = ?,
        approved_by_user_id = ?,
        approved_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    try {
      const [result] = await db.query(sql, [status, adminUserId, recipeId]);
      if (result.affectedRows > 0) {
        return await Recipe.findById(recipeId);
      }
      return null;
    } catch (error) {
      console.error(`Error updating status for recipe ${recipeId}:`, error);
      throw error;
    }
  },

  delete: async (id, currentUserId, currentUserRole) => {
    const existingRecipe = await Recipe.findById(id);
    if (!existingRecipe) return false;
    if (existingRecipe.user_id !== currentUserId && currentUserRole !== 'Admin') {
      throw new Error('You do not have permission to delete this recipe.');
    }
    const sql = 'DELETE FROM recipes WHERE id = ?';
    try {
      const [result] = await db.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting recipe with id ${id}:`, error);
      throw error;
    }
  }
};

module.exports = Recipe;
