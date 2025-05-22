// frontend/src/pages/AdminWorkoutPlansPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FiArchive, FiCheckCircle, FiXCircle, FiClock, FiLoader, FiAlertCircle, FiFilter, FiEye, FiUsers, FiList } from 'react-icons/fi';
import { getAllWorkoutPlans, adminUpdateWorkoutPlanStatus } from '../services/api'; // Assuming you have these API functions
import WorkoutPlanDetailModal from '../components/common/WorkoutPlanDetailModal'; // Re-use if suitable

const AdminPlanCard = ({ plan, onUpdateStatus, onViewDetails }) => {
    const getStatusColor = (status) => {
        if (status === 'approved') return 'bg-green-100 text-green-700';
        if (status === 'rejected') return 'bg-red-100 text-red-700';
        if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 truncate" title={plan.name}>
                        {plan.name}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(plan.status)}`}>
                        {plan.status}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">
                    By: <span className="font-medium text-indigo-600">{plan.creator_username || 'Unknown User'}</span>
                </p>
                <p className="text-xs text-gray-500 mb-3">
                    Submitted: {new Date(plan.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                    {plan.description || 'No description.'}
                </p>
                <div className="text-xs text-gray-500 mb-3">
                    <FiList className="inline mr-1"/> {plan.exercises?.length || 0} exercises
                </div>

                {plan.status === 'pending' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => onUpdateStatus(plan.id, 'approved')}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md text-white bg-green-500 hover:bg-green-600 transition-colors"
                        >
                            <FiCheckCircle className="mr-1.5"/> Approve
                        </button>
                        <button
                            onClick={() => onUpdateStatus(plan.id, 'rejected')}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors"
                        >
                            <FiXCircle className="mr-1.5"/> Reject
                        </button>
                    </div>
                )}
                 <div className="mt-2 pt-2 border-t border-gray-100">
                    <button
                        onClick={() => onViewDetails(plan)}
                        className="w-full flex items-center justify-center text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1"
                    >
                        <FiEye className="mr-1"/> View Full Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

function AdminWorkoutPlansPage() {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
    const [viewingPlan, setViewingPlan] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);


    const fetchAdminPlans = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // getAllWorkoutPlans with admin context (backend should handle this based on token)
            const data = await getAllWorkoutPlans();
            setPlans(data || []);
        } catch (err) {
            setError(err.message || "Failed to load workout plans for admin.");
            setPlans([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdminPlans();
    }, [fetchAdminPlans]);

    const handleUpdateStatus = async (planId, newStatus) => {
        try {
            await adminUpdateWorkoutPlanStatus(planId, newStatus);
            fetchAdminPlans(); // Refresh list
            alert(`Plan ${planId} status updated to ${newStatus}.`);
        } catch (err) {
            alert(`Failed to update plan status: ${err.message}`);
        }
    };

    const handleViewDetails = (plan) => {
        setViewingPlan(plan);
        setIsDetailModalOpen(true);
    };

    const filteredPlans = useMemo(() => {
        if (filterStatus === 'all') {
            return plans;
        }
        return plans.filter(plan => plan.status === filterStatus);
    }, [plans, filterStatus]);

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <FiArchive className="mr-3 text-slate-700"/> Workout Plan Management
                    </h1>
                    <p className="mt-1 text-md text-gray-600">
                        Approve, reject, or view submitted workout plans. ({filteredPlans.length} showing)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <FiFilter className="text-gray-500"/>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
                    <span className="ml-3 text-gray-600">Loading Plans...</span>
                </div>
            )}
            {error && !isLoading && (
                <div className="text-center py-10 px-6 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-600 flex items-center justify-center gap-2"><FiAlertCircle/> {error}</p>
                    <button onClick={fetchAdminPlans} className="mt-3 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Retry</button>
                </div>
            )}

            {!isLoading && !error && filteredPlans.length === 0 && (
                <div className="text-center py-12 px-6 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Plans Found</h3>
                    <p className="text-gray-500">
                        {filterStatus === 'all' ? 'There are no workout plans in the system yet.' : `No plans found with status "${filterStatus}".`}
                    </p>
                </div>
            )}

            {!isLoading && !error && filteredPlans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map(plan => (
                        <AdminPlanCard
                            key={plan.id}
                            plan={plan}
                            onUpdateStatus={handleUpdateStatus}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            )}
             {viewingPlan && (
                <WorkoutPlanDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    plan={viewingPlan}
                />
            )}
        </div>
    );
}

export default AdminWorkoutPlansPage;
