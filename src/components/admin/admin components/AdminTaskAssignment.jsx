import React from 'react';
import { MoreVertical, Clock, CheckCircle } from 'lucide-react';

const AdminTaskAssignment = () => {
  const tasks = [
    { id: 1, status: 'pending', deadline: '2:00 AM' },
    { id: 2, status: 'in-progress', deadline: '2:00 AM' },
    { id: 3, status: 'completed', deadline: '2:00 AM', completedAt: '2:00 PM' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-600';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-red-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Monitor Active Tasks</h1>
      
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${getStatusColor(task.status)}`}>
                  {getStatusIcon(task.status)}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold">Clean 203</h2>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                      Maintenance
                    </span>
                    <span className={`px-2 py-1 text-xs rounded capitalize ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  {task.deadline && (
                    <p className="text-sm text-gray-600 mt-1">
                      Deadline: {task.deadline}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-700 mt-1">
                    Urgent cleaning required.
                  </p>
                  
                  <div className="text-sm text-gray-600 mt-2">
                    <p>Assigned by: Username, Role</p>
                    <div className="flex justify-between items-center mt-1">
                      {task.status === 'completed' ? (
                        <p>Completed: {task.completedAt}</p>
                      ) : (
                        <p>Last Updated: 11:00 PM</p>
                      )}
                      <p>11:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTaskAssignment;