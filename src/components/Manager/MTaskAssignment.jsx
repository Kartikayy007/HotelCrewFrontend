
import React, { useState } from 'react';
import { Clock, Check, X } from 'lucide-react';

const getStatusColor = (status) => {
  switch(status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status) => {
  switch(status?.toLowerCase()) {
    case 'completed':
      return <Check className="w-4 h-4 text-green-600" />;
    case 'in-progress':
      return <Clock className="w-4 h-4 text-blue-600" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case 'cancelled':
      return <X className="w-4 h-4 text-red-600" />;
    default:
      return null;
  }
};

const MTaskAssignment = () => {
  const [tasks, setTasks] = useState(sampleTasks);

  return (
    <div className="p-6  mx-auto">
      <h1 className="text-2xl font-bold mb-6">Monitor Active Tasks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 h-[80vh] overflow-auto">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
            Pending
          </h2>
          <div className="space-y-4">
            {tasks.filter(task => task.status === 'pending').map((task, index) => (
              <TaskCard key={`pending-${index}`} task={task} />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 h-[80vh] overflow-auto">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
            In Progress
          </h2>
          <div className="space-y-4">
            {tasks.filter(task => task.status === 'in-progress').map((task, index) => (
              <TaskCard key={`progress-${index}`} task={task} />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 h-[80vh] overflow-auto">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
            Completed
          </h2>
          <div className="space-y-4">
            {tasks.filter(task => task.status === 'completed').map((task, index) => (
              <TaskCard key={`completed-${index}`} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task }) => (
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
          
          {/* <p className="text-sm text-gray-600 mt-1">
            Deadline: {task.deadline}
          </p> */}
          
          <p className="text-sm text-gray-700 mt-1">
            {task.description}
          </p>
          
          <div className="text-sm text-gray-600 mt-2">
            <p>Assigned by: {task.assignedBy}</p>
            <div className="flex justify-between items-center mt-1">
              {task.status === 'completed' ? (
                <p>Completed: {task.completedAt}</p>
              ) : (
                <p>Last Updated: {task.lastUpdated}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <button className="p-1 hover:bg-gray-100 rounded">
      </button>
    </div>
  </div>
);

export default MTaskAssignment;
