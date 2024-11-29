import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllTasks, fetchTasks } from '../../../../redux/slices/TaskSlice';
import { fetchStaffData, selectStaffPerDepartment } from '../../../../redux/slices/AdminStaffSlice';

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
  const staffPerDepartment = useSelector(selectStaffPerDepartment);
  const loading = useSelector(state => state.tasks.loading || state.staff.loading);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchStaffData());
  }, [dispatch]);

  const departmentMetrics = useMemo(() => {
    if (!tasks?.length) return [];

    // Create metrics for each department
    const metrics = Object.keys(staffPerDepartment).map(dept => {
      const deptTasks = tasks.filter(task => 
        task?.department?.toLowerCase() === dept.toLowerCase()
      );

      const completed = deptTasks.filter(task => 
        task?.status?.toLowerCase() === 'completed'
      ).length;

      const pending = deptTasks.filter(task => 
        task?.status?.toLowerCase() === 'pending'
      ).length;

      const inProgress = deptTasks.filter(task => 
        task?.status?.toLowerCase() === 'in_progress'
      ).length;

      const total = deptTasks.length;
      const performance = total ? 
        ((completed + (inProgress * 0.5)) / total * 100).toFixed(1) : 
        0;

      return {
        department: dept,
        staffCount: staffPerDepartment[dept] || 0,
        total,
        completed,
        inProgress,
        pending,
        performance
      };
    });

    return metrics.sort((a, b) => parseFloat(b.performance) - parseFloat(a.performance));
  }, [tasks, staffPerDepartment]);

  if (loading) {
    return (
      <div className="w-full overflow-y-auto h-[51rem]">
        <div className="grid grid-cols-1 gap-2">
          {[...Array(4)].map((_, index) => (
            <DepartmentSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!departmentMetrics.length) {
    return <div className="text-center text-gray-500">No departments available</div>;
  }

  return (
    <div className="w-full overflow-y-auto h-[51rem]">
      <div className="grid grid-cols-1 gap-2">
        {departmentMetrics.map((dept) => (
          <div 
            key={dept.department} 
            className="bg-white rounded-lg p-2 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  {dept.department}
                </h3>
                <span className="text-xs text-gray-500">
                  {dept.staffCount} staff members
                </span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {dept.performance}%
              </span>
            </div>
            
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-500"
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