import { useState, useEffect, React } from 'react'
import { FaClock, FaCheckCircle } from 'react-icons/fa';
import { Snackbar, Skeleton, Alert } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import {
  selectStaffTasks,
  selectStaffTaskCount,
  selectStaffTaskLoading,
  selectStaffTaskError,
  fetchStaffTasks,
  updateStaffTaskStatus
} from '../../../redux/slices/StaffTaskSlice';

const STask = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectStaffTasks);
  const taskCount = useSelector(selectStaffTaskCount);
  const taskloading = useSelector(selectStaffTaskLoading);
  const taskerror = useSelector(selectStaffTaskError);
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (taskerror) {
        const errorMessage = typeof taskerror === 'string' 
            ? taskerror 
            : taskerror.message || "An error occurred";
            
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);

        // If unauthorized, redirect to login
        if (errorMessage.includes('Session expired')) {
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
    }
}, [taskerror]);

  useEffect(() => {
    dispatch(fetchStaffTasks());
   
    const intervalId = setInterval(() => {
      dispatch(fetchStaffTasks());
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (!tasks) return;
    
    const pending = tasks.filter((task) => task.status === "Pending");
    const completed = tasks.filter((task) => task.status === "Completed");
    const inProgress = tasks.filter((task) => task.status === "In Progress");

    setPendingTasks(sortTasksByPriority(pending));
    setCompletedTasks(sortTasksByPriority(completed));
    setInProgressTasks(sortTasksByPriority(inProgress));
  }, [tasks]);

  const skeletonProps = {
    animation: "wave",
    sx: {
      animationDuration: "0.8s",
    },
  };


  const handleStatusUpdate = (taskId, newStatus) => {
    console.log("Updating task status to:", taskId, newStatus);
    dispatch(updateStaffTaskStatus({
      id: taskId,
      status: newStatus
    }))
      .unwrap()
      .then(() => {
        setSnackbarMessage("Task status updated successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // dispatch(fetchStaffTasks());
        // console.log("Task status updated successfully");
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        
        if (error.response?.status !== 200) {
            setSnackbarMessage(error.message || "Failed to update task status");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    });
  };

  const sortTasksByPriority = (tasks) => {
    const priorityOrder = { high: 1, normal: 2, High: 1, Normal: 2 };
    return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  const renderTaskDetails = (tasks, showStatusButton = false, buttonType = null) => {
    if (tasks.length === 0) {
      return (
        <div
          className="flex flex-col justify-center items-center gap-6  my-3 w-full xl:h-[600px] h-[200px]  rounded-xl "
          style={{ maxWidth: "98%", margin: " auto" }}
        >
          <img src='/task.png' className='w-28 text-gray-600'/>
          <p className="text-lg text-gray-600">No task available</p>
         
        </div>
      );
    }
    return tasks.map((task, index) => (
      <li
        key={index}
        className={`border my-3 sm:text-[16px] text-[13px] rounded-xl p-3 ${task.status === "Pending" ? "bg-[#fdf6f6]" : "bg-[#ffff]"} border-gray-300`}
      >
        <div className='flex lg:flex-row flex-col mb-2 lg:justify-between'>
          <h3 className="font-semibold text-lg capitalize pr-2">{task.title}</h3>
          <span className='bg-blue-100 items-end px-2 my-2 lg:my-0 w-max py-1 capitalize rounded-md'>{task.department}</span>
        </div>
        <p className="text-md text-gray-600 mb-3">{task.description}</p>
        <p className="text-md text-gray-600">
          <strong>Created at:</strong> {new Date(task.created_at).toLocaleString()}
        </p>
        <p className="text-md text-gray-600 mb-3 pr-4"> <strong>Assigned by : </strong>{task.assigned_by}</p>
        <p className="text-md text-gray-600 mb-3 pr-4"> <strong>Assigned to : </strong>{task.assigned_to}</p>
        
        {showStatusButton && (
          <div className="my-3 flex justify-start items-center gap-3">
            {buttonType === 'pending' && (
              <button
                className="bg-[#252941] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a1d30] transition-colors"
                onClick={() => handleStatusUpdate(task.id, "In Progress")}
              >
                <FaClock /> Move to In Progress
              </button>
            )}
            {buttonType === 'inProgress' && (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
                onClick={() => handleStatusUpdate(task.id, "Completed")}
              >
                <FaCheckCircle /> Mark Done
              </button>
            )}
          </div>
        )}
      </li>
    ));
  };

  return (
    <section className="min-h-screen py-2 mx-4 px-0 font-Montserrat overflow-auto no-scrollbar">
      <h2 className="text-[#252941] text-3xl my-3 pl-8 ml-5 font-semibold">Task Status</h2>
      <div className="flex h-[97%] flex-col xl:flex-row gap-5 p-3">
        <div className='space-y-5 xl:w-[33%] xl:order-1 order-1'>
          <div className="bg-white w-full xl:min-h-[715px]  pb-1 pr-6 pl-6 rounded-lg shadow max-h-[700px] overflow-y-auto no-scrollbar">
            <h2 className="text-lg sm:text-xl bg-white font-semibold pb-6 pt-6 sticky top-0 text-left">Pending Tasks</h2>
            <div className='my-2'>
              {taskloading ? (
                <div className='ml-4 mb-2'>
                  <Skeleton variant="rectangular" width="95%" height={600} {...skeletonProps} />
                </div>
              ) : (
                <ul>{renderTaskDetails(pendingTasks, true, 'pending')}</ul>
              )}
            </div>
          </div>
        </div>

        <div className='space-y-5 xl:w-[33%] order-2'>
          <div className="bg-white w-full xl:min-h-[715px]  pb-1 pr-6 pl-6 rounded-lg shadow max-h-[700px] overflow-y-auto noo-scrollbar">
            <h2 className="text-lg sm:text-xl bg-white font-semibold pb-6 sticky top-0 pt-6 text-left">Task in Progress</h2>
            <div className='my-2'>
              {taskloading ? (
                <div className='ml-4 mb-2'>
                  <Skeleton variant="rectangular" width="95%" height={600} {...skeletonProps} />
                </div>
              ) : (
                <ul>{renderTaskDetails(inProgressTasks, true, 'inProgress')}</ul>
              )}
            </div>
          </div>
        </div>

        <div className='space-y-5 xl:w-[34%] order-3'>
          <div className="bg-white w-full xl:min-h-[715px] max-h-[700px] overflow-y-auto  pb-1 pr-6 pl-6 rounded-lg shadow no-scrollbar">
            <h2 className="text-lg sm:text-xl font-semibold pb-6 pt-6 text-left sticky top-0 bg-white">Completed Task</h2>
            {taskloading ? (
              <div className='ml-4 mb-2'>
                <Skeleton variant="rectangular" width="95%" height={600} {...skeletonProps} />
              </div>
            ) : (
              <ul>{renderTaskDetails(completedTasks)}</ul>
            )}
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: '100%',
            '& .MuiAlert-filledSuccess': {
              backgroundColor: '#4CAF50'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </section>
  )
}

export default STask