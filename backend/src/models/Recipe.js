// src/models/Recipe.js



const db = require('../config/db');


const Recipe = {
  
  findAll: async () => {
    
    const sql = 'SELECT * FROM recipes';
    try {
      
      
      const [rows] = await db.query(sql);
      
      return rows;
    } catch (error) {
      
      console.error('Error fetching all recipes:', error);
      
      throw error;
    }
  },

  
  findById: async (id) => {
    
    
    const sql = 'SELECT * FROM recipes WHERE id = ?';
    try {
      
      const [rows] = await db.query(sql, [id]);
      
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error fetching recipe with id ${id}:`, error);
      throw error;
    }
  },

  
  create: async (recipeData) => {
    
    const {
      title, description, image_url, prep_time, cook_time, servings,
      tags, ingredients, instructions,
      nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat, user_id 
    } = recipeData;

    
    
    const sql = `
      INSERT INTO recipes (
        title, description, image_url, prep_time, cook_time, servings,
        tags, ingredients, instructions,
        nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    
    const values = [
      title, description, image_url, prep_time, cook_time, servings,
      
      JSON.stringify(tags),
      JSON.stringify(ingredients),
      JSON.stringify(instructions),
      nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat, user_id
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

  
  update: async (id, recipeData) => {
    
    
     const {
      title, description, image_url, prep_time, cook_time, servings,
      tags, ingredients, instructions,
      nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat 
    } = recipeData;

    
    const sql = `
      UPDATE recipes SET
        title = ?, description = ?, image_url = ?, prep_time = ?, cook_time = ?, servings = ?,
        tags = ?, ingredients = ?, instructions = ?,
        nutrition_calories = ?, nutrition_protein = ?, nutrition_carbs = ?, nutrition_fat = ?
      WHERE id = ?
    `;

    
    const values = [
      title, description, image_url, prep_time, cook_time, servings,
      JSON.stringify(tags), JSON.stringify(ingredients), JSON.stringify(instructions),
      nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat,
      id 
    ];

    try {
      
      const [result] = await db.query(sql, values);
      
      if (result.affectedRows > 0) {
        
        return await Recipe.findById(id);
      } else {
        
        return null;
      }
    } catch (error) {
      console.error(`Error updating recipe with id ${id}:`, error);
      throw error;
    }
  },

  
  delete: async (id) => {
    
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
