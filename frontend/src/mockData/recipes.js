// src/mockData/recipes.js

export const mockRecipes = [
    {
      id: 'recipe-1', // Use unique IDs
      title: 'Simple Grilled Chicken Salad',
      description: 'A quick, healthy, and protein-packed salad perfect for lunch or a light dinner. Easy to customize!',
      imageUrl: '../images/chicken-salad2.jpg', // Placeholder
      prepTime: '10 mins',
      cookTime: '15 mins',
      servings: 2,
      tags: ['Healthy', 'Quick', 'Lunch', 'High Protein'],
      ingredients: [
        { quantity: 2, unit: '', name: 'Chicken Breasts (boneless, skinless)' },
        { quantity: 5, unit: 'cups', name: 'Mixed Greens or Romaine Lettuce' },
        { quantity: 1, unit: 'cup', name: 'Cherry Tomatoes, halved' },
        { quantity: 0.5, unit: 'cup', name: 'Cucumber, sliced' },
        { quantity: 0.25, unit: 'cup', name: 'Red Onion, thinly sliced' },
        { quantity: 2, unit: 'tbsp', name: 'Olive Oil' },
        { quantity: 1, unit: 'tbsp', name: 'Lemon Juice' },
        { quantity: 1, unit: 'pinch', name: 'Salt & Freshly Ground Black Pepper' },
        { quantity: 1, unit: 'tsp', name: 'Dried Oregano (optional)' },
      ],
      instructions: [
        'Preheat grill or grill pan to medium-high heat.',
        'Pat chicken breasts dry and season generously with salt, pepper, and oregano (if using).',
        'Grill chicken for 6-8 minutes per side, or until cooked through (internal temperature reaches 165°F / 74°C).',
        'Remove chicken from grill, let it rest for 5 minutes, then slice thinly.',
        'While chicken rests, combine mixed greens, tomatoes, cucumber, and red onion in a large salad bowl.',
        'In a small bowl, whisk together olive oil and lemon juice. Season dressing with salt and pepper.',
        'Add sliced grilled chicken to the salad bowl. Drizzle with dressing and toss gently to combine.',
        'Divide salad between plates and serve immediately.'
      ],
      // Nutrition is estimated per serving
      nutrition: {
        calories: 450, protein: 50, carbs: 10, fat: 25
      }
    },
    {
      id: 'recipe-2',
      title: 'Quick Lentil Soup',
      description: 'A hearty and nutritious vegetarian lentil soup, ready in about 30 minutes.',
      imageUrl: '../images/lentil-soup.jpg', // Placeholder
      prepTime: '10 mins',
      cookTime: '25 mins',
      servings: 4,
      tags: ['Vegetarian', 'Soup', 'Quick', 'Healthy', 'Fiber'],
      ingredients: [
        { quantity: 1, unit: 'tbsp', name: 'Olive Oil' },
        { quantity: 1, unit: '', name: 'Onion, chopped' },
        { quantity: 2, unit: '', name: 'Carrots, chopped' },
        { quantity: 2, unit: 'stalks', name: 'Celery, chopped' },
        { quantity: 2, unit: 'cloves', name: 'Garlic, minced' },
        { quantity: 1, unit: 'tsp', name: 'Cumin' },
        { quantity: 0.5, unit: 'tsp', name: 'Smoked Paprika' },
        { quantity: 1, unit: 'cup', name: 'Brown or Green Lentils, rinsed' },
        { quantity: 4, unit: 'cups', name: 'Vegetable Broth' },
        { quantity: 1, unit: 'can (14.5 oz)', name: 'Diced Tomatoes, undrained' },
        { quantity: 1, unit: 'pinch', name: 'Salt & Pepper to taste' },
      ],
      instructions: [
        'Heat olive oil in a large pot or Dutch oven over medium heat.',
        'Add onion, carrots, and celery. Cook until softened, about 5-7 minutes.',
        'Stir in garlic, cumin, and smoked paprika. Cook for 1 minute more until fragrant.',
        'Add the rinsed lentils, vegetable broth, and diced tomatoes (with juice).',
        'Bring to a boil, then reduce heat, cover, and simmer for 20-25 minutes, or until lentils are tender.',
        'Season with salt and pepper to taste.',
        'Serve hot, optionally garnished with fresh parsley or a dollop of yogurt.'
      ],
      nutrition: {
        calories: 300, protein: 15, carbs: 50, fat: 5
      }
    },
      {
      id: 'recipe-3',
      title: 'Overnight Oats',
      description: 'Easy and customizable overnight oats for a quick grab-and-go breakfast.',
      imageUrl: '../images/overnight-oats.jpg', // Placeholder
      prepTime: '5 mins',
      cookTime: '0 mins (chill time: 4+ hours)',
      servings: 1,
      tags: ['Breakfast', 'Quick', 'Healthy', 'Vegetarian', 'Customizable'],
      ingredients: [
        { quantity: 0.5, unit: 'cup', name: 'Rolled Oats (Old Fashioned)' },
        { quantity: 0.5, unit: 'cup', name: 'Milk (any kind - dairy, almond, soy)' },
        { quantity: 0.25, unit: 'cup', name: 'Greek Yogurt (optional, for creaminess)' },
        { quantity: 1, unit: 'tbsp', name: 'Chia Seeds' },
        { quantity: 1, unit: 'tsp', name: 'Maple Syrup or Honey (optional sweetener)' },
        { quantity: 0.5, unit: 'tsp', name: 'Vanilla Extract (optional)' },
        { quantity: 1, unit: 'pinch', name: 'Salt' },
      ],
      instructions: [
        'Combine all ingredients in a jar or container with a lid.',
        'Stir well to ensure everything is mixed.',
        'Secure the lid and refrigerate for at least 4 hours, or preferably overnight.',
        'In the morning, stir again. Add toppings like fresh fruit, nuts, seeds, or nut butter if desired.',
        'Enjoy cold!'
      ],
      nutrition: { // Base nutrition without toppings/sweetener
        calories: 250, protein: 15, carbs: 40, fat: 5
      }
    },
    {
        id: 'recipe-4',
        title: 'Baked Salmon & Roasted Asparagus',
        description: 'A simple, elegant, and healthy sheet pan dinner featuring flaky salmon and tender asparagus.',
        imageUrl: '../images/salmon.jpg', // Placeholder
        prepTime: '10 mins',
        cookTime: '15 mins',
        servings: 2,
        tags: ['Healthy', 'Dinner', 'Quick', 'Low Carb', 'High Protein', 'Omega-3'],
        ingredients: [
          { quantity: 2, unit: 'x 6oz', name: 'Salmon Fillets, skin on or off' },
          { quantity: 1, unit: 'bunch', name: 'Asparagus, trimmed' },
          { quantity: 2, unit: 'tbsp', name: 'Olive Oil, divided' },
          { quantity: 1, unit: '', name: 'Lemon, half sliced, half juiced' },
          { quantity: 2, unit: 'cloves', name: 'Garlic, minced' },
          { quantity: 1, unit: 'pinch', name: 'Salt & Black Pepper to taste' },
          { quantity: 0.5, unit: 'tsp', name: 'Dried Dill or Fresh Parsley (optional)' },
        ],
        instructions: [
          'Preheat oven to 400°F (200°C). Line a baking sheet with parchment paper.',
          'Place asparagus on one side of the baking sheet. Drizzle with 1 tbsp olive oil, salt, and pepper. Toss to coat.',
          'Pat salmon fillets dry. Place them on the other side of the baking sheet.',
          'In a small bowl, mix remaining 1 tbsp olive oil, minced garlic, lemon juice, salt, pepper, and dill (if using).',
          'Brush the olive oil mixture over the salmon fillets. Top each fillet with lemon slices.',
          'Roast for 12-15 minutes, or until salmon is cooked through and flakes easily, and asparagus is tender-crisp.',
          'Serve immediately.'
        ],
        nutrition: {
          calories: 500, protein: 45, carbs: 8, fat: 30
        }
      },
    
      // --- NEW RECIPE 2 ---
      {
        id: 'recipe-5',
        title: 'Berry Banana Smoothie',
        description: 'A refreshing and quick smoothie packed with antioxidants and flavor.',
        imageUrl: '../images/berry-smoothie.jpg', // Placeholder
        prepTime: '5 mins',
        cookTime: '0 mins',
        servings: 1,
        tags: ['Smoothie', 'Breakfast', 'Snack', 'Quick', 'Healthy', 'Vegetarian', 'Vegan Option'],
        ingredients: [
          { quantity: 1, unit: '', name: 'Banana (preferably frozen)' },
          { quantity: 1, unit: 'cup', name: 'Mixed Berries (frozen)' },
          { quantity: 0.75, unit: 'cup', name: 'Milk (dairy, almond, oat, etc.)' },
          { quantity: 0.25, unit: 'cup', name: 'Greek Yogurt or Silken Tofu (optional)' },
          { quantity: 1, unit: 'tbsp', name: 'Honey or Maple Syrup (optional)' },
          { quantity: 1, unit: 'tbsp', name: 'Chia Seeds or Flax Seeds (optional)' },
        ],
        instructions: [
          'Combine all ingredients in a blender.',
          'Blend on high speed until smooth and creamy. Add more milk if needed to reach desired consistency.',
          'Pour into a glass and enjoy immediately.'
        ],
        nutrition: { // Approx. without optional items
          calories: 280, protein: 8, carbs: 55, fat: 4
        }
      },
  ];
  