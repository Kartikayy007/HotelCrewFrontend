import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, Check, X } from 'lucide-react';
import { 
  fetchTasks, 
  selectAllTasks, 
  deleteTask,
  selectTasksLoading, 
  selectTasksError,
  selectTasksByStatus,
  selectTaskMetrics,
} from '../../../redux/slices/TaskSlice';
import { fetchStaffStatus } from '../../../redux/slices/StaffSlice';
import LoadingAnimation from '../../common/LoadingAnimation';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

const getStatusColor = (status) => {
  switch(status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress': 
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status) => {
  switch(status?.toLowerCase()) {
    case 'completed':
      return <Check className="w-4 h-4 text-green-600" />;
    case 'in_progress': 
      return <Clock className="w-4 h-4 text-blue-600" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case 'cancelled':
      return <X className="w-4 h-4 text-red-600" />;
    default:
      return null;
  }
};

const EmptyTaskState = ({ status }) => (
  <div className="flex flex-col items-center justify-center h-48 text-gray-500">
    <svg 
      className="w-12 h-12 mb-3 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
    <p className="text-sm font-medium">No {status} tasks</p>
  </div>
);

// Update the TaskColumn component's div className
const TaskColumn = ({ title, status, tasks }) => (
  <div className="bg-gray-50 rounded-lg p-4 h-[65vh] overflow-scroll">
    <h2 className="text-lg font-semibold mb-4 flex items-center">
      <div className={`w-3 h-3 rounded-full ${
        status === 'pending' ? 'bg-yellow-400' :
        status === 'in_progress' ? 'bg-blue-400' :
        'bg-green-400'
      } mr-2`}></div>
      {title}
    </h2>
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <EmptyTaskState status={status} />
      ) : (
        tasks.map((task, index) => (
          <TaskCard key={`${status}-${index}`} task={task} />
        ))
      )}
    </div>
  </div>
);

const TaskDetailDialog = ({ task, open, onClose }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    try {
      if (!task?.id) {
        throw new Error('No task ID available');
      }
      
      setIsDeleting(true);
      await dispatch(deleteTask(task.id)).unwrap();
      await dispatch(fetchTasks());
      dispatch(fetchStaffStatus())
      setIsDeleting(false);
      onClose();
    } catch (err) {
      setIsDeleting(false);
      console.error('Failed to delete task:', err);
    }
  };

  const formattedDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }); 
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${getStatusColor(task?.status)}`}>
              {getStatusIcon(task?.status)}
            </div>
            <DialogTitle className="text-xl font-semibold p-0">
              {task?.title}
            </DialogTitle>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <DialogContent className="mt-4 p-0">
          <div className="space-y-4">
            <div>
              <span className="px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded">
                {task?.department}
              </span>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {task?.description}
              </p>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Assigned by:</span>
                <span>{task?.assigned_by}</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned to:</span>
                <span>{task?.assigned_to}</span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{formattedDate(task?.created_at)}</span>
              </div>
              {task?.completed_at && (
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span>{formattedDate(task?.completed_at)}</span>
                </div>
              )}
              {task?.deadline && (
                <div className="flex justify-between">
                  <span>Deadline:</span>
                  <span>{formattedDate(task?.deadline)}</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            onClick={handleDelete}
            variant="outlined"
            color="error"
            disabled={isDeleting}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </Button>
          
        </div>
      </div>
    </Dialog>
  );
};

const TaskCard = ({ task }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formattedDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
        onDoubleClick={() => setIsDialogOpen(true)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 w-full">
            <div className={`p-2 rounded-full flex-shrink-0 ${getStatusColor(task.status)}`}>
              {getStatusIcon(task.status)}
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold truncate" title={task.title}>
                  {task.title}
                </h2>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded inline-block mb-2">
                {task.department}
              </span>
              
              <p className="text-sm text-gray-700 line-clamp-2 mb-2" title={task.description}>
                {task.description}
              </p>
              
              <div className="text-sm text-gray-600 space-y-1">
                {task.deadline && (
                  <p className="text-red-600 font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Due: {formattedDate(task.deadline)}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  {task.completed_at ? (
                    <p className="truncate text-xs">
                      Completed: {formattedDate(task.completed_at)}
                    </p>
                  ) : (
                    <p className="truncate text-xs">
                      Created: {formattedDate(task.created_at)}
                    </p>
                  )}
                </div>
                {task.updated_at !== task.created_at && (
                  <p className="text-xs text-gray-500 truncate">
                    Updated: {formattedDate(task.updated_at)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskDetailDialog
        task={task}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

const AdminTaskAssignment = ({ onClose }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  const metrics = useSelector(selectTaskMetrics);
  
  const pendingTasks = useSelector(state => selectTasksByStatus(state, 'pending'));
  const inProgressTasks = useSelector(state => selectTasksByStatus(state, 'in_progress'));
  const completedTasks = useSelector(state => selectTasksByStatus(state, 'completed'));

  useEffect(() => {
    // Initial fetch
    dispatch(fetchTasks());

    // Setup polling
    const intervalId = setInterval(() => {
      dispatch(fetchTasks());
    }, POLLING_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (loading && !pendingTasks.length && !inProgressTasks.length && !completedTasks.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingAnimation size={40} color="#252941" />
        <p>Please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg inline-block">
          <p className="font-medium">Error loading tasks</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!loading && metrics.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <svg 
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Tasks Found</h3>
        <p className="text-gray-500 text-center max-w-sm">
          There are no tasks available at the moment. Create a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Monitor Active Tasks</h1>
      
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-800 font-semibold">Total Tasks</h3>
          <p className="text-2xl font-bold text-blue-600">{metrics.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-800 font-semibold">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{metrics.completed}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-yellow-800 font-semibold">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{metrics.pending}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <TaskColumn 
          title="Pending" 
          status="pending" 
          tasks={pendingTasks} 
        />
        <TaskColumn 
          title="In Progress" 
          status="in_progress"
          tasks={inProgressTasks} 
        />
        <TaskColumn 
          title="Completed" 
          status="completed" 
          tasks={completedTasks} 
        />
      </div>
      
      {/* Removed pagination UI */}
    </div>
  );
};

export default AdminTaskAssignment;