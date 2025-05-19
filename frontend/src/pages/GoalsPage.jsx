// src/pages/GoalsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { FiTarget, FiPlus, FiEdit2, FiTrash2, FiLoader, FiAlertCircle, FiCheck, FiX,FiSave } from 'react-icons/fi';
import { getActiveGoals, createGoal, updateGoal, deleteGoal } from '../services/api';

// Helper: Modal Component (Remains the same)
const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg animate-modalEnter border border-white/20"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FiX size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// Helper: Goal Card Component (Edit button enabled)
const GoalCard = ({ goal, onEdit, onDelete }) => {
    const getGoalName = (g) => {
        if (g.description) return g.description;
        switch(g.goal_type) {
            case 'WEIGHT_TARGET': return `Reach ${g.target_value} ${g.target_unit || 'kg'}`;
            case 'WORKOUT_FREQUENCY': return `Complete ${g.target_value} workouts/week`;
            case 'STEP_TARGET_DAILY': return `${g.target_value?.toLocaleString()} steps/day`;
            case 'WATER_TARGET_DAILY': return `Drink ${g.target_value}ml water/day`;
            case 'CALORIE_TARGET_DAILY': return `Eat ${g.target_value} kcal/day`;
            case 'PROTEIN_TARGET_DAILY': return `Eat ${g.target_value}g protein/day`;
            case 'CARB_TARGET_DAILY': return `Eat ${g.target_value}g carbs/day`;
            case 'FAT_TARGET_DAILY': return `Eat ${g.target_value}g fat/day`;
            default: return g.goal_type || 'Unnamed Goal';
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-5 border border-indigo-100/50 transition-all hover:shadow-indigo-200/50">
            <h3 className="text-md font-semibold text-indigo-700 mb-2">{getGoalName(goal)}</h3>
            <p className="text-xs text-gray-500 mb-1">Type: <span className="font-medium text-gray-700">{goal.goal_type}</span></p>
            <p className="text-xs text-gray-500 mb-1">Target: <span className="font-medium text-gray-700">{goal.target_value} {goal.target_unit || ''}</span></p>
            {goal.start_date && <p className="text-xs text-gray-500 mb-1">Start: <span className="font-medium text-gray-700">{new Date(goal.start_date).toLocaleDateString()}</span></p>}
            {goal.target_date && <p className="text-xs text-gray-500 mb-3">Target Date: <span className="font-medium text-gray-700">{new Date(goal.target_date).toLocaleDateString()}</span></p>}
            
            <div className="mt-4 flex justify-end space-x-2">
                <button 
                    onClick={() => onEdit(goal)} // Enable edit button
                    className="p-2 text-xs text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors flex items-center"
                >
                    <FiEdit2 size={14} className="mr-1"/> Edit
                </button>
                <button 
                    onClick={() => onDelete(goal.id)}
                    className="p-2 text-xs text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center"
                >
                    <FiTrash2 size={14} className="mr-1"/> Delete
                </button>
            </div>
        </div>
    );
};


function GoalsPage() {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialFormState = {
        goal_type: 'CALORIE_TARGET_DAILY',
        description: '',
        target_value: '',
        target_unit: '',
        start_date: '',
        target_date: '',
        is_active: true,
    };

    const [currentGoal, setCurrentGoal] = useState(initialFormState);
    const [editingGoalId, setEditingGoalId] = useState(null); // To track if we are editing

    const goalTypes = [
        { value: 'WEIGHT_TARGET', label: 'Weight Target', unit: 'kg', defaultUnit: 'kg' },
        { value: 'WORKOUT_FREQUENCY', label: 'Workout Frequency', unit: 'workouts/week', defaultUnit: 'workouts/week' },
        { value: 'STEP_TARGET_DAILY', label: 'Daily Steps', unit: 'steps', defaultUnit: 'steps' },
        { value: 'WATER_TARGET_DAILY', label: 'Daily Water Intake', unit: 'ml', defaultUnit: 'ml' },
        { value: 'CALORIE_TARGET_DAILY', label: 'Daily Calories', unit: 'kcal', defaultUnit: 'kcal' },
        { value: 'PROTEIN_TARGET_DAILY', label: 'Daily Protein', unit: 'g', defaultUnit: 'g' },
        { value: 'CARB_TARGET_DAILY', label: 'Daily Carbs', unit: 'g', defaultUnit: 'g' },
        { value: 'FAT_TARGET_DAILY', label: 'Daily Fat', unit: 'g', defaultUnit: 'g' },
    ];

    const fetchUserGoals = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const activeGoals = await getActiveGoals();
            setGoals(activeGoals || []);
        } catch (err) {
            setError(err.message || "Failed to load goals.");
            setGoals([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserGoals();
    }, [fetchUserGoals]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === "goal_type") {
            const selectedType = goalTypes.find(gt => gt.value === value);
            setCurrentGoal(prev => ({
                ...prev,
                goal_type: value,
                target_unit: selectedType?.defaultUnit || '',
            }));
        } else {
            setCurrentGoal(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };
    
    const resetFormAndCloseModal = () => {
        setCurrentGoal(initialFormState);
        const calorieGoalType = goalTypes.find(gt => gt.value === 'CALORIE_TARGET_DAILY'); // Reset unit for default type
        setCurrentGoal(prev => ({ ...prev, target_unit: calorieGoalType?.defaultUnit || ''}));
        setFormError('');
        setEditingGoalId(null);
        setIsModalOpen(false);
    };

    const handleOpenModal = (goalToEdit = null) => {
        setFormError('');
        if (goalToEdit) {
            setEditingGoalId(goalToEdit.id);
            setCurrentGoal({
                goal_type: goalToEdit.goal_type,
                description: goalToEdit.description || '',
                target_value: goalToEdit.target_value || '',
                target_unit: goalToEdit.target_unit || '',
                start_date: goalToEdit.start_date ? new Date(goalToEdit.start_date).toISOString().split('T')[0] : '',
                target_date: goalToEdit.target_date ? new Date(goalToEdit.target_date).toISOString().split('T')[0] : '',
                is_active: goalToEdit.is_active !== undefined ? goalToEdit.is_active : true,
            });
        } else {
            setEditingGoalId(null);
            setCurrentGoal(initialFormState);
            const calorieGoalType = goalTypes.find(gt => gt.value === 'CALORIE_TARGET_DAILY');
            setCurrentGoal(prev => ({ ...prev, target_unit: calorieGoalType?.defaultUnit || ''}));
        }
        setIsModalOpen(true);
    };

    const handleSubmitGoal = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!currentGoal.goal_type || !currentGoal.target_value) {
            setFormError('Goal type and target value are required.');
            return;
        }
        
        const targetValueNum = parseFloat(currentGoal.target_value);
        if (isNaN(targetValueNum) || targetValueNum <= 0) {
            setFormError('Target value must be a positive number.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...currentGoal,
                target_value: targetValueNum,
                start_date: currentGoal.start_date || null,
                target_date: currentGoal.target_date || null,
            };
            
            if (editingGoalId) {
                await updateGoal(editingGoalId, payload);
            } else {
                await createGoal(payload);
            }
            
            fetchUserGoals();
            resetFormAndCloseModal();
        } catch (err) {
            setFormError(err.message || "Failed to save goal.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteGoal = async (goalId) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            try {
                await deleteGoal(goalId);
                fetchUserGoals();
            } catch (err) {
                alert("Failed to delete goal: " + err.message);
            }
        }
    };
    
    const selectedGoalTypeDetails = goalTypes.find(gt => gt.value === currentGoal.goal_type);

    return (
        <div className="space-y-8 sm:space-y-10 animate-fadeIn">
            <div className="pb-6 border-b border-gray-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
                        <FiTarget className="mr-3 text-green-600"/> My Goals
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Define and track your fitness and wellness objectives.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex-shrink-0 flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 ease-in-out transform hover:scale-105"
                >
                    <FiPlus className="mr-1.5 h-5 w-5"/> Add New Goal
                </button>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-10">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <span className="ml-3 text-gray-600">Loading Goals...</span>
                </div>
            )}

            {error && !isLoading && (
                <div className="text-center py-10 px-6 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-600 flex items-center justify-center gap-2">
                        <FiAlertCircle/> {error}
                    </p>
                    <button onClick={fetchUserGoals} className="mt-3 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                        Retry
                    </button>
                </div>
            )}

            {!isLoading && !error && goals.length === 0 && (
                <div className="text-center py-12 px-6 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Goals Yet</h3>
                    <p className="text-gray-500 mb-4">Click "Add New Goal" to get started!</p>
                </div>
            )}

            {!isLoading && !error && goals.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <GoalCard 
                            key={goal.id} 
                            goal={goal} 
                            onEdit={handleOpenModal} // Pass the goal object to prefill
                            onDelete={handleDeleteGoal}
                        />
                    ))}
                </div>
            )}

            <Modal 
                isOpen={isModalOpen} 
                onClose={resetFormAndCloseModal} 
                title={editingGoalId ? "Edit Goal" : "Add New Goal"}
            >
                <form onSubmit={handleSubmitGoal} className="space-y-5">
                    <div>
                        <label htmlFor="goal_type" className="block text-sm font-medium text-gray-700 mb-1">Goal Type *</label>
                        <select 
                            id="goal_type" name="goal_type" 
                            value={currentGoal.goal_type} 
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2.5 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {goalTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-xs text-gray-400">(Optional)</span></label>
                        <input 
                            type="text" id="description" name="description"
                            value={currentGoal.description} onChange={handleInputChange}
                            placeholder="e.g., Lose 5kg by summer"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="target_value" className="block text-sm font-medium text-gray-700 mb-1">Target Value *</label>
                            <input 
                                type="number" id="target_value" name="target_value"
                                value={currentGoal.target_value} onChange={handleInputChange}
                                required step="any" min="0.01" // Allow decimals, ensure positive
                                placeholder="e.g., 70 or 10000"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="target_unit" className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                            <input 
                                type="text" id="target_unit" name="target_unit"
                                value={currentGoal.target_unit || selectedGoalTypeDetails?.unit || ''} 
                                onChange={handleInputChange}
                                placeholder={selectedGoalTypeDetails?.unit || "Unit"}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                readOnly={!!selectedGoalTypeDetails?.unit && selectedGoalTypeDetails?.unit !== ''} // Readonly if predefined and not empty
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-xs text-gray-400">(Optional)</span></label>
                            <input 
                                type="date" id="start_date" name="start_date"
                                value={currentGoal.start_date} onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="target_date" className="block text-sm font-medium text-gray-700 mb-1">Target Date <span className="text-xs text-gray-400">(Optional)</span></label>
                            <input 
                                type="date" id="target_date" name="target_date"
                                value={currentGoal.target_date} onChange={handleInputChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <input 
                            id="is_active" name="is_active" type="checkbox" 
                            checked={currentGoal.is_active} onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Set as active goal</label>
                    </div>

                    {formError && <p className="text-sm text-red-600 flex items-center"><FiAlertCircle className="mr-1"/> {formError}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={resetFormAndCloseModal} className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="flex items-center px-5 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition disabled:opacity-60"
                        >
                            {isSubmitting ? <FiLoader className="animate-spin mr-1.5"/> : <FiSave className="mr-1.5"/>}
                            {isSubmitting ? "Saving..." : (editingGoalId ? "Update Goal" : "Save Goal")} 
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default GoalsPage;
