// src/mockData/foods.js

// Basic food items for searching.
// In a real app, this would come from a large database via API.
export const mockFoods = [
    { id: 'f1', name: 'Apple', caloriesPer100g: 52, protein: 0.3, carbs: 14, fat: 0.2, defaultServingG: 180, unitName: 'medium' },
    { id: 'f2', name: 'Banana', caloriesPer100g: 89, protein: 1.1, carbs: 23, fat: 0.3, defaultServingG: 120, unitName: 'medium' },
    { id: 'f3', name: 'Chicken Breast (Cooked)', caloriesPer100g: 165, protein: 31, carbs: 0, fat: 3.6, defaultServingG: 100, unitName: 'g' },
    { id: 'f4', name: 'Broccoli (Steamed)', caloriesPer100g: 55, protein: 3.7, carbs: 11, fat: 0.6, defaultServingG: 150, unitName: 'cup' },
    { id: 'f5', name: 'Rice (White, Cooked)', caloriesPer100g: 130, protein: 2.7, carbs: 28, fat: 0.3, defaultServingG: 150, unitName: 'cup cooked' },
    { id: 'f6', name: 'Salmon (Cooked)', caloriesPer100g: 208, protein: 20, carbs: 0, fat: 13, defaultServingG: 100, unitName: 'g' },
    { id: 'f7', name: 'Whole Egg (Large, Boiled)', caloriesPer100g: 155, protein: 13, carbs: 1.1, fat: 11, defaultServingG: 50, unitName: 'large' }, // Note: Cal/100g for comparison, default serving is per egg
    { id: 'f8', name: 'Almonds', caloriesPer100g: 579, protein: 21, carbs: 22, fat: 49, defaultServingG: 28, unitName: 'oz (approx 23)' },
    { id: 'f9', name: 'Greek Yogurt (Plain, Nonfat)', caloriesPer100g: 59, protein: 10, carbs: 3.6, fat: 0.4, defaultServingG: 170, unitName: 'container (6oz)' },
    { id: 'f10', name: 'Olive Oil', caloriesPer100g: 884, protein: 0, carbs: 0, fat: 100, defaultServingG: 14, unitName: 'tbsp' },
    { id: 'f11', name: 'Spinach (Raw)', caloriesPer100g: 23, protein: 2.9, carbs: 3.6, fat: 0.4, defaultServingG: 30, unitName: 'cup' },
    { id: 'f12', name: 'Whole Wheat Bread', caloriesPer100g: 247, protein: 13, carbs: 41, fat: 3.4, defaultServingG: 32, unitName: 'slice' },
  
  ];
  
  // Helper function to get calories for a specific serving (example)
  export const calculateMacros = (food, quantityG) => {
      if (!food || !quantityG) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
      const factor = quantityG / 100;
      return {
          calories: Math.round(food.caloriesPer100g * factor),
          protein: Math.round(food.protein * factor * 10) / 10, // round to 1 decimal
          carbs: Math.round(food.carbs * factor * 10) / 10,
          fat: Math.round(food.fat * factor * 10) / 10,
      };
  };
  