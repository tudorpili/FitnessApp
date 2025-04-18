// src/mockData/exercises.js

// NOTE: Update video paths to your actual file names in public/videos/

export const mockExercises = [
  {
    id: 1,
    name: 'Machine Standing Calf Raise',
    muscle: 'Calves',
    difficulty: 'Advanced',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Calf+Raise',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-machine-standing-calf-raises-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-machine-standing-calf-raises-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 2,
    name: 'Machine Seated Calf Raise',
    muscle: 'Calves',
    difficulty: 'Advanced',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Calf+Raise',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-machine-seated-calf-raise-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-machine-seated-calf-raise-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 3,
    name: 'Barbell Squat',
    muscle: 'Quads',
    difficulty: 'Advanced',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Barbell+Squat',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Barbell-barbell-squat-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Barbell-barbell-squat-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 4,
    name: 'Leg Extensions',
    muscle: 'Quads',
    difficulty: 'Begginer',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Leg+Extensions',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-machine-leg-extension-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-machine-leg-extension-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 5,
    name: 'Barbell Romaninan Deadlift',
    muscle: 'Hamstrings',
    difficulty: 'Begginer',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Romanian+Deadlift',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Barbell-barbell-romanian-deadlift-side.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Barbell-barbell-romanian-deadlift-front.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 6,
    name: 'Hamstring Curl',
    muscle: 'Hamstrings',
    difficulty: 'Begginer',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Hamstring+Curl',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-machine-hamstring-curl-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-machine-hamstring-curl-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 7,
    name: 'Barbell Squat',
    muscle: 'Glutes',
    difficulty: 'Begginer',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Barbell+Squat',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Barbell-barbell-squat-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Barbell-barbell-squat-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 8,
    name: 'Hip Thrust',
    muscle: 'Glutes',
    difficulty: 'Begginer',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Hip+Thrust',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Barbell-barbell-hip-thrust-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Barbell-barbell-hip-thrust-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 9,
    name: 'Dumbbell Wrist Curl',
    muscle: 'Forearms',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Wrist+Curl',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Dumbbells-dumbbell-wrist-curl-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Dumbbells-dumbbell-wrist-curl-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 10,
    name: 'Cable Bayesian Curl',
    muscle: 'Biceps',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Bicep+Curl',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Cables-cable-bilateral-bayesian-curl-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Cables-cable-bilateral-bayesian-curl-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 11,
    name: 'Dumbell Curl',
    muscle: 'Biceps',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Dumbell+Curl',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Dumbbells-dumbbell-curl-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Dumbbells-dumbbell-curl-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 12,
    name: 'Cable Rope Pushdown',
    muscle: 'Triceps',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Cable+Rope+Pushdown',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Cables-cable-push-down-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Cables-cable-push-down-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 13,
    name: 'Cable Rope Overhead Tricep Extension',
    muscle: 'Triceps',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Cable+Rope+Overhead+Tricep+Extension',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Cables-cable-overhead-tricep-extension-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Cables-cable-overhead-tricep-extension-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 14,
    name: 'Dumbell Row Unilateral',
    muscle: 'Lats',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Cable+Rope+Pushdown',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Dumbbells-dumbbell-row-unilateral-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Dumbbells-dumbbell-row-unilateral-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 15,
    name: 'Cable Bent Over Bar Pullover',
    muscle: 'Lats',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Cable+Rope+Overhead+Tricep+Extension',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Cables-cable-pullover-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Cables-cable-pullover-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 16,
    name: 'Barbell Deadlift',
    muscle: 'Lower back',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Barbell+Deadlift',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Barbell-barbell-deadlift-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Barbell-barbell-deadlift-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 17,
    name: 'Supermans',
    muscle: 'Lower back',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Supermans',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Bodyweight-supermans-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Bodyweight-supermans-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 18,
    name: 'Dumbbell Seated Overhead Press',
    muscle: 'Shoulders',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Dumbbell+Seated+Overhead+Press',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-dumbbell-seated-overhead-press-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-dumbbell-seated-overhead-press-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 19,
    name: 'Cable Low Single Arm Lateral Raise',
    muscle: 'Shoulders',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Cable+Low+Single+Arm+Lateral+Raise',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Cables-cable-lateral-raise-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Cables-cable-lateral-raise-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 20,
    name: 'Hand Plank',
    muscle: 'Abdominals',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Hand+Plank',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-bodyweight-hand-plank-front_ZnMlFBF.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-bodyweight-hand-plank-side_GnZ2NZh.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 21,
    name: 'Laying Leg Raises',
    muscle: 'Abdominals',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Laying+Leg+Raises',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Bodyweight-laying-leg-raises-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Bodyweight-laying-leg-raises-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 22,
    name: 'Hand Side Plank',
    muscle: 'Obliques',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Hand+Side+Plank',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-bodyweight-hand-side-plank-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-bodyweight-hand-side-plank-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 23,
    name: 'Dumbbell Russian Twists',
    muscle: 'Obliques',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Dumbbell+Russian+Twists',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Dumbbells-dumbbell-russian-twist-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Dumbbells-dumbbell-russian-twist-front.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 24,
    name: 'Barbell Bench Press',
    muscle: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Barbell+Bench+Press',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-barbell-bench-press-front.mp4' } // Replace with your actual filename
        //{ view: 'Side View', url: '/videos/male-bodyweight-hand-side-plank-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 25,
    name: 'Dumbbell Incline Bench Press',
    muscle: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Dumbell+Incline+Bench+Press',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-dumbbell-incline-bench-press-front_q2q0T12.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-dumbbell-incline-bench-press-side_2HBfFN3.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 26,
    name: 'Dumbbell Shrug',
    muscle: 'Traps',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Dumbbell+Shrug',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-Dumbbells-dumbbell-shrug-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-Dumbbells-dumbbell-shrug-side.mp4' }   // Replace with your actual filename
    ]
  },
  {
    id: 27,
    name: 'Pullup',
    muscle: 'Traps',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    image: 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Pullup',
    description: 'Lie flat on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and push it back up.',
    // video_url: '/videos/barbell_bench_press.mp4', // OLD single URL
    // NEW: Array for multiple videos
    videos: [
        { view: 'Front View', url: '/videos/male-bodyweight-pullup-front.mp4' }, // Replace with your actual filename
        { view: 'Side View', url: '/videos/male-bodyweight-pullup-side.mp4' }   // Replace with your actual filename
    ]
  },
];
