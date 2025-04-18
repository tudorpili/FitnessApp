// src/pages/CalculatorsPage.jsx
// Removed useMemo from main React import as it's no longer needed here
import React, { useState, useEffect, useCallback } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
// Removed FaQuoteLeft as it's no longer used
import { /*FiCalculator,*/ FiActivity, FiRepeat, FiTarget, FiAlertCircle, FiCalendar, FiPieChart, FiBarChart, FiTrendingUp, FiRefreshCw, FiSend } from 'react-icons/fi';
import { FaWeight, FaRulerVertical, FaBirthdayCake, FaMars, FaVenus, FaPercentage, FaCalculator as FaCalcIcon, FaFire, FaDrumstickBite, FaBreadSlice, FaTint } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler );

// --- Helper Functions ---
// Removed getTodayDate as it's not used in this component
// const getTodayDate = () => { /* ... */ };

// Conversion Constants
const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 1 / KG_TO_LBS;
const CM_TO_IN = 0.393701;
const IN_TO_CM = 1 / CM_TO_IN;

// --- Reusable Card Component (Enhanced Styling) ---
const InfoCard = ({ title, children, className = '', icon }) => ( /* ... Card JSX ... */
  <div className={`bg-gradient-to-br from-white/70 via-white/60 to-indigo-50/40 backdrop-blur-lg rounded-3xl shadow-xl shadow-indigo-100/50 border border-white/30 p-6 sm:p-8 ${className}`}> <h2 className="text-xl font-bold text-slate-800 mb-6 tracking-tight flex items-center"> {icon && <span className="mr-3 text-indigo-500 text-2xl">{icon}</span>} {title} </h2> <div className="space-y-5">{children}</div> </div>
);

// --- Reusable Input Field ---
const InputField = ({ id, label, type = "number", value, onChange, placeholder, step, unit, error }) => ( /* ... Input JSX ... */
    <div> <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label> <div className="relative"> <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} step={step} min="0" required className={`w-full pl-4 pr-12 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition duration-150 bg-white/80 ${error ? 'border-red-400 ring-red-400' : 'border-slate-300 focus:ring-indigo-500'}`}/> {unit && <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500">{unit}</span>} </div> </div>
);

// --- Reusable Select Field ---
const SelectField = ({ id, label, value, onChange, children }) => ( /* ... Select JSX ... */
     <div> <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label> <select id={id} value={value} onChange={onChange} className="w-full px-4 py-2.5 border border-slate-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"> {children} </select> </div>
);

// --- Reusable Result Display ---
const ResultDisplay = ({ label, value, unit, icon, color = 'indigo' }) => ( /* ... Result JSX ... */
    <div className={`bg-${color}-50/70 p-4 rounded-xl border border-${color}-200 text-center shadow-inner`}> <p className={`text-xs font-medium text-${color}-600 uppercase mb-1 flex items-center justify-center gap-1`}>{icon}{label}</p> <p className={`text-2xl font-bold text-${color}-800`}>{value ?? '--'}</p> {unit && <p className={`text-xs text-${color}-700`}>{unit}</p>} </div>
);

// --- Unit Toggle Component --- (Moved here for self-containment)
const UnitToggle = ({ selectedUnit, onUnitChange }) => (
  <div className="flex items-center bg-slate-200 rounded-full p-1 text-sm">
    <button onClick={() => onUnitChange('metric')} className={`px-4 py-1 rounded-full transition-colors ${selectedUnit === 'metric' ? 'bg-white text-slate-800 shadow' : 'text-slate-600 hover:bg-slate-300/50'}`}>Metric (kg/cm)</button>
    <button onClick={() => onUnitChange('imperial')} className={`px-4 py-1 rounded-full transition-colors ${selectedUnit === 'imperial' ? 'bg-white text-slate-800 shadow' : 'text-slate-600 hover:bg-slate-300/50'}`}>Imperial (lbs/in)</button>
  </div>
);


