// src/routes/recipeRoutes.js

const express = require('express');

const recipeController = require('../controllers/recipeController');




const router = express.Router();




router.get('/', recipeController.getAllRecipes);


router.get('/:id', recipeController.getRecipeById);







router.post('/', recipeController.createRecipe); 



router.put('/:id', recipeController.updateRecipe); 




router.delete('/:id', recipeController.deleteRecipe); 


module.exports = router;
