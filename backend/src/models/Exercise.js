// src/models/Exercise.js
const db = require('../config/db'); 

const Exercise = {
  
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
  }
};

module.exports = Exercise;

