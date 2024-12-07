import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, Clock, X } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import {
    fetchTasks,
    selectTasksByStatus,
    selectTasksLoading,
    selectTasksError
} from '../../../redux/slices/TaskSlice'

const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'in_progress':
            return 'bg-blue-100 text-blue-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusIcon = (status: string): JSX.Element | null => {
    switch (status?.toLowerCase()) {
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

const TaskCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-4 border border-gray-200 ">
    <div className="flex items-start space-x-4">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

const EmptyState = ({ status }: { status: string }) => (
  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
    <Clock className="w-8 h-8 mb-2" />
    <p>No {status} tasks</p>
  </div>
);

const TaskDetailDialog = ({ task, open, onClose }) => {
  const formattedDate = (dateString: string) => {
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
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
      </div>
    </Dialog>
  );
};

const TaskCard = ({ task }: { task: any }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formattedDate = (dateString: string) => {
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
                    <p className="text-xs md:text-sm text-gray-700 mt-1 line-clamp-2">
                        {task.description}
                    </p>
                    <div className="text-xs md:text-sm text-gray-600 mt-2">
                        <p>Assigned by: {task.assigned_by}</p>
                        {task.deadline && (
                            <p className="text-red-600 font-medium flex items-center mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                Due: {formattedDate(task.deadline)}
                            </p>
                        )}
                        <div className="flex justify-between items-center mt-1">
                            {task.status === 'completed' ? (
                                <p>Completed: {formattedDate(task.completed_at)}</p>
                            ) : (
                                <p>Created: {formattedDate(task.created_at)}</p>
                            )}
                        </div>
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

const TaskAssignment: React.FC = () => {
    const dispatch = useDispatch();
    const pendingTasks = useSelector((state) => selectTasksByStatus(state, 'pending'));
    const inProgressTasks = useSelector((state) => selectTasksByStatus(state, 'in_progress'));
    const completedTasks = useSelector((state) => selectTasksByStatus(state, 'completed'));
    const isLoading = useSelector(selectTasksLoading);
    const error = useSelector(selectTasksError);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="w-full px-4 md:px-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 w-full max-w-[1400px] mx-auto gap-4">
                    {[1, 2, 3].map((column) => (
                        <div key={column} className="flex flex-col gap-4">
                            <div className="flex-1 bg-white rounded-xl shadow-lg p-4 space-y-4">
                                {[1, 2].map((i) => (
                                    <TaskCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="w-full p-4 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="w-full px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full max-w-[1400px] h-[100%] mx-auto gap-4">
                <div className="h-[80vh] bg-[#FFFFFF] rounded-xl shadow-lg flex flex-col overflow-hidden">
                    <h2 className="text-base md:text-lg font-semibold sticky top-0 p-4 md:p-6 bg-[#FFFFFF] flex items-center z-10">
                        <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-yellow-400 mr-2"></div>
                        Pending
                    </h2>
                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ">
                        <div className="space-y-3 md:space-y-4 p-3 md:p-4">
                            {pendingTasks.length > 0 ? (
                                pendingTasks.map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))
                            ) : (
                                <EmptyState status="pending" />
                            )}
                        </div>
                    </div>
                </div>

                {/* In Progress */}
                <div className="h-[80vh] bg-[#FFFFFF] rounded-xl shadow-lg flex flex-col overflow-hidden">
                    <h2 className="text-base md:text-lg font-semibold sticky top-0 p-4 md:p-6 bg-[#FFFFFF] border-b border-[#BDBDBD] flex items-center z-10">
                        <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-blue-400 mr-2"></div>
                        In Progress
                    </h2>
                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        <div className="space-y-3 md:space-y-4 p-3 md:p-4">
                            {inProgressTasks.length > 0 ? (
                                inProgressTasks.map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))
                            ) : (
                                <EmptyState status="in progress" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Completed */}
                <div className="h-[80vh] bg-[#FFFFFF] rounded-xl shadow-lg flex flex-col overflow-hidden">
                    <h2 className="text-base md:text-lg font-semibold sticky top-0 p-4 md:p-6 bg-[#FFFFFF] border-b border-[#BDBDBD] flex items-center z-10">
                        <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-green-400 mr-2"></div>
                        Completed
                    </h2>
                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        <div className="space-y-3 md:space-y-4 p-3 md:p-4">
                            {completedTasks.length > 0 ? (
                                completedTasks.map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))
                            ) : (
                                <EmptyState status="completed" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskAssignment;