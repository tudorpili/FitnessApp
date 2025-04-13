// src/mockData/exercises.js

// FINAL VERSION - Based on the provided list:
// Traps, Lower Back, Lats, Hamstrings, Glutes, Calves, Triceps,
// Forearms, Shoulders, Chest, Abdominals, Obliques, Biceps, Quads.
//
// NOTE: The 'muscle' property values below MUST exactly match the
// 'data-elem' attribute values used in your muscle-male.svg file
// for the interactive highlighting and filtering to work correctly.

export const mockExercises = [
  {
    id: 1,
    name: 'Barbell Bench Press',
    muscle: 'Chest', // Matches data-elem="Chest"
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Bench+Press',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    video_url: '/videos/male-dumbbell-bench-press-front.mp4' // Example video path
  },
  {
    id: 2,
    name: 'Barbell Squat',
    muscle: 'Quads', // Matches data-elem="Quads" (primarily targets quads)
    difficulty: 'Intermediate',
    equipment: 'Barbell, Squat Rack',
    image: 'https://placehold.co/600x400/D1FAE5/065F46?text=Squat',
    description: 'Stand with the barbell resting on your upper back. Lower your hips as if sitting in a chair, keeping your chest up and back straight. Return to the starting position.',
    video_url: null
  },
  {
    id: 3,
    name: 'Deadlift',
    muscle: 'Lower back', // Matches data-elem="Lower Back" (also hits Glutes, Hamstrings)
    difficulty: 'Advanced',
    equipment: 'Barbell',
    image: 'https://placehold.co/600x400/FEF2F2/991B1B?text=Deadlift',
    description: 'Stand with feet hip-width apart, barbell over midfoot. Hinge at hips and bend knees to grip the bar. Lift by extending hips and knees, keeping back straight. Lower controlled.',
    video_url: null
  },
  {
    id: 4,
    name: 'Overhead Press (OHP)',
    muscle: 'Shoulders', // Matches data-elem="Shoulders"
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    image: 'https://placehold.co/600x400/FEFBF6/D97706?text=OHP',
    description: 'Stand with barbell at shoulder height, hands slightly wider than shoulders. Press the barbell straight overhead, fully extending arms. Lower with control.',
    video_url: null
  },
  {
    id: 5,
    name: 'Pull Up',
    // muscle: 'Traps', // Previous mapping
    muscle: 'Lats', // Corrected: Matches data-elem="Lats" (primary mover)
    difficulty: 'Intermediate',
    equipment: 'Pull-up Bar',
    image: 'https://placehold.co/600x400/F3E8FF/6B21A8?text=Pull+Up',
    description: 'Hang from a pull-up bar with an overhand grip. Pull your chest towards the bar. Lower yourself slowly.',
    video_url: null
  },
   {
    id: 6,
    name: 'Dumbbell Bicep Curl',
    muscle: 'Biceps', // Matches data-elem="Biceps"
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    image: 'https://placehold.co/600x400/EFF6FF/1D4ED8?text=Bicep+Curl',
    description: 'Stand or sit holding dumbbells with palms facing up. Curl the weights towards your shoulders, keeping elbows tucked in. Lower slowly.',
    video_url: null
  },
   {
    id: 7,
    name: 'Triceps Pushdown',
    muscle: 'Triceps', // Matches data-elem="Triceps"
    difficulty: 'Beginner',
    equipment: 'Cable Machine, Rope/Bar',
    image: 'https://placehold.co/600x400/F0FDFA/0F766E?text=Triceps+Pushdown',
    description: 'Attach a rope or bar to a high cable pulley. Grip the attachment, keep elbows close to body, and push down until arms are fully extended.',
    video_url: null
  },
   {
    id: 8,
    name: 'Plank',
    muscle: 'Abdominals', // Matches data-elem="Abdominals"
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    image: 'https://placehold.co/600x400/ECFEFF/0E7490?text=Plank',
    description: 'Hold body in a straight line from head to heels, supported on forearms and toes. Engage core muscles.',
    video_url: null
  },
  {
    id: 9,
    name: 'Leg Press',
    muscle: 'Quads', // Matches data-elem="Quads"
    difficulty: 'Beginner',
    equipment: 'Leg Press Machine',
    image: 'https://placehold.co/600x400/D1FAE5/065F46?text=Leg+Press',
    description: 'Sit on the machine, place feet shoulder-width apart on the platform. Lower the weight by bending knees, then press back up.',
    video_url: null
  },
  {
    id: 10,
    name: 'Romanian Deadlift (RDL)',
    muscle: 'Hamstrings', // Matches data-elem="Hamstrings"
    difficulty: 'Intermediate',
    equipment: 'Barbell, Dumbbells',
    image: 'https://placehold.co/600x400/FEF2F2/991B1B?text=RDL',
    description: 'Hold weight in front, feet hip-width. Keeping legs mostly straight (slight knee bend), hinge at hips, lowering weight towards floor. Return by squeezing glutes.',
    video_url: null
  },
  {
    id: 11,
    name: 'Calf Raises',
    muscle: 'Calves', // Matches data-elem="Calves"
    difficulty: 'Beginner',
    equipment: 'Bodyweight, Dumbbells, Machine',
    image: 'https://placehold.co/600x400/FDF4FF/C026D3?text=Calf+Raises',
    description: 'Stand with balls of feet on an elevated surface. Lower heels down, then raise up onto toes as high as possible.',
    video_url: null
  },
   {
    id: 12,
    name: 'Russian Twist',
    muscle: 'Obliques', // Matches data-elem="Obliques"
    difficulty: 'Beginner',
    equipment: 'Bodyweight, Weight Plate',
    image: 'https://placehold.co/600x400/F7FEE7/65A30D?text=Russian+Twist',
    description: 'Sit on floor, knees bent, lean back slightly. Twist torso side to side, optionally holding a weight.',
    video_url: null
  },
  {
    id: 13, // Added new ID
    name: 'Bent Over Row',
    muscle: 'Lats', // Matches data-elem="Lats" (also hits traps, rhomboids)
    difficulty: 'Intermediate',
    equipment: 'Barbell, Dumbbells',
    image: 'https://placehold.co/600x400/F3E8FF/6B21A8?text=Bent+Over+Row',
    description: 'Bend at hips with straight back, knees slightly bent. Pull weight towards lower chest/upper abs, squeezing shoulder blades. Lower controlled.',
    video_url: null
  },
   {
    id: 14, // Added new ID
    name: 'Barbell Hip Thrust',
    muscle: 'Glutes', // Matches data-elem="Glutes"
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench, Pad',
    image: 'https://placehold.co/600x400/FFF7ED/EA580C?text=Hip+Thrust',
    description: 'Sit on floor, upper back against bench. Place padded barbell over hips. Drive through heels to lift hips until body forms straight line shoulders to knees. Squeeze glutes.',
    video_url: null
  },
   {
    id: 15, // Added new ID
    name: 'Wrist Curls',
    muscle: 'Forearms', // Matches data-elem="Forearms"
    difficulty: 'Beginner',
    equipment: 'Dumbbell, Barbell',
    image: 'https://placehold.co/600x400/FEF3C7/F59E0B?text=Wrist+Curls',
    description: 'Sit with forearm resting on thigh or bench, palm up, holding weight. Lower weight by bending wrist, then curl wrist upwards.',
    video_url: null
  },
  {
    id: 16,
    name: 'Pull Up',
    muscle: 'Traps', // Previous mapping
    //muscle: 'Lats', // Corrected: Matches data-elem="Lats" (primary mover)
    difficulty: 'Intermediate',
    equipment: 'Pull-up Bar',
    image: 'https://placehold.co/600x400/F3E8FF/6B21A8?text=Pull+Up',
    description: 'Hang from a pull-up bar with an overhand grip. Pull your chest towards the bar. Lower yourself slowly.',
    video_url: null
  },
  {
    id: 17,
    name: 'Machine Standing Calf Raises',
    muscle: 'Calves', // Matches data-elem="Calves"
    difficulty: 'Beginner',
    equipment: 'Bodyweight, Dumbbells, Machine',
    image: 'https://placehold.co/600x400/FDF4FF/C026D3?text=Calf+Raises',
    description: 'Stand with balls of feet on an elevated surface. Lower heels down, then raise up onto toes as high as possible.',
    video_url: '/videos/male-machine-standing-calf-raises-front.mp4'
  },
  {
    id: 18,
    name: 'Machine Seated Calf Raises',
    muscle: 'Calves', // Matches data-elem="Calves"
    difficulty: 'Beginner',
    equipment: 'Bodyweight, Dumbbells, Machine',
    image: 'https://placehold.co/600x400/FDF4FF/C026D3?text=Calf+Raises',
    description: 'Stand with balls of feet on an elevated surface. Lower heels down, then raise up onto toes as high as possible.',
    video_url: '/videos/male-machine-seated-calf-raise-front.mp4'
  }
];
