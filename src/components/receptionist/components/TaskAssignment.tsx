import React, { useState } from 'react';
import { Check, Clock, X } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  department: string;
  status: 'completed' | 'in-progress' | 'pending' | 'cancelled';
  deadline: string;
  description: string;
  assignedBy: string;
  lastUpdated: string;
  completedAt?: string;
}

const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Clean Room 203",
    department: "Housekeeping",
    status: "pending",
    deadline: "2:00 PM",
    description: "Deep cleaning required for VIP guest",
    assignedBy: "John Manager",
    lastUpdated: "11:00 AM"
  },
  {
    id: 2,
    title: "Fix AC Unit",
    department: "Maintenance",
    status: "in-progress",
    deadline: "4:00 PM",
    description: "AC not cooling in room 405",
    assignedBy: "Sarah Supervisor",
    lastUpdated: "1:30 PM"
  },
  {
    id: 3,
    title: "Prepare Dinner Setup",
    department: "Kitchen",
    status: "completed",
    deadline: "6:00 PM",
    completedAt: "5:45 PM",
    description: "Evening dinner service preparation",
    assignedBy: "Chef Michael",
    lastUpdated: "5:45 PM"
  },
  {
    id: 3,
    title: "Prepare Dinner Setup",
    department: "Kitchen",
    status: "completed",
    deadline: "6:00 PM",
    completedAt: "5:45 PM",
    description: "Evening dinner service preparation",
    assignedBy: "Chef Michael",
    lastUpdated: "5:45 PM"
  },
  {
    id: 3,
    title: "Prepare Dinner Setup",
    department: "Kitchen",
    status: "completed",
    deadline: "6:00 PM",
    completedAt: "5:45 PM",
    description: "Evening dinner service preparation",
    assignedBy: "Chef Michael",
    lastUpdated: "5:45 PM"
  },
  {
    id: 3,
    title: "Prepare Dinner Setup",
    department: "Kitchen",
    status: "completed",
    deadline: "6:00 PM",
    completedAt: "5:45 PM",
    description: "Evening dinner service preparation",
    assignedBy: "Chef Michael",
    lastUpdated: "5:45 PM"
  },
  {
    id: 3,
    title: "Prepare Dinner Setup",
    department: "Kitchen",
    status: "completed",
    deadline: "6:00 PM",
    completedAt: "5:45 PM",
    description: "Evening dinner service preparation",
    assignedBy: "Chef Michael",
    lastUpdated: "5:45 PM"
  },
  {
    id: 3,
    title: "Prepare Dinner Setup",
    department: "Kitchen",
    status: "completed",
    deadline: "6:00 PM",
    completedAt: "5:45 PM",
    description: "Evening dinner service preparation",
    assignedBy: "Chef Michael",
    lastUpdated: "5:45 PM"
  },
  {
    id: 3,
    title: "Prepare Dinner Setup",
    department: "Kitchen",
    status: "completed",
    deadline: "6:00 PM",
    completedAt: "5:45 PM",
    description: "Evening dinner service preparation",
    assignedBy: "Chef Michael",
    lastUpdated: "5:45 PM"
  },
  {
    id: 3,
    title: "Prepare Dinner Setup",
    department: "Kitchen",
    status: "completed",
    deadline: "6:00 PM",
    completedAt: "5:45 PM",
    description: "Evening dinner service preparation",
    assignedBy: "Chef Michael",
    lastUpdated: "5:45 PM"
  },

  {
    id: 4,
    title: "Lobby Security Check",
    department: "Security",
    status: "pending",
    deadline: "3:00 PM",
    description: "Regular security rounds",
    assignedBy: "Head of Security",
    lastUpdated: "2:30 PM"
  }
];

const getStatusColor = (status: Task['status']): string => {
  switch (status?.toLowerCase()) {
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

const getStatusIcon = (status: Task['status']): JSX.Element | null => {
  switch (status?.toLowerCase()) {
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

const TaskAssignment: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);

  return (
    <div className="w-full px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-[1400px] mx-auto gap-4">
        {/* Pending Column */}
        <div className="bg-[#FFFFFF] border-[#BDBDBD] rounded-xl h-[60vh] lg:h-[87vh] overflow-y-auto shadow-lg">
          <h2 className="text-base md:text-lg font-semibold -mt-4 sticky top-0 p-4 md:p-6 bg-[#FFFFFF] border-[#BDBDBD] flex items-center">
            <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-yellow-400 mr-2"></div>
            Pending
          </h2>
          <div className="space-y-3 md:space-y-4 p-3 md:p-4">
            {tasks.filter(task => task.status === 'pending').map((task, index) => (
              <TaskCard key={`pending-${index}`} task={task} />
            ))}
          </div>
        </div>

        {/* In Progress and Completed Column */}
        <div className="space-y-4">
          {/* In Progress */}
          <div className="bg-[#FFFFFF] border-[#BDBDBD] rounded-xl h-[45vh] lg:h-[42vh] overflow-y-auto shadow-lg">
            <h2 className="text-base md:text-lg font-semibold -mt-4 sticky top-0 p-4 md:p-6 bg-[#FFFFFF] border-[#BDBDBD] flex items-center">
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-blue-400 mr-2"></div>
              In Progress
            </h2>
            <div className="space-y-3 md:space-y-4 p-3 md:p-4">
              {tasks.filter(task => task.status === 'in-progress').map((task, index) => (
                <TaskCard key={`progress-${index}`} task={task} />
              ))}
            </div>
          </div>

          {/* Completed */}
          <div className="bg-[#FFFFFF] border-[#BDBDBD] rounded-xl h-[45vh] lg:h-[43vh] overflow-y-auto shadow-lg">
            <h2 className="text-base md:text-lg font-semibold -mt-4 sticky top-0 p-4 md:p-6 bg-[#FFFFFF] border-[#BDBDBD] flex items-center">
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-green-400 mr-2"></div>
              Completed
            </h2>
            <div className="space-y-3 md:space-y-4 p-3 md:p-4">
              {tasks.filter(task => task.status === 'completed').map((task, index) => (
                <TaskCard key={`completed-${index}`} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task }: { task: Task }) => (
  <div className="bg-white rounded-lg shadow p-3 md:p-4 border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3 md:space-x-4">
        <div className={`p-1.5 md:p-2 rounded-full ${getStatusColor(task.status)}`}>
          {getStatusIcon(task.status)}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base md:text-lg font-semibold">{task.title}</h2>
          </div>
          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">
            {task.department}
          </span>

          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Deadline: {task.deadline}
          </p>

          <p className="text-xs md:text-sm text-gray-700 mt-1">
            {task.description}
          </p>

          <div className="text-xs md:text-sm text-gray-600 mt-2">
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
    </div>
  </div>
);

export default TaskAssignment;