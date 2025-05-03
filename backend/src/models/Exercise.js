// backend/src/models/Exercise.js

// Importam pool-ul de conexiuni la baza de date
const dbPool = require('../config/db.js');

// Modelul Exercise - un obiect sau clasa care grupeaza operatiunile pe baza de date
const Exercise = {

  /**
   * Gaseste toate exercitiile din baza de date.
   * @returns {Promise<Array>} Un array cu obiecte reprezentand exercitiile.
   * @throws {Error} Arunca eroare daca interogarea esueaza.
   */
  async findAll() {
    try {
      // Executam interogarea SQL pentru a selecta toate exercitiile
      const query = 'SELECT * FROM exercises ORDER BY name ASC';
      console.log('[Exercise Model] Executing query:', query);
      const [results] = await dbPool.query(query);
      console.log(`[Exercise Model] Found ${results.length} exercises.`);
      return results;
    } catch (error) {
      console.error('[Exercise Model] Error in findAll:', error);
      // Aruncam eroarea mai departe pentru a fi prinsa de controller
      throw error;
    }
  },

  /**
   * Gaseste un exercitiu specific dupa ID.
   * @param {number|string} id - ID-ul exercitiului cautat.
   * @returns {Promise<Object|null>} Obiectul exercitiu sau null daca nu este gasit.
   * @throws {Error} Arunca eroare daca interogarea esueaza.
   */
  async findById(id) {
    try {
      // Folosim un placeholder (?) pentru a preveni SQL injection
      const query = 'SELECT * FROM exercises WHERE id = ?'; // Asigura-te ca `id` este numele coloanei tale PK
      console.log('[Exercise Model] Executing query:', query, [id]);
      const [results] = await dbPool.query(query, [id]);

      if (results.length > 0) {
        console.log(`[Exercise Model] Found exercise with ID: ${id}`);
        return results[0]; // Returnam primul (si singurul) rezultat
      } else {
        console.log(`[Exercise Model] Exercise with ID ${id} not found.`);
        return null; // Nu s-a gasit exercitiul
      }
    } catch (error) {
      console.error(`[Exercise Model] Error in findById (${id}):`, error);
      throw error;
    }
  },

  // --- Adauga aici alte functii pentru Model (Create, Update, Delete) ---
  /*
  async create(exerciseData) {
    // Logica pentru INSERT INTO exercises...
  },

  async update(id, exerciseData) {
    // Logica pentru UPDATE exercises SET ... WHERE id = ?
  },

  async delete(id) {
    // Logica pentru DELETE FROM exercises WHERE id = ?
  }
  */

};

// Exportam modelul
module.exports = Exercise;
