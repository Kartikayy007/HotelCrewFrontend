import {useState, useEffect, React} from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, Typography, Paper, Container , Box, Skeleton, Slider } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

const SDashboard = () => {
  const tasks = [];
  const today = new Date();
  const leave=[
    {}
  ]
const announcements=[
  {
    id: 2,
    title: "Fire Drill Reminder",
    description: "A fire drill is scheduled for all staff next Monday at 10 AM.",
    created_at: "2024-11-19T09:45:00.456789Z",
    assigned_by: "manager@hotelxyz.com (Manager)",
    department: "All",
    urgency: "urgent",
  },
  {
    id: 1,
        title: "System Maintenance",
        description: "The system will be under maintenance tomorrow.",
        created_at: "2024-11-18T21:14:23.162456Z",
        // "assigned_to": [
        //     "kfbwidfciwen544@jncnsd.com (Staff) (kitchen) (night)",
        //     "bjkhjbbjb@gmail.com (Staff) (maintenance) (evening)"
        // ],
        assigned_by: "cawifon795@cpaurl.com (Admin)",
        department: "All",
        urgency: "normal",
        // "hotel": "Hotel raj",
  },
        {
          id: 3,
          title: "Kitchen Staff Meeting",
          description: "Kitchen staff meeting at 4 PM in the main conference room.",
          created_at: "2024-11-20T14:30:12.897654Z",
          assigned_by: "chef@hotelxyz.com (Manager)",
          department: "Kitchen",
          urgency: "normal",
        },
        {
          id: 4,
          title: "Guest Complaint Follow-Up",
          description: "A guest complaint requires immediate attention by the reception staff.",
          created_at: "2024-11-21T11:00:32.456123Z",
          assigned_by: "reception@hotelxyz.com ( Reception)",
          department: "Reception",
          urgency: "urgent",
        },
        {
          id: 5,
          title: "Inventory Check",
          description: "Please ensure all inventory lists are updated by end of day.",
          created_at: "2024-11-22T17:10:45.123789Z",
          assigned_by: "stockmanager@hotelxyz.com (Manager)",
          department: "Maintenance",
          urgency: "urgent",
        },
        {
          id: 6,
          title: "New Policy Update",
          description: "A new policy regarding overtime has been published. Please review.",
          created_at: "2024-11-23T10:05:15.654321Z",
          assigned_by: "hr@hotelxyz.com (Manager)",
          department: "All",
          urgency: "normal",
  }
];

  const demoTasks = [
    { day: 0, tasksCompleted: 4, averageDuration: 29 },  // Sunday
    { day: 1, tasksCompleted: 10, averageDuration: 60 },  // Monday
    { day: 2, tasksCompleted: 12, averageDuration: 41 },  // Tuesday
    { day: 3, tasksCompleted: 5, averageDuration: 83 },  // Wednesday
    { day: 4, tasksCompleted: 12, averageDuration: 124 },  // Thursday
    { day: 5, tasksCompleted: 7, averageDuration: 88 }, // Friday
    { day: 6, tasksCompleted: 8, averageDuration: 51 }, // Saturday
  ];

  const demoLeave=[
    {
      id:1,
      leave_type:'Sic',
      description:'Annual Leave Request for vacation plannig',
      from_date:2024-11-20,
      to_date:2024-11-24,
    },
    {
      id:2,
      leave_type:'Sick',
      description:'Annual Leave Request for vacation plannig',
      from_date:2024-11-20,
      to_date:2024-11-23,
    },
    {
      id:3,
      leave_type:'Sick',
      description:'Annual Leave Request for vacation plannig',
      from_date:2024-11-25,
      to_date:2024-11-30,
    }
  ]

  // const days = demoTasks.map(task => task.day);
const averageDurations = demoTasks.map(task => task.averageDuration);
// console.log('days:', days);
// console.log('averageDurations:', averageDurations);
  const totalDays = 300;
  const presentDays = 280;
  const absentDays = totalDays - presentDays;
  const presentPercentage=((presentDays/totalDays)*100).toFixed(2);
  const AttendanceData = [
    { name:"Present" ,value: presentDays, label: "Present", color: "#2A2AA9" },
    { name:"Absent", value: absentDays, label: "Absent", color: " #A1B7FF" },
    
  ];
  const processTaskData = (tasks) => {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
  
    // Initializing weekData with days of the week
    const weekData = Array(7)
      .fill(0)
      .map((_, i) => {
        const date = new Date(today - (6 - i) * oneDay);
        const weekday = date.toLocaleString("en-US", { weekday: "short" }); // Get day as 'Sat', 'Sun', etc.
        return {
          date: date.toISOString().split("T")[0],
          weekday,
          tasksCompleted: 0,
          averageDuration: 0,
          performance: 0,
        };
      });
  
    // Simulate or process tasks as per the demo data
    tasks.forEach((task) => {
      const createdDate = task.date; // Assume task.date is already in 'YYYY-MM-DD' format
      const dayData = weekData.find((day) => day.date === createdDate);
  
      if (dayData) {
        dayData.tasksCompleted += task.tasksCompleted;
  
        // Calculate average duration for tasks on that day
        dayData.averageDuration = 
          (dayData.averageDuration * (dayData.tasksCompleted - task.tasksCompleted) + task.averageDuration * task.tasksCompleted) 
          / dayData.tasksCompleted;
  
        // Calculate performance (as you mentioned, this could be a function of average duration)
        dayData.performance = Math.min(10, Math.max(0, 10 - dayData.averageDuration / 5));
      }
    });
    console.log(weekData)  ;

    return weekData;
  };

  const DateRangeSlider = ({ range, displayRange, onRangeChange }) => {
    const marks = range.map((day, index) => ({ value: index, label: day }));
  
    return (
      <div style={{ marginTop: "20px" }}>
        <Slider
          value={displayRange} // Bind slider to state
          onChange={(_, newRange) => onRangeChange(newRange)} // Update range on change
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => range[value]} // Show weekday label on hover
          min={0}
          max={range.length - 1}
          marks={marks}
          step={1}
        />
      </div>
    );
  };
  
  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "text-red-500 uppercase font-semibold";
      case "normal":
        return "hidden";
      
    }
  };
  
  const [weekData, setWeekData] = useState([]);
  const [displayRange, setDisplayRange] = useState([0, 6]);


  // const PerformanceChart = ({ weekData }) => {
  //   return (
  //     <LineChart width={800} height={400} data={weekData}>
        
  //       <XAxis dataKey="weekday" /> 
  //       <YAxis
  //         domain={[0, 10]} 
  //         ticks={[0, 2, 4, 6, 8, 10]} 
  //       />
  //       <Tooltip />
  //       <Line dataKey="performance" stroke="#82ca9d" />
  //     </LineChart>
  //   );
  // };


  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date().toISOString().split("T")[0];
      const lastDateInRange = weekData[weekData.length - 1].date;
      if (currentDate !== lastDateInRange) {
        setWeekData(processTaskData(tasks));
      }
    }, 24 * 60 * 60 * 1000); // Check daily
  
    return () => clearInterval(interval);
  }, [weekData, tasks]);


  useEffect(() => {
    const processedData = processTaskData(demoTasks); // Pass the demoTasks array
    setWeekData(processedData);
  }, []);
  

  const filteredData = weekData.slice(displayRange[0], displayRange[1] + 1);

  return (
    <section className=" h-screen py-2 mx-4 px-0 font-Montserrat">
            <h2 className="text-[#252941] text-3xl  my-3 pl-12 ml-5 font-semibold">Dashboard</h2>
            <div className="grid grid-cols-1 xl:grid-cols-[70%,30%] gap-5 p-3 ">

{/* First Column */}
<div className="space-y-5">

  <div className="bg-white w-full pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
  <h2 className="text-lg sm:text-xl font-semibold text-left">Your Performance</h2>
  <LineChart
       xAxis={demoTasks.day}
       series={[{ data: averageDurations, 
        showMark:false
       }]} 
      margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
                  sx={{
                    ".MuiLineElement-root": {
                      strokeWidth: 2, 
                      stroke: '#4b59aa'
                    },
                    ".MuiHighlightElement-root": {
      fill: "#4b59aa", // Set the color of the circle (e.g., red)
      stroke: "#4b59aa", // Optional: set the border color if needed
    },

                  }}
      // width={500}
      height={340}
    />
    </div>
    <div className="flex lg:flex-row flex-col gap-4">
      <div className="bg-white w-full  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
      <h2 className="text-lg sm:text-xl font-semibold text-left">Your Attendance</h2>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative', 
          }}
        >
         

          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={AttendanceData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                innerRadius="55%"
                paddingAngle={5}
                labelLine={false}
              >
                {AttendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '51%',
              transform: 'translate(-50%, -50%)',
               // Ensure it's on top of the Pie chart
            }}
          >
            <h2 className="text-[28px] mt-0  font-semibold">
              {`${presentPercentage}%`}
              </h2>
            
          </Box>
        </Box>
     
      
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-center">Attendance : {AttendanceData[0].value}/{totalDays}</h2>
    </div>
    <div className="bg-white w-full  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
    <h2 className="text-lg sm:text-xl font-semibold">Leave Request Status</h2>
    <Box sx={{ flex: '1 1 300px' }}>
            
          </Box>
    </div>
    </div>
    </div>
    <div className="space-y-5 h-[725px]  ">
            <div className='bg-white w-full mb-4 h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pt-4 pb-1 pr-6 pl-6 rounded-lg shadow'>
            <h2 className="text-lg sm:text-xl font-semibold text-left mb-2">Announcements</h2>
            <div className='h-[90%] mb-4 overflow-y-auto flex flex-col scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
            {announcements.map((announcement) => {
        // Format the created_at date
        const createdDate = new Date(announcement.created_at);
        const formattedDate = createdDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const formattedTime = createdDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return (
              <div  key={announcement.id} className='bg-[#e6efe9] my-4 p-3 rounded-lg flex flex-col '>
                 <h2 className="text-lg font-semibold text-gray-800">{announcement.title}</h2>
            <p className="text-gray-600 mt-2">{announcement.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              <strong>Created At:</strong> {formattedDate} At {formattedTime}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Assigned By:</strong> {announcement.assigned_by}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Department:</strong> {announcement.department}
            </p>
            <p className={`text-sm mt-3 ${getUrgencyClass(announcement.urgency)}`}>
              {announcement.urgency}
            </p>
              </div>
            )
          })}
            </div>
            </div>
    </div>
    </div>
    </section>
  )
}

export default SDashboard