import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllTasks, fetchTasks } from '../../../../redux/slices/TaskSlice';

const DepartmentSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex justify-between items-center mb-1">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-12 bg-gray-200 rounded"></div>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full mt-2"></div>
      
      <div className="mt-3 grid grid-cols-3 gap-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-3 w-6 bg-gray-200 rounded mx-auto mb-1"></div>
            <div className="h-3 w-12 bg-gray-200 rounded mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DepartmentPerformance = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const loading = useSelector(state => state.tasks.loading);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const departmentMetrics = React.useMemo(() => {
    const defaultDepartments = {
      housekeeping: { total: 0, completed: 0, inProgress: 0, pending: 0 },
      frontdesk: { total: 0, completed: 0, inProgress: 0, pending: 0 },
      maintenance: { total: 0, completed: 0, inProgress: 0, pending: 0 },
      kitchen: { total: 0, completed: 0, inProgress: 0, pending: 0 }
    };

    const departmentGroups = tasks.reduce((acc, task) => {
      const dept = task.department?.toLowerCase() || 'other';
      if (!acc[dept]) {
        acc[dept] = {
          total: 0,
          completed: 0,
          inProgress: 0,
          pending: 0
        };
      }
      
      acc[dept].total += 1;
      
      switch(task.status) {
        case 'completed':
          acc[dept].completed += 1;
          break;
        case 'in-progress':
          acc[dept].inProgress += 1;
          break;
        case 'pending':
          acc[dept].pending += 1;
          break;
        default:
          acc[dept].pending += 1;
          break;
      }
      
      return acc;
    }, defaultDepartments);

    return Object.entries(departmentGroups).map(([dept, stats]) => ({
      department: dept.charAt(0).toUpperCase() + dept.slice(1),
      performance: Math.min(((stats.completed + stats.inProgress * 0.5) / Math.max(stats.total, 1) * 100), 100).toFixed(1),
      total: stats.total,
      completed: stats.completed,
      inProgress: stats.inProgress,
      pending: stats.pending
    }));
  }, [tasks]);

  if (loading) {
    return (
      <div className="w-full overflow-y-auto max-h-[440px]">
        <div className="grid grid-cols-1 gap-2">
          {[...Array(4)].map((_, index) => (
            <DepartmentSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!tasks.length) {
    return <div className="text-center text-gray-500">No tasks available</div>;
  }

  return (
    <div className="w-full overflow-y-auto max-h-[440px]">
      <div className="grid grid-cols-1 gap-2">
        {departmentMetrics.map((dept) => (
          <div 
            key={dept.department} 
            className="bg-white rounded-lg p-2 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-medium text-gray-800">
                {dept.department}
              </h3>
              <span className="text-sm font-semibold text-blue-600">
                {dept.performance}%
              </span>
            </div>
            
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${dept.performance}%` }}
              />
            </div>
            
            <div className="mt-1 grid grid-cols-3 gap-1 text-xs">
              <div className="text-center">
                <span className="text-green-600 font-medium">{dept.completed}</span>
                <p className="text-gray-500">Done</p>
              </div>
              <div className="text-center">
                <span className="text-yellow-600 font-medium">{dept.inProgress}</span>
                <p className="text-gray-500">Active</p>
              </div>
              <div className="text-center">
                <span className="text-red-600 font-medium">{dept.pending}</span>
                <p className="text-gray-500">Pending</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentPerformance;