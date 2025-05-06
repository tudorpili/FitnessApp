// src/models/Exercise.js
const db = require('../config/db'); // Adjust path if needed

const Exercise = {
  /**
   * Finds all exercises.
   * @returns {Promise<Array>} Array of exercise objects.
   */
  findAll: async () => {
    const sql = 'SELECT * FROM exercises ORDER BY name ASC'; // Added default ordering
    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (error) {
      console.error('Error fetching all exercises:', error);
      throw error;
    }
  },

  /**
   * Finds a single exercise by its ID.
   * @param {number} id - The ID of the exercise.
   * @returns {Promise<object|null>} The exercise object or null if not found.
   */
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

  /**
   * Creates a new exercise.
   * @param {object} exerciseData - Data for the new exercise.
   * Expected fields: name, description, muscle, difficulty, equipment, image_url, videos (array)
   * @returns {Promise<object>} The newly created exercise object.
   */
  create: async (exerciseData) => {
    const {
      name, description, muscle, difficulty, equipment, image_url, videos // videos is expected as an array
    } = exerciseData;

    // Convert videos array to JSON string for storage
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
      // Fetch and return the newly created exercise
      return await Exercise.findById(insertId);
    } catch (error) {
      console.error('Error creating exercise:', error);
      // Handle specific errors like duplicate name if 'name' has a UNIQUE constraint
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error(`An exercise with the name "${name}" already exists.`);
      }
      throw error;
    }
  },

  /**
   * Updates an existing exercise.
   * @param {number} id - The ID of the exercise to update.
   * @param {object} exerciseData - Data fields to update.
   * @returns {Promise<object|null>} The updated exercise object or null if not found.
   */
  update: async (id, exerciseData) => {
    const {
      name, description, muscle, difficulty, equipment, image_url, videos
    } = exerciseData;

     // Convert videos array to JSON string for storage
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
      id // For the WHERE clause
    ];

    try {
      const [result] = await db.query(sql, values);
      if (result.affectedRows === 0) {
        return null; // Exercise with the given ID not found
      }
      // Fetch and return the updated exercise
      return await Exercise.findById(id);
    } catch (error) {
      console.error(`Error updating exercise with id ${id}:`, error);
       if (error.code === 'ER_DUP_ENTRY') {
        throw new Error(`An exercise with the name "${name}" already exists.`);
      }
      throw error;
    }
  },

  /**
   * Deletes an exercise by its ID.
   * @param {number} id - The ID of the exercise to delete.
   * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
   */
  deleteById: async (id) => {
    // Note: If exercises are linked in workout_plan_exercises or workout_session_exercises
    // with ON DELETE CASCADE, those links will be deleted too.
    // If ON DELETE SET NULL was used, the foreign keys will become NULL.
    const sql = 'DELETE FROM exercises WHERE id = ?';
    try {
      const [result] = await db.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting exercise with id ${id}:`, error);
      throw error;
    }
  }
};

module.exports = Exercise;

