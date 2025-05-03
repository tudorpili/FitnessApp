// backend/src/controllers/exerciseController.js

// --- MODIFICAT: Importam Modelul Exercise ---
const Exercise = require('../models/Exercise.js'); // Ajusteaza calea daca e necesar
// --- END MODIFICAT ---

// Controller function to get all exercises
const getAllExercises = async (req, res, next) => {
  console.log('[Controller] Received request for getAllExercises');
  try {
    // --- MODIFICAT: Apelam functia din model ---
    const exercises = await Exercise.findAll();
    // --- END MODIFICAT ---

    console.log(`[Controller] Sending ${exercises.length} exercises.`);
    res.status(200).json(exercises);

  } catch (error) {
    console.error('[Controller] Error in getAllExercises:', error);
    // Optional: trimite eroarea catre un middleware de erori centralizat
    // next(error);
    res.status(500).json({ message: 'Error fetching exercises.' }); // Trimite un raspuns de eroare generic
  }
};

// Controller function to get a single exercise by ID
const getExerciseById = async (req, res, next) => {
    const exerciseId = req.params.id;
    console.log(`[Controller] Received request for getExerciseById: ${exerciseId}`);
    try {
        // --- MODIFICAT: Apelam functia din model ---
        const exercise = await Exercise.findById(exerciseId);
        // --- END MODIFICAT ---

        if (!exercise) {
             console.log(`[Controller] Exercise ${exerciseId} not found.`);
            // Daca modelul returneaza null, trimitem 404 Not Found
            return res.status(404).json({ message: 'Exercise not found.' });
        }
        console.log(`[Controller] Sending exercise ${exerciseId}.`);
        res.status(200).json(exercise); // Trimitem exercitiul gasit

    } catch (error) {
        console.error(`[Controller] Error in getExerciseById (${exerciseId}):`, error);
        res.status(500).json({ message: 'Error fetching exercise.' });
    }
};


// --- Add more controller functions later ---
// const createExercise = async (req, res, next) => {
//      try {
//          const newExercise = await Exercise.create(req.body);
//          res.status(201).json(newExercise);
//      } catch (error) { ... }
// };
// ... etc ...


// Exportam functiile controller-ului
module.exports = {
  getAllExercises,
  getExerciseById,
  // Export other functions as you create them
};