// --- BMR/TDEE Calculator Component ---
const BmrTdeeCalculator = ({ onTdeeCalculated }) => { /* ... Component Code remains the same ... */
    const [gender, setGender] = useState(() => localStorage.getItem('calcGender') || 'male'); const [weight, setWeight] = useState(() => localStorage.getItem('calcWeight') || ''); const [height, setHeight] = useState(() => localStorage.getItem('calcHeight') || ''); const [age, setAge] = useState(() => localStorage.getItem('calcAge') || ''); const [unitSystem, setUnitSystem] = useState(() => localStorage.getItem('calcUnitSystem') || 'metric'); const [activityLevel, setActivityLevel] = useState(() => parseFloat(localStorage.getItem('calcActivityLevel')) || 1.375); const [bmr, setBmr] = useState(null); const [tdee, setTdee] = useState(null); const [error, setError] = useState('');
    useEffect(() => { localStorage.setItem('calcGender', gender); }, [gender]); useEffect(() => { localStorage.setItem('calcWeight', weight); }, [weight]); useEffect(() => { localStorage.setItem('calcHeight', height); }, [height]); useEffect(() => { localStorage.setItem('calcAge', age); }, [age]); useEffect(() => { localStorage.setItem('calcUnitSystem', unitSystem); }, [unitSystem]); useEffect(() => { localStorage.setItem('calcActivityLevel', activityLevel); }, [activityLevel]);
    const activityLevels = [ { label: 'Sedentary (little/no exercise)', value: 1.2 }, { label: 'Lightly Active (1-3 days/week)', value: 1.375 }, { label: 'Moderately Active (3-5 days/week)', value: 1.55 }, { label: 'Very Active (6-7 days/week)', value: 1.725 }, { label: 'Extra Active (very hard exercise/physical job)', value: 1.9 }, ];
    const calculateBmrTdee = useCallback(() => { setError(''); let w = parseFloat(weight); let h = parseFloat(height); const a = parseInt(age, 10); if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0 || isNaN(a) || a <= 0) { setError(`Please enter valid weight (${unitSystem === 'metric' ? 'kg' : 'lbs'}), height (${unitSystem === 'metric' ? 'cm' : 'in'}), and age.`); setBmr(null); setTdee(null); return; } const weightKg = unitSystem === 'imperial' ? w * LBS_TO_KG : w; const heightCm = unitSystem === 'imperial' ? h * IN_TO_CM : h; let calculatedBmr; if (gender === 'male') { calculatedBmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) + 5; } else { calculatedBmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) - 161; } const calculatedTdee = calculatedBmr * activityLevel; const roundedTdee = Math.round(calculatedTdee); setBmr(Math.round(calculatedBmr)); setTdee(roundedTdee); if (onTdeeCalculated) { onTdeeCalculated(roundedTdee); } }, [weight, height, age, gender, unitSystem, activityLevel, onTdeeCalculated]);
    return ( <InfoCard title="BMR & TDEE Calculator" icon={<FiActivity />}> <p className="text-sm text-gray-600 -mt-4 mb-5">Estimate daily calories burned at rest (BMR) and with activity (TDEE).</p> <div className="mb-5 flex items-center justify-between"> <label className="block text-sm font-medium text-slate-700">Units</label> <UnitToggle selectedUnit={unitSystem} onUnitChange={setUnitSystem} /> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-5"> <div> <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label> <div className="flex gap-3 bg-gray-100 p-1 rounded-full"> <button onClick={() => setGender('male')} className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${gender === 'male' ? 'bg-blue-500 text-white shadow' : 'hover:bg-gray-200'}`}><FaMars /> Male</button> <button onClick={() => setGender('female')} className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${gender === 'female' ? 'bg-pink-500 text-white shadow' : 'hover:bg-gray-200'}`}><FaVenus /> Female</button> </div> </div> <InputField id="age" label="Age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Years" error={error && (isNaN(parseInt(age, 10)) || parseInt(age, 10) <= 0)} /> <InputField id="weight" label="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unitSystem === 'metric' ? 'kg' : 'lbs'} step="0.1" unit={unitSystem === 'metric' ? 'kg' : 'lbs'} error={error && (isNaN(parseFloat(weight)) || parseFloat(weight) <= 0)} /> <InputField id="height" label="Height" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={unitSystem === 'metric' ? 'cm' : 'in'} step="0.1" unit={unitSystem === 'metric' ? 'cm' : 'in'} error={error && (isNaN(parseFloat(height)) || parseFloat(height) <= 0)} /> <div className="sm:col-span-2"> <SelectField id="activity-level" label="Activity Level" value={activityLevel} onChange={(e) => setActivityLevel(parseFloat(e.target.value))}> {activityLevels.map(level => (<option key={level.value} value={level.value}>{level.label}</option>))} </SelectField> </div> </div> {error && <p className="text-sm text-red-600 mb-4 flex items-center"><FiAlertCircle className="mr-1"/> {error}</p>} <button onClick={calculateBmrTdee} className="w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-[1.02]"> Calculate BMR & TDEE </button> {(bmr !== null || tdee !== null) && ( <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"> <ResultDisplay label="Estimated BMR" value={bmr} unit="kcal/day" icon={<FaBirthdayCake size={12}/>} color="purple"/> <ResultDisplay label="Estimated TDEE" value={tdee} unit="kcal/day" icon={<FaFire size={12}/>} color="orange"/> </div> )} </InfoCard> );
};

// --- 1 Rep Max Calculator ---
const OneRepMaxCalculator = () => { /* ... Component Code remains the same ... */
    const [weightLifted, setWeightLifted] = useState(''); const [repsPerformed, setRepsPerformed] = useState(''); const [estimated1RM, setEstimated1RM] = useState(null); const [error, setError] = useState(''); const [unit, setUnit] = useState('kg');
    const calculate1RM = () => { setError(''); const w = parseFloat(weightLifted); const r = parseInt(repsPerformed, 10); if (isNaN(w) || w <= 0 || isNaN(r) || r <= 0) { setError('Please enter valid weight lifted and reps performed.'); setEstimated1RM(null); return; } if (r > 12) { setError('Formula is less accurate for more than 12 reps.'); } if (r === 1) { setEstimated1RM(w.toFixed(1)); return; } const calculated1RM = w / (1.0278 - (0.0278 * r)); setEstimated1RM(calculated1RM.toFixed(1)); };
    return ( <InfoCard title="Estimated 1 Rep Max (1RM)" icon={<FaWeight />}> <p className="text-sm text-gray-600 -mt-4 mb-5">Estimate your max lift based on reps performed (Brzycki formula).</p> <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5"> <InputField id="orm-weight" label="Weight Lifted" value={weightLifted} onChange={(e) => setWeightLifted(e.target.value)} placeholder="e.g., 100" step="0.1" error={error && (isNaN(parseFloat(weightLifted)) || parseFloat(weightLifted) <= 0)}/> <InputField id="orm-reps" label="Reps Performed" value={repsPerformed} onChange={(e) => setRepsPerformed(e.target.value)} placeholder="e.g., 5" max="12" error={error && (isNaN(parseInt(repsPerformed, 10)) || parseInt(repsPerformed, 10) <= 0)}/> <div><label className="block text-sm font-medium text-slate-700 mb-1">Unit</label><UnitToggle selectedUnit={unit} onUnitChange={setUnit} /></div> </div> {error && <p className="text-sm text-red-600 mb-4 flex items-center"><FiAlertCircle className="mr-1"/> {error}</p>} <button onClick={calculate1RM} className="w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 shadow-md hover:shadow-lg transform hover:scale-[1.02]"> Estimate 1RM </button> {estimated1RM !== null && ( <div className="mt-6"><ResultDisplay label="Estimated 1 Rep Max" value={estimated1RM} unit={unit} icon={<FiTrendingUp size={12}/>} color="blue"/></div> )} </InfoCard> );
};

// --- Macro Calculator ---
const MacroCalculator = ({ initialCalories = '' }) => { /* ... Component Code remains the same ... */
    const [totalCalories, setTotalCalories] = useState(initialCalories); const [goal, setGoal] = useState('maintain'); const [ratioPreset, setRatioPreset] = useState('balanced'); const [macros, setMacros] = useState(null); const [error, setError] = useState('');
    useEffect(() => { if (initialCalories) { setTotalCalories(initialCalories.toString()); } }, [initialCalories]);
    const macroPresets = { balanced: { p: 0.30, c: 0.40, f: 0.30 }, 'low-carb': { p: 0.40, c: 0.25, f: 0.35 }, 'high-protein': { p: 0.40, c: 0.35, f: 0.25 }, };
    const calculateMacros = useCallback(() => { setError(''); let targetCalories = parseFloat(totalCalories); if (isNaN(targetCalories) || targetCalories <= 0) { setError('Please enter valid total daily calories.'); setMacros(null); return; } if (goal === 'lose') targetCalories -= 500; if (goal === 'gain') targetCalories += 300; targetCalories = Math.max(1200, targetCalories); const ratio = macroPresets[ratioPreset]; const proteinG = Math.round((targetCalories * ratio.p) / 4); const carbsG = Math.round((targetCalories * ratio.c) / 4); const fatG = Math.round((targetCalories * ratio.f) / 9); setMacros({ proteinG, carbsG, fatG, adjustedCalories: Math.round(targetCalories) }); }, [totalCalories, goal, ratioPreset]);
    useEffect(() => { if (totalCalories) { calculateMacros(); } else { setMacros(null); } }, [totalCalories, goal, ratioPreset, calculateMacros]);
    return ( <InfoCard title="Macronutrient Calculator" icon={<FaPercentage />}> <p className="text-sm text-gray-600 -mt-4 mb-5">Calculate suggested macro targets based on your calorie goal.</p> <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-5"> <InputField id="macro-calories" label="Target Calories (kcal)" value={totalCalories} onChange={(e) => setTotalCalories(e.target.value)} placeholder="From TDEE or goal" error={error && (isNaN(parseFloat(totalCalories)) || parseFloat(totalCalories) <= 0)}/> <SelectField id="macro-goal" label="Goal" value={goal} onChange={(e) => setGoal(e.target.value)}> <option value="lose">Weight Loss (~ -500 kcal)</option> <option value="maintain">Maintain Weight</option> <option value="gain">Weight Gain (~ +300 kcal)</option> </SelectField> <SelectField id="macro-ratio" label="Macro Ratio" value={ratioPreset} onChange={(e) => setRatioPreset(e.target.value)}> <option value="balanced">Balanced (40C/30P/30F)</option> <option value="low-carb">Low Carb (25C/40P/35F)</option> <option value="high-protein">High Protein (35C/40P/25F)</option> </SelectField> </div> {error && <p className="text-sm text-red-600 mb-4 flex items-center"><FiAlertCircle className="mr-1"/> {error}</p>} {macros !== null && ( <div className="mt-6 space-y-3"> <p className="text-sm text-emerald-900 font-semibold">Suggested Daily Macros (for ~{macros.adjustedCalories} kcal):</p> <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center"> <ResultDisplay label="Protein" value={macros.proteinG} unit="g" icon={<FaDrumstickBite size={12}/>} color="emerald"/> <ResultDisplay label="Carbs" value={macros.carbsG} unit="g" icon={<FaBreadSlice size={12}/>} color="blue"/> <ResultDisplay label="Fat" value={macros.fatG} unit="g" icon={<FaTint size={12}/>} color="red"/> </div> </div> )} </InfoCard> );
};


