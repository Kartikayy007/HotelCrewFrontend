import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllTasks, fetchTasks } from '../../../../redux/slices/TaskSlice';
import { fetchStaffData, selectStaffPerDepartment } from '../../../../redux/slices/staffSlice';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

const DepartmentSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 ">
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchStaffData());
  }, [dispatch]);

  const departmentMetrics = useMemo(() => {
    // Get all departments from staffPerDepartment
    const departments = Object.keys(staffPerDepartment);
    
    return departments.map(dept => {
      const deptTasks = tasks?.filter(task => 
        task?.department?.toLowerCase() === dept.toLowerCase()
      ) || [];

      // Default values if no tasks
      const completed = deptTasks.filter(task => 
        task?.status?.toLowerCase() === 'completed'
      ).length || 0;

      const pending = deptTasks.filter(task => 
        task?.status?.toLowerCase() === 'pending'
      ).length || 0;

      const inProgress = deptTasks.filter(task => 
        task?.status?.toLowerCase() === 'in_progress'
      ).length || 0;

      const total = deptTasks.length || 0;
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
        performance: isNaN(performance) ? 0 : performance
      };
    }).sort((a, b) => parseFloat(b.performance) - parseFloat(a.performance));
  }, [tasks, staffPerDepartment]);

  const DepartmentDetailsDialog = ({ open, onClose, department, metrics }) => {
    if (!department) return null;

    const taskData = [
      {
        value: metrics.completed,
        label: 'Completed',
        color: '#22C55E'
      },
      {
        value: metrics.inProgress,
        label: 'In Progress', 
        color: '#EAB308'
      },
      {
        value: metrics.pending,
        label: 'Pending',
        color: '#EF4444'
      }
    ];

    const barChartData = {
      data: [
        { category: 'Tasks', completed: metrics.completed, inProgress: metrics.inProgress, pending: metrics.pending }
      ],
      colors: ['#22C55E', '#EAB308', '#EF4444']
    };

    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 24,
          }
        }}
        BackdropProps={
          { sx: { backdropFilter: 'blur(5px)' } }
        }
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{department} Performance</h2>
              <p className="text-sm text-gray-500">
                {metrics.staffCount} staff members • {metrics.performance}% efficiency
              </p>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-4">Task Distribution</h3>
              <PieChart
                series={[{
                  data: taskData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  innerRadius: 30,
                  paddingAngle: 2,
                  cornerRadius: 4,
                }]}
                height={200}
                margin={{ top: 10, bottom: 10 }}
              />
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-4">Task Status Overview</h3>
              <BarChart
                dataset={barChartData.data}
                series={[
                  { dataKey: 'completed' },
                  { dataKey: 'inProgress' },
                  { dataKey: 'pending'}
                ]}
                height={200}
                colors={barChartData.colors}
                xAxis={[{ scaleType: 'band', dataKey: 'category' }]}
              />
            </div>

            <div className="col-span-1 md:col-span-2 bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-semibold text-green-600">{metrics.completed}</p>
                  <p className="text-sm text-gray-600">Completed Tasks</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-yellow-600">{metrics.inProgress}</p>
                  <p className="text-sm text-gray-600">Active Tasks</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-red-600">{metrics.pending}</p>
                  <p className="text-sm text-gray-600">Pending Tasks</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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

  // Only check for departments, not metrics
  if (!Object.keys(staffPerDepartment).length) {
    return <div className="text-center text-gray-500 mt-72">No departments available</div>;
  }

  return (
    <div className="w-full overflow-y-auto h-[51rem]">
      <div className="grid grid-cols-1 gap-2">
        {departmentMetrics.map((dept) => (
          <div 
            key={dept.department} 
            className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md"
            onDoubleClick={() => {
              setSelectedDepartment(dept);
              setDialogOpen(true);
            }}
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
      <DepartmentDetailsDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedDepartment(null);
        }}
        department={selectedDepartment?.department}
        metrics={selectedDepartment}
      />
    </div>
  );
};

export default DepartmentPerformance;