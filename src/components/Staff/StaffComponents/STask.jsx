import { useState, useEffect, React } from 'react'
import { FaClock, FaCheckCircle } from 'react-icons/fa';
import { Snackbar, Skeleton } from "@mui/material";

const STask = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {

      setLoading(false);
    }, 1500);

  }, []);
  const skeletonProps = {
    animation: "wave",
    sx: {
      animationDuration: "0.8s",
    },
  };
  const demoTasks = [
    {
      title: "Room 101",
      description: "Serve breakfast - scrambled eggs and toast",
      created_at: "2024-11-24T08:15:30.000Z",
      updated_at: "2024-11-24T08:16:00.000Z",
      deadline: "2024-11-24T09:00:00.000Z",
      department: "kitchen",
      status: "pending",
      completed_at: null,
      priority: "high"
    },
    {
      title: "Room 204",
      description: "Replace bedsheets and pillow covers",
      created_at: "2024-11-24T07:45:00.000Z",
      updated_at: "2024-11-24T07:50:00.000Z",
      deadline: "2024-11-24T10:00:00.000Z",
      department: "housekeeping",
      status: "pending",
      completed_at: null,
      priority: "normal"
    },
    {
      title: "Room 307",
      description: "Fix bathroom faucet",
      created_at: "2024-11-23T15:30:00.000Z",
      updated_at: "2024-11-23T16:00:00.000Z",
      deadline: null,
      department: "maintenance",
      status: "pending",
      completed_at: null,
      priority: "high"
    },
    {
      title: "Room 405",
      description: "Serve lunch - Grilled chicken and salad",
      created_at: "2024-11-24T11:00:00.000Z",
      updated_at: "2024-11-24T11:05:00.000Z",
      deadline: "2024-11-24T12:30:00.000Z",
      department: "kitchen",
      status: "pending",
      completed_at: null,
      priority: "normal"
    },
    {
      title: "Room 408",
      description: "Serve lunch - Grilled chicken and salad",
      created_at: "2024-11-24T11:00:00.000Z",
      updated_at: "2024-11-24T11:05:00.000Z",
      deadline: "2024-11-24T12:30:00.000Z",
      department: "kitchen",
      status: "pending",
      completed_at: null,
      priority: "normal"
    },
    {
      title: "Lobby",
      description: "Vacuum and clean the floors",
      created_at: "2024-11-24T06:00:00.000Z",
      updated_at: "2024-11-24T06:15:00.000Z",
      deadline: "2024-11-24T08:00:00.000Z",
      department: "housekeeping",
      status: "pending",
      completed_at: "2024-11-24T07:45:00.000Z",
      priority: "normal"
    },
    {
      title: "Room 501",
      description: "Inspect and replace smoke detector batteries",
      created_at: "2024-11-23T10:00:00.000Z",
      updated_at: "2024-11-23T10:30:00.000Z",
      deadline: "2024-11-25T12:00:00.000Z",
      department: "maintenance",
      status: "pending",
      completed_at: null,
      priority: "normal"
    },
  ];
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState(demoTasks);
  const [isStatusMenuVisible, setIsStatusMenuVisible] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
   const [originalStatus, setOriginalStatus] = useState(null);


  
  const handleTaskClick = (task) => {
    if (selectedTask) {
      setSnackbarMessage("A task is alerady selected to be updated");
      setSnackbarOpen(true);
      return;
    }

    setSelectedTask(task);
    
    const updatedTasks = tasks.filter((t) => t.title !== task.title)
    setTasks(sortTasksByPriority(updatedTasks));
    setPendingTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "pending")));
    setCompletedTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "completed")));
    setInProgressTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "in-progress")));
  }
 

