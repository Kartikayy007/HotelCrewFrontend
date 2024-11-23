import {useState, useEffect, React} from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, Typography, Paper, Container , Box, Skeleton, Slider } from '@mui/material';


const SDashboard = () => {
  const tasks = [];
  const today = new Date();


  const demoTasks = [
    { date: "2024-11-17", tasksCompleted: 4, averageDuration: 25 },  // Sunday
    { date: "2024-11-18", tasksCompleted: 10, averageDuration: 60 },  // Monday
    { date: "2024-11-19", tasksCompleted: 12, averageDuration: 80 },  // Tuesday
    { date: "2024-11-20", tasksCompleted: 5, averageDuration: 38 },  // Wednesday
    { date: "2024-11-21", tasksCompleted: 12, averageDuration: 98 },  // Thursday
    { date: "2024-11-22", tasksCompleted: 7, averageDuration: 88 }, // Friday
    { date: "2024-11-23", tasksCompleted: 8, averageDuration: 51 }, // Saturday
  ];
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
  
  
    // const demoTasks = generateDemoTasks(); // Replace with real data when available
  const [weekData, setWeekData] = useState([]);
  const [displayRange, setDisplayRange] = useState([0, 6]);


  // const performanceData = [
  //   { time: '00:00', value: 6 },
  //   { time: '04:00', value: 4 },
  //   { time: '08:00', value: 8 },
  //   { time: '12:00', value: 9 },
  //   { time: '16:00', value: 5 },
  //   { time: '20:00', value: 0 },
  //   { time: '24:00', value: 2 },
  // ];


  const PerformanceChart = ({ weekData }) => {
    return (
      <LineChart width={800} height={400} data={weekData}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="weekday" /> 
        <YAxis
          domain={[0, 10]} // Ensure y-axis is restricted between 0 and 10
          ticks={[0, 2, 4, 6, 8, 10]} // Custom ticks
        />
        {/* <Tooltip /> */}
        <Line dataKey="performance" stroke="#82ca9d" />
      </LineChart>
    );
  };


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
            <div className="grid grid-cols-1 lg:grid-cols-[70%,30%] gap-5 p-3 ">

{/* First Column */}
<div className="space-y-5">

  <div className="bg-white w-full  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
  <Box sx={{ flex: "1 1 " }}>
              <Card elevation={2}>
                <CardContent>
                  <h2 className="text-lg sm:text-xl font-semibold">Your Performance</h2>
                  <Box sx={{ height: 300, pt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PerformanceChart weekData={filteredData} />
                    </ResponsiveContainer>
                    <DateRangeSlider
                      range={weekData.map((day) => day.weekday)} // Use weekday names
                      displayRange={displayRange}
                      onRangeChange={(newRange) => setDisplayRange(newRange)}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>

    </div>
    <div className="flex lg:flex-row flex-col gap-4">
      <div className="bg-white w-full  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative', 
          }}
        >
          <h2 className="text-lg sm:text-xl font-semibold">Your Attendance</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={AttendanceData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                innerRadius="50%"
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
              top: '55%',
              left: '51%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000, // Ensure it's on top of the Pie chart
            }}
          >
            <h2 className="text-[28px]  font-semibold">
              {`${presentPercentage}%`}
              </h2>
            
          </Box>
        </Box>
     
      
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-center">Attendance : {AttendanceData[0].value}/{totalDays}</h2>
    </div>
    <div className="bg-white w-full  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
    <Box sx={{ flex: '1 1 300px' }}>
    <h2 className="text-lg sm:text-xl font-semibold">Leave Request Status</h2>
    
          </Box>
    </div>
    </div>
    </div>
    </div>
    </section>
  )
}

export default SDashboard