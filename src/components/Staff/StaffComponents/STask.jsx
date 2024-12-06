import { useState, useEffect, React } from 'react'
import { FaClock, FaCheckCircle } from 'react-icons/fa';
import { Snackbar, Skeleton,Alert } from "@mui/material";
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
  const [loading, setLoading] = useState(true);
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); 
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // useEffect(() => {
  //   dispatch(getTasks()); // Correctly dispatch the action
  // }, [dispatch]);
  useEffect(()=>{
    if(taskerror){
      setSnackbarMessage(taskerror.messege ||"An error occured");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  },[taskerror])

  useEffect(() => {
    dispatch(fetchStaffTasks()); // Fetch tasks immediately
     ("fnjdnf",tasks)
    const intervalId = setInterval(() => {
      dispatch(fetchStaffTasks()); // Fetch every 5 minutes
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [dispatch], 2000); // Only depends on `dispatch`

  useEffect(() => {
     ("Task LIST:", tasks);
    setPendingTasks(
      sortTasksByPriority(tasks.filter((task) => task.status === "Pending"))
    );
    setCompletedTasks(
      sortTasksByPriority(tasks.filter((task) => task.status === "Completed"))
    );
    setInProgressTasks(
      sortTasksByPriority(tasks.filter((task) => task.status === "In-Progress"))
    ); // Logs whenever `tasks` updates
  }, [tasks]);
  // Ensure dispatch is included as a dependency

  const skeletonProps = {
    animation: "wave",
    sx: {
      animationDuration: "0.8s",
    },
  };


  const [selectedTask, setSelectedTask] = useState(null);
  // const [tasks, setTasks] = useState(demoTasks);
  const [isStatusMenuVisible, setIsStatusMenuVisible] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);


  const handleTaskClick = (task) => {
    if (selectedTask) {
      setSnackbarMessage("A task is alerady selected to be updated");
      setSnackbarOpen(true);
      setSnackbarSeverity('success');

      return;
    }

    setSelectedTask(task);

    const updatedTasks = tasks.filter((t) => t.title !== task.title)
    // setTasks(sortTasksByPriority(updatedTasks));
    setPendingTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "Pending")));
    setCompletedTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "Completed")));
    setInProgressTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "In-Progress")));
  }


  const handleTaskClose = () => {
    if (!selectedTask) return;

    const task = selectedTask;
    const updatedTasks = tasks.concat(task); // Add it back to the task list

    // Move the task back to its corresponding list based on its status
    if (task.status === "Pending") {
      setPendingTasks(prev => sortTasksByPriority([...prev.filter(t => t.title !== task.title), task]));
    } else if (task.status === "Completed") {
      setCompletedTasks(prev => sortTasksByPriority([...prev.filter(t => t.title !== task.title), task]));
    } else if (task.status === "In-Progress") {
      setInProgressTasks(prev => sortTasksByPriority([...prev.filter(t => t.title !== task.title), task]));
    }

    // setTasks(updatedTasks); // Restore the task back to the general task list
    setSelectedTask(null); // Deselect the task
  };

  // const handleStatusUpdate = (newStatus) => {
  //   // if (newStatus === "in-progress" && inProgressTasks.length >= 2) {
  //   //   setSnackbarMessage("Cannot move more than 2 tasks to In Progress.");
  //   //   setSnackbarOpen(true);
  //   //   return;
  //   // }


  //   const updatedTask = { ...selectedTask, status: newStatus };


  //   const updatedTasks = [...tasks, updatedTask];


  //   // setTasks(sortTasksByPriority(updatedTasks));
  //   setPendingTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "pending")));
  //   setCompletedTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "completed")));
  //   setInProgressTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "in-progress")));

  //   // Clear the selected task
  //   setIsStatusMenuVisible(false);
  //   setSelectedTask(null);
  // };
  const handleStatusUpdate = (newStatus) => {
    if (!selectedTask) return;
    
    dispatch(updateStaffTaskStatus({ 
      id: selectedTask.id, 
      status: newStatus 
    }))
      .unwrap()
      .then(() => {
        setSnackbarMessage("Task status updated successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setIsStatusMenuVisible(false);
        setSelectedTask(null);
        // Refresh task list
        dispatch(fetchStaffTasks());
      })
      .catch((error) => {
        setSnackbarMessage("Failed to update task status");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const sortTasksByPriority = (tasks) => {

    const priorityOrder = { high: 1, normal: 2, High: 1, Normal: 2 }; // High has higher priority

    // Sort tasks
    return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };
  // const [pendingTasks, setPendingTasks] = useState(sortTasksByPriority(tasks.filter((task) => task.status === "Pending")));
  // const [completedTasks, setCompletedTasks] = useState(sortTasksByPriority(tasks.filter((task) => task.status === "Completed")));
  // const [inProgressTasks, setInProgressTasks] = useState(sortTasksByPriority(tasks.filter((task) => task.status === "In-Progress")));

  const renderTaskDetails = (tasks) => {
    if (tasks.length === 0) {
      return (
        <div
          className="flex justify-center items-center   bg-[#efefef] border  my-3  w-full xl:h-[600px] h-[200px] rounded-xl border-gray-300"
          style={{ maxWidth: "98%", margin: " auto" }}
        >
          <p className="text-xl text-gray-600">No task available</p>
        </div>
      );
    }
    return tasks.map((task, index) => (
      <li
        key={index}
        onClick={() => handleTaskClick(task)}
        className={`border my-3 sm:text-[16px] text-[13px] rounded-xl p-3 ${task.status === "Pending" ? "bg-[#efefef]" : "bg-[#ffff]"} border-gray-300`}
      >
        <div className='flex lg:flex-row flex-col mb-2 lg:justify-between'>
          <h3 className="font-semibold  text-lg capitalize pr-2">{task.title}</h3>
          <span className='bg-blue-300 items-end px-2 my-2 lg:my-0 w-max py-1 capitalize rounded-md'>{task.department}</span>
        </div>
        <p className="text-md text-gray-600 mb-3">{task.description}</p>

        <p className="text-md text-gray-600">
          <strong>Created at:</strong> {new Date(task.created_at).toLocaleString()}
        </p>
        <p className="text-md text-gray-600 mb-3 pr-4"> <strong>Assigned by : </strong>{task.assigned_by}</p>
        <p className="text-md text-gray-600 mb-3 pr-4"> <strong>Assigned to : </strong>{task.assigned_to}</p>
        {/* <p className="text-md text-gray-600 my-1 capitalize">
          <strong>Priority: </strong>
          <span className={task.priority === "high" ? "text-red-600 font-semibold" : "text-gray-600"}>
            {task.priority}
          </span>
        </p> */}
      </li>
    ));
  };

  return (
    <section className=" min-h-screen py-2 mx-4 px-0 font-Montserrat overflow-auto">
      <h2 className="text-[#252941] text-3xl  my-3 pl-8 ml-5 font-semibold">Task Status</h2>
      <div className="flex h-[97%] flex-col  xl:flex-row gap-5 p-3  ">

        <div className='space-y-5 xl:w-[33%]  xl:order-1 order-3'>
          <div className="bg-white w-full xl:min-h-[715px] pt-4 pb-1 pr-6 pl-6 rounded-lg shadow max-h-[700px] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-6 text-left">Pending Tasks</h2>
            <div className='my-2'>
              {taskloading ? (
                <div className='ml-4 mb-2'>
                  <Skeleton variant="rectangular"
                    width="95%"
                    height={600}
                    {...skeletonProps}
                  />
                </div>
              ) : (
                <ul >{renderTaskDetails(pendingTasks)}</ul>
              )}
            </div>
          </div>
        </div>

        <div className='space-y-5 xl:w-[33%] order-2'>

          <div className="bg-white w-full xl:min-h-[715px] max-h-[700px] overflow-y-auto pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">

            <h2 className="text-lg sm:text-xl font-semibold mb-6 text-left">Completed Task</h2>
            {taskloading ? (
              <div className='ml-4 mb-2'>
                <Skeleton variant="rectangular"
                  width="95%"
                  height={600}
                  {...skeletonProps}
                />
              </div>
            ) : (
              <ul>{renderTaskDetails(completedTasks)}</ul>
            )}
          </div>
        </div>

        <div className='space-y-5 xl:w-[34%] order-1 xl:order-3'>

          <div className='flex flex-col gap-5'>

            <div className='min-h-[60%]'>

              <div className="bg-white w-full lg:min-h-[360px] min-h-[200px] overflow-y-auto  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-left">Update Task</h2>
                {taskloading ? (
                  <div className='ml-4 mb-2'>
                    <Skeleton variant="rectangular"
                      width="95%"
                      height={250}
                      {...skeletonProps}
                    />
                  </div>
                ) : (
                  <div className={'${slectedTask? "bg-[#efe6e9]":"bg-gray-400 "'}>
                    {selectedTask ? (
                      <>
                        <div className={`border my-3 rounded-xl p-2 sm:text-[16px] text-[13px] lg:p-3 bg-[#e6efe9] border-gray-300`}>
                          <div className='flex justify-between mb-2'>
                            <h3 className="font-semibold text-lg capitalize">{selectedTask.title}</h3>
                            <button className='pr-3 font-bold' onClick={handleTaskClose}>X</button>
                          </div>
                          <span className='bg-blue-300 py-1 px-2 rounded-md capitalize'>{selectedTask.department}</span>
                          <p className='my-2'>{selectedTask.description}</p>
                          <p><span className='text-gray-600 font-semibold'>Assigned at : </span> {new Date(selectedTask.created_at).toLocaleString()}</p>
                          <p><span className='text-gray-600 font-semibold'>Assigned by : </span> {selectedTask.assigned_by}</p>
                          {/* <p><span className='text-gray-600 font-semibold'>Priority : </span> <span className={`capitalize ${selectedTask.priority === "high" ? "text-red-600 font-semibold" : "text-gray-600"}`}>

                          {selectedTask.priority}
                        </span> */}
                          {/* </p> */}
                          <p>Status : <span className='capitalize'>{selectedTask.status}</span></p>
                        </div>
                        {!isStatusMenuVisible && (
                          <button
                            className="bg-[#3A426F] my-3 text-center w-full text-white p-2 rounded-lg"
                            onClick={() => setIsStatusMenuVisible(true)} // Show status buttons
                          >
                            Choose Status
                          </button>
                        )}
                        {isStatusMenuVisible && (
                          <div className="mt-4 flex justify-center gap-6">
                            <button
                              className="bg-blue-400 text-white p-2 rounded-lg flex items-center gap-2"
                              onClick={() => handleStatusUpdate("In-Progress")}
                            >
                              <FaClock /> In Progress
                            </button>
                            <button
                              className="bg-green-500 text-white p-3 rounded-lg flex items-center gap-2"
                              onClick={() => handleStatusUpdate("Completed")}
                            >
                              <FaCheckCircle /> Completed

                            </button>

                          </div>
                        )}


                      </>

                    ) : (
                      <p>Select a task to update its status.</p>
                    )}
                  </div>
                )}
              </div>

            </div>

            <div className='min-h-[40%]'>

              <div className="bg-white w-full xl:h-[330px] max-h-[400px] overflow-y-auto  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-left">Task in  Progress</h2>
                {taskloading ? (
                  <div className='ml-4 mb-2'>
                    <Skeleton variant="rectangular"
                      width="95%"
                      height={200}
                      {...skeletonProps}
                    />
                  </div>
                ) : (
                  <ul>{renderTaskDetails(inProgressTasks)}</ul>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
      {/* <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={<span style={{ color: 'black', fontSize: '16px' }}>{snackbarMessage}</span>}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        ContentProps={{
          style: {
            backgroundColor: 'white', // Set the background color of the Snackbar
            color: 'black', // Ensure the text color is black
            fontSize: '16px', // Increase the font size
            // Adjust width for responsiveness
            maxWidth: '600px', // Set a maximum width
            textAlign: 'center', // Center-align text
            borderRadius: '8px', // Add rounded corners
            padding: '12px', // Add some padding
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Optional: subtle shadow
          },
        }} */}
      {/* /> */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success"
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