const handleTaskClose = () => {
  if (!selectedTask) return;

  const task = selectedTask;
  const updatedTasks = tasks.concat(task); // Add it back to the task list

  // Move the task back to its corresponding list based on its status
  if (task.status === "pending") {
    setPendingTasks(prev => sortTasksByPriority([...prev.filter(t => t.title !== task.title), task]));
  } else if (task.status === "completed") {
    setCompletedTasks(prev => sortTasksByPriority([...prev.filter(t => t.title !== task.title), task]));
  } else if (task.status === "in-progress") {
    setInProgressTasks(prev => sortTasksByPriority([...prev.filter(t => t.title !== task.title), task]));
  }

  setTasks(updatedTasks); // Restore the task back to the general task list
  setSelectedTask(null); // Deselect the task
};
 
  const handleStatusUpdate = (newStatus) => {
  if (newStatus === "in-progress" && inProgressTasks.length >= 2) {
    setSnackbarMessage("Cannot move more than 2 tasks to In Progress.");
    setSnackbarOpen(true);
    return;
  }

 
  const updatedTask = { ...selectedTask, status: newStatus };

  
  const updatedTasks = [...tasks, updatedTask];

 
  setTasks(sortTasksByPriority(updatedTasks));
  setPendingTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "pending")));
  setCompletedTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "completed")));
  setInProgressTasks(sortTasksByPriority(updatedTasks.filter((t) => t.status === "in-progress")));

  // Clear the selected task
  setIsStatusMenuVisible(false);
  setSelectedTask(null);
};


  const sortTasksByPriority = (tasks) => {
   
    const priorityOrder = { high : 1, normal: 2,High:1,Normal:2 }; // High has higher priority

    // Sort tasks
    return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };
  const [pendingTasks, setPendingTasks] = useState(sortTasksByPriority(demoTasks.filter((task) => task.status === "pending")));
  const [completedTasks, setCompletedTasks] = useState(sortTasksByPriority(demoTasks.filter((task) => task.status === "completed")));
  const [inProgressTasks, setInProgressTasks] = useState(sortTasksByPriority(demoTasks.filter((task) => task.status === "in-progress")));

  const renderTaskDetails = (tasks) => {
    if (tasks.length === 0) {
      return (
        <div
          className="flex justify-center items-center bg-[#efefef] border  my-3 mb-3 w-full xl:h-[600px] h-[200px] rounded-xl border-gray-300"
          style={{ maxWidth: "600px", margin: " auto" }}
        >
          <p className="text-xl text-gray-600">No tasks available</p>
        </div>
      );
    }
    return tasks.map((task, index) => (
      <li
        key={index}
        onClick={() => handleTaskClick(task)}
        className={`border my-3 rounded-xl p-3 ${task.status === "pending" ? "bg-[#efefef]" : "bg-[#ffff]"} border-gray-300`}
      >
       
        <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
        <p className="text-md text-gray-600 mb-3">{task.description}</p>

        <p className="text-md text-gray-600">
          <strong>Assigned at:</strong> {new Date(task.created_at).toLocaleString()}
        </p>
        <p className="text-md text-gray-600 my-1 capitalize">
          <strong>Priority: </strong>
          <span className={task.priority === "high" ? "text-red-600 font-semibold" : "text-gray-600"}>
            {task.priority}
          </span>
        </p>
      </li>
    ));
  };

  return (
    <section className=" min-h-screen py-2 mx-4 px-0 font-Montserrat overflow-auto">
      <h2 className="text-[#252941] text-3xl  my-3 pl-8 ml-5 font-semibold">Task Status</h2>
      <div className="flex flex-col  xl:flex-row gap-5 p-3 ">

        <div className='space-y-5 xl:w-[33%] lg:order-1 order-3'>
          <div className="bg-white w-full xl:min-h-[715px] pt-4 pb-1 pr-6 pl-6 rounded-lg shadow max-h-[700px] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-6 text-left">Pending Tasks</h2>
            <div className='my-2'>
            {loading ? (
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
            {loading ? (
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

        <div className='space-y-5 xl:w-[34%] order-1 lg:order-3'>

          <div className='flex flex-col gap-5'>

            <div className='min-h-[60%]'>

              <div className="bg-white w-full min-h-[300px] overflow-y-auto  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-left">Update Task</h2>
                {loading ? (
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
                      <div className={`border my-3 rounded-xl p-3 bg-[#e6efe9] border-gray-300`}>
                        <div className='flex justify-between'>
                        <h3 className="font-semibold">{selectedTask.title}</h3>
                      <button onClick={handleTaskClose}>X</button>
                        </div>
                        <p>{selectedTask.description}</p>
                        <p><span className='text-gray-600 font-semibold'>Assigned at : </span> {new Date(selectedTask.created_at).toLocaleString()}</p>
                        <p><span className='text-gray-600 font-semibold'>Priority : </span> <span className={`capitalize ${selectedTask.priority === "high" ? "text-red-600 font-semibold" : "text-gray-600"}`}>

                          {selectedTask.priority}
                        </span>
                        </p>
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
                            onClick={() => handleStatusUpdate("in-progress")}
                          >
                            <FaClock /> In Progress
                          </button>
                          <button
                            className="bg-green-500 text-white p-3 rounded-lg flex items-center gap-2"
                            onClick={() => handleStatusUpdate("completed")}
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

              <div className="bg-white w-full xl:min-h[400px] max-h-[400px] overflow-y-auto  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-left">Task in  Progress</h2>
                {loading ? (
              <div className='ml-4 mb-2'>
                <Skeleton variant="rectangular"
                  width="95%"
                  height={320}
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
      <Snackbar
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
  }}
/>
    </section>

  )
}

export default STask