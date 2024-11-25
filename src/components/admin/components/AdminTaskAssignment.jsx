import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, Check, X } from 'lucide-react';
import { 
  fetchTasks, 
  selectAllTasks, 
  selectTasksLoading, 
  selectTasksError,
  selectTasksByStatus
} from '../../../redux/slices/TaskSlice';
import LoadingAnimation from '../../common/LoadingAnimation';

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

const TaskColumn = ({ title, status, tasks }) => (
  <div className="bg-gray-50 rounded-lg p-4 h-[80vh] overflow-scroll">
    <h2 className="text-lg font-semibold mb-4 flex items-center">
      <div className={`w-3 h-3 rounded-full ${
        status === 'pending' ? 'bg-yellow-400' :
        status === 'in_progress' ? 'bg-blue-400' :
        'bg-green-400'
      } mr-2`}></div>
      {title}
    </h2>
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <TaskCard key={`${status}-${index}`} task={task} />
      ))}
    </div>
  </div>
);

const TaskCard = ({ task }) => {
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
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-full ${getStatusColor(task.status)}`}>
            {getStatusIcon(task.status)}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">{task.title}</h2>
            </div>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
              {task.department}
            </span>
            
            <p className="text-sm text-gray-700 mt-1">
              {task.description}
            </p>
            
            <div className="text-sm text-gray-600 mt-2">
              <div className="flex justify-between items-center mt-1">
                {task.completed_at ? (
                  <p>Completed: {formattedDate(task.completed_at)}</p>
                ) : (
                  <p>Created: {formattedDate(task.created_at)}</p>
                )}
              </div>
              {task.updated_at !== task.created_at && (
                <p className="text-xs text-gray-500">
                  Updated: {formattedDate(task.updated_at)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminTaskAssignment = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  
  const pendingTasks = useSelector(state => selectTasksByStatus(state, 'pending'));
  const inProgressTasks = useSelector(state => selectTasksByStatus(state, 'in_progress')); // Updated
  const completedTasks = useSelector(state => selectTasksByStatus(state, 'completed'));

  useEffect(() => {
    dispatch(fetchTasks());
    
    const interval = setInterval(() => {
      console.log('Fetching tasks...');
      dispatch(fetchTasks());
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading && !pendingTasks.length && !inProgressTasks.length && !completedTasks.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingAnimation size={40} color="#252941" />
      <p>
        Please wait...
      </p>
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Monitor Active Tasks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TaskColumn 
          title="Pending" 
          status="pending" 
          tasks={pendingTasks} 
        />
        <TaskColumn 
          title="In Progress" 
          status="in_progress" // Fixed to match API
          tasks={inProgressTasks} 
        />
        <TaskColumn 
          title="Completed" 
          status="completed" 
          tasks={completedTasks} 
        />
      </div>
    </div>
  );
};

export default AdminTaskAssignment;