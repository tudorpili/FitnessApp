// src/models/Recipe.js

// Import the database query function
// Adjust the path based on your actual db config file location
const db = require('../config/db');

// Model object to hold database interaction methods
const Recipe = {
  /**
   * Finds all recipes in the database.
   * @returns {Promise<Array>} A promise that resolves to an array of recipe objects.
   */
  findAll: async () => {
    // SQL query to select all columns from the recipes table
    const sql = 'SELECT * FROM recipes';
    try {
      // Execute the query using the imported db connection/pool
      // The result structure might vary slightly depending on your db library (e.g., [rows, fields])
      const [rows] = await db.query(sql);
      // Return the array of recipe rows
      return rows;
    } catch (error) {
      // Log the error for debugging
      console.error('Error fetching all recipes:', error);
      // Re-throw the error to be handled by the controller
      throw error;
    }
  },

  /**
   * Finds a single recipe by its ID.
   * @param {number} id - The ID of the recipe to find.
   * @returns {Promise<Object|null>} A promise that resolves to the recipe object or null if not found.
   */
  findById: async (id) => {
    // SQL query to select a recipe by its primary key (id)
    // Using a placeholder (?) prevents SQL injection vulnerabilities
    const sql = 'SELECT * FROM recipes WHERE id = ?';
    try {
      // Execute the query, passing the id as a parameter
      const [rows] = await db.query(sql, [id]);
      // If a recipe is found (rows array is not empty), return the first result
      // Otherwise, return null
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error fetching recipe with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new recipe in the database.
   * @param {object} recipeData - An object containing the recipe details.
   * Expected fields: title, description, image_url, prep_time, cook_time, servings,
   * tags (JSON string), ingredients (JSON string), instructions (JSON string),
   * nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat, user_id (optional)
   * @returns {Promise<object>} A promise that resolves to the newly created recipe object (including its ID).
   */
  create: async (recipeData) => {
    // Destructure the expected fields from the recipeData object
    const {
      title, description, image_url, prep_time, cook_time, servings,
      tags, ingredients, instructions,
      nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat, user_id // user_id might be null
    } = recipeData;

    // SQL query to insert a new row into the recipes table
    // Using placeholders (?) for all values
    const sql = `
      INSERT INTO recipes (
        title, description, image_url, prep_time, cook_time, servings,
        tags, ingredients, instructions,
        nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Array of values corresponding to the placeholders
    const values = [
      title, description, image_url, prep_time, cook_time, servings,
      // Ensure tags, ingredients, instructions are stringified JSON if not already
      JSON.stringify(tags),
      JSON.stringify(ingredients),
      JSON.stringify(instructions),
      nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat, user_id
    ];

    try {
      // Execute the insert query
      // The result object often contains information like insertId
      const [result] = await db.query(sql, values);
      // If the insert was successful, fetch the newly created recipe by its ID
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

  /**
   * Updates an existing recipe in the database.
   * @param {number} id - The ID of the recipe to update.
   * @param {object} recipeData - An object containing the fields to update.
   * @returns {Promise<object|null>} A promise that resolves to the updated recipe object or null if not found.
   */
  update: async (id, recipeData) => {
    // Destructure the fields that can be updated
    // Note: We might want more specific update logic, but this updates all provided fields
     const {
      title, description, image_url, prep_time, cook_time, servings,
      tags, ingredients, instructions,
      nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat // user_id is usually not updated here
    } = recipeData;

    // SQL query to update a recipe based on its ID
    const sql = `
      UPDATE recipes SET
        title = ?, description = ?, image_url = ?, prep_time = ?, cook_time = ?, servings = ?,
        tags = ?, ingredients = ?, instructions = ?,
        nutrition_calories = ?, nutrition_protein = ?, nutrition_carbs = ?, nutrition_fat = ?
      WHERE id = ?
    `;

    // Array of values for the update statement
    const values = [
      title, description, image_url, prep_time, cook_time, servings,
      JSON.stringify(tags), JSON.stringify(ingredients), JSON.stringify(instructions),
      nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat,
      id // The last value corresponds to the WHERE clause
    ];

    try {
      // Execute the update query
      const [result] = await db.query(sql, values);
      // Check if any rows were actually affected (meaning the ID existed)
      if (result.affectedRows > 0) {
        // Fetch and return the updated recipe
        return await Recipe.findById(id);
      } else {
        // If no rows were affected, the recipe with the given ID was not found
        return null;
      }
    } catch (error) {
      console.error(`Error updating recipe with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a recipe from the database.
   * @param {number} id - The ID of the recipe to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful, false otherwise.
   */
  delete: async (id) => {
    // SQL query to delete a recipe by its ID
    const sql = 'DELETE FROM recipes WHERE id = ?';
    try {
      // Execute the delete query
      const [result] = await db.query(sql, [id]);
      // Return true if a row was deleted, false otherwise
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting recipe with id ${id}:`, error);
      throw error;
    }
  }
};

// Export the Recipe model object
module.exports = Recipe;
