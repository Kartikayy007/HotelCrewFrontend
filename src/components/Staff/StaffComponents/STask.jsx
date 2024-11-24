import React from 'react'

const STask = () => {
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
      status: "in-progress",
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
      title: "Lobby",
      description: "Vacuum and clean the floors",
      created_at: "2024-11-24T06:00:00.000Z",
      updated_at: "2024-11-24T06:15:00.000Z",
      deadline: "2024-11-24T08:00:00.000Z",
      department: "housekeeping",
      status: "completed",
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

  const sortTasksByPriority = (tasks) => {
    // Define priority levels
    const priorityOrder = { High: 1, Normal: 2 }; // High has higher priority

    // Sort tasks
    return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  //   const pendingTasks = demoTasks.filter(task => task.status === "pending");
  // const completedTasks = demoTasks.filter(task => task.status === "completed");
  // const inProgressTasks = demoTasks.filter(task => task.status === "in-progress");
  const pendingTasks = sortTasksByPriority(
    demoTasks.filter((task) => task.status === "pending")
  );

  const completedTasks = sortTasksByPriority(
    demoTasks.filter((task) => task.status === "completed")
  );

  const inProgressTasks = sortTasksByPriority(
    demoTasks.filter((task) => task.status === "in-progress")
  );

  const renderTaskDetails = (tasks) => {
    if (tasks.length === 0) {
      return (
        <div
          className="flex justify-center items-center bg-[#efefef] border  my-3 mb-3 w-full h-[380px] rounded-xl border-gray-300"
          style={{ maxWidth: "600px", margin: " auto" }}
        >
          <p className="text-xl text-gray-600">No tasks available</p>
        </div>
      );
    }
    return tasks.map((task, index) => (
      <li
        key={index}
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

        <div className='space-y-5 xl:w-[33%] '>
          <div className="bg-white w-full  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow max-h-[700px] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-6 text-left">Pending Tasks</h2>
            <div className='my-2'>
            <ul >{renderTaskDetails(pendingTasks)}</ul>
            </div>
          </div>
        </div>

        <div className='space-y-5 xl:w-[33%] '>

          <div className="bg-white w-full max-h-[700px] overflow-y-auto pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">

            <h2 className="text-lg sm:text-xl font-semibold mb-6 text-left">Completed Task</h2>
            <ul>{renderTaskDetails(completedTasks)}</ul>
          </div>
        </div>

        <div className='space-y-5 xl:w-[34%] '>

          <div className='flex flex-col gap-5'>

            <div className='min-h-[60%]'>

              <div className="bg-white w-full min-h-[300px] overflow-y-auto   pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-left">Update Task</h2>

              </div>

            </div>

            <div className='min-h-[40%]'>

              <div className="bg-white w-full max-h-[500px] overflow-y-auto  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-left">Task in  Progress</h2>
                <ul>{renderTaskDetails(inProgressTasks)}</ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

  )
}

export default STask