// --- Main CalculatorsPage Component ---
function CalculatorsPage() {
    const [calculatedTdee, setCalculatedTdee] = useState('');
    const handleTdeeUpdate = useCallback((tdeeValue) => { setCalculatedTdee(tdeeValue); }, []);

    // --- REMOVED Quote Logic ---
    // const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);
    // --- END REMOVAL ---

    return (
        <div className="space-y-10 sm:space-y-12 max-w-6xl mx-auto animate-fadeIn font-sans">
            {/* Page Header */}
            <div className="pb-6 border-b border-gray-200/80">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight flex items-center">
                   <FaCalcIcon className="mr-4 text-purple-600"/> Fitness Calculators
                </h1>
                <p className="mt-3 text-lg text-slate-600">
                    Estimate your metabolic rate, strength, and macronutrient needs.
                </p>
                 <p className="mt-2 text-xs text-slate-500 italic">
                    Note: These are estimates. Consult with a professional for personalized advice.
                 </p>
            </div>

            {/* --- REMOVED Quote Section --- */}
            {/* <div className="bg-gradient-to-r from-sky-100 to-indigo-100 p-5 rounded-2xl shadow-md text-center italic text-indigo-800">
                <FaQuoteLeft className="inline mr-2 opacity-50" /> {quote}
            </div> */}
            {/* --- END REMOVAL --- */}


            {/* Calculators Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
                {/* BMR/TDEE Column */}
                <div className="lg:col-span-1 space-y-10">
                    <BmrTdeeCalculator onTdeeCalculated={handleTdeeUpdate} />
                    {/* Button to use TDEE */}
                    {calculatedTdee && (
                        <button
                            onClick={() => {
                                const macroInput = document.getElementById('macro-calories');
                                if (macroInput) {
                                    macroInput.value = calculatedTdee;
                                    macroInput.dispatchEvent(new Event('input', { bubbles: true }));
                                     document.getElementById('macro-calculator-card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Adjusted scroll
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-xl hover:bg-indigo-200 transition duration-150 shadow-sm hover:shadow-md"
                        >
                            <FiSend /> Use TDEE ({calculatedTdee} kcal) for Macro Calculator
                        </button>
                    )}
                </div>

                {/* 1RM and Macros Column */}
                <div className="lg:col-span-1 space-y-10">
                    <OneRepMaxCalculator />
                    <div id="macro-calculator-card"> {/* ID for scrolling */}
                        <MacroCalculator initialCalories={calculatedTdee} />
                    </div>
                </div>
            </div>

        </div> // End Page Container
    );
}

export default CalculatorsPage;
