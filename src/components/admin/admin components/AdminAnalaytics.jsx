import React, { useState, useEffect } from "react";
import { Box, Skeleton, Slider } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import { BarChart } from "@mui/x-charts/BarChart";
import { TrendingUp, TrendingDown } from 'lucide-react';
import OccupancyHeatmap from "./ admin analysis components/OccupancyHeatmap";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  ChartLegend
);
import AdminAttendanceList from "../admin components/ admin analysis components/AdminAttendanceList";

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [performanceRange, setPerformanceRange] = useState([0, currentHour || 1]);
  const [timeData, setTimeData] = useState([]);
  const [dateRange, setDateRange] = useState([1, new Date().getDate()]);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);

  const generateTimeData = (hour) => {
    const performanceData = [];
    for (let i = 0; i <= hour; i++) {
      performanceData.push({
        hour: `${i}:00`,
        performance: Math.floor(Math.random() * (95 - 85 + 1)) + 85,
        revenue: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
      });
    }
    return performanceData;
  };

  const generateMarks = () => {
    const marks = [];
    const maxHour = currentHour || 1;

    marks.push({ value: 0, label: "0h" });
    if (maxHour >= 6) marks.push({ value: 6, label: "6h" });
    if (maxHour >= 12) marks.push({ value: 12, label: "12h" });
    if (maxHour >= 18) marks.push({ value: 18, label: "18h" });
    if (maxHour === 24) marks.push({ value: 24, label: "24h" });
    if (!marks.find((mark) => mark.value === maxHour)) {
      marks.push({ value: maxHour, label: `${maxHour}h` });
    }
    return marks;
  };

  const generateAttendanceData = () => {
    const data = {
      dates: [],
      present: [],
      absent: [],
    };

    const today = new Date();
    const currentDay = today.getDay(); 
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const daysToShow = currentDay + 1;

    for (let i = 0; i < daysToShow; i++) {
      const dayIndex = i;
      data.dates.push(daysOfWeek[dayIndex]);
      
      const totalStudents = 50;
      const present = Math.floor(Math.random() * 10) + 40;
      data.present.push(present);
      data.absent.push(totalStudents - present);
    }

    return data;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== currentHour) {
        setCurrentHour(newHour);
        setPerformanceRange([0, newHour || 1]);
        setTimeData(generateTimeData(newHour));
      }
    }, 60000);

    setTimeout(() => {
      setTimeData(generateTimeData(currentHour));
      setLoading(false);
    }, 1500);

    return () => clearInterval(interval);
  }, [currentHour]);

  const marks = generateMarks();

  const getFilteredData = (range) => {
    return timeData.slice(range[0], range[1] + 1);
  };

  const performanceData = {
    xAxis: [{
      id: "time",
      data: getFilteredData(performanceRange).map((d) => d.hour),
      scaleType: "band",
    }],
    series: [{
      data: getFilteredData(performanceRange).map((d) => d.performance),
      curve: "linear",
      color: "#2A2AA9",
    }],
  };

  const radialData = [
    {
      name: "Occupied",
      value: 10,
      fill: "#8884d8",
    },
    {
      name: "Available",
      value: 50,
      fill: "#83a6ed",
    },
    {
      name: "Reserved",
      value: 30,
      fill: "#8dd1e1",
    },
  ];

  const radarData = {
    labels: [
      "Front Desk",
      "Housekeeping",
      "Kitchen",
      "Maintenance",
      "Security",
      "Management",
      "Concierge",
    ],
    datasets: [
      {
        data: [85, 92, 75, 68, 88, 70, 82],
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.3)",
        borderColor: "rgb(99, 102, 241)",
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(99, 102, 241)",
      },
    ],
  };

  const attendanceData = generateAttendanceData();
  const maxDays = attendanceData.dates.length;

  const filteredData = {
    dates: attendanceData.dates.slice(dateRange[0] - 1, dateRange[1]),
    present: attendanceData.present.slice(dateRange[0] - 1, dateRange[1]),
    absent: attendanceData.absent.slice(dateRange[0] - 1, dateRange[1]),
  };

  console.log(filteredData);

  const handlePerformanceRangeChange = (event, newValue) => {
    setPerformanceRange(newValue);
  };

  const skeletonProps = {
    animation: "wave",
    variant: "rectangular",
    width: "100%",
    height: 250
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        Analytics
      </h1>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-4 p-3 sm:p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 delay-1000 hover:scale-105">
            <h3 className="text-lg font-semibold">Total Staff</h3>
            <p className="text-3xl font-semibold">136</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 delay-1000 hover:scale-105">
            <h3 className="text-lg font-semibold">Todays Revenue</h3>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-semibold">$1,292</p>
              {1292 > 1200 ? (
                <TrendingUp className="text-green-500" size={24} />
              ) : (
                <TrendingDown className="text-red-500" size={24} />
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 delay-1000 hover:scale-105">
            <h3 className="text-lg font-semibold">Todays Check-Ins</h3>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-semibold">423</p>
              {423 > 400 ? (
                <TrendingUp className="text-green-500" size={24} />
              ) : (
                <TrendingDown className="text-red-500" size={24} />
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 delay-1000 hover:scale-105">
            <h3 className="text-lg font-semibold">Total Check-Outs</h3>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-semibold">42</p>
              {42 > 38 ? (
                <TrendingUp className="text-green-500" size={24} />
              ) : (
                <TrendingDown className="text-red-500" size={24} />
              )}
            </div>
          </div>
        </div>

        {showAnalytics ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:col-span-2 h-96">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Attendance</h3>
                <button 
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-500 hover:text-gray-700 px-2 focus:outline-none text-4xl font-semibold h-12 z-10"
                >
                  ⋯
                </button>
              </div>
              <Box sx={{ width: "100%", height: "95%", mt: -7 }}>
                <BarChart
                  height={330}
                  series={[
                    {
                      data: filteredData.present,
                      id: "present",
                      color: "#3331D1",
                    },
                    {
                      data: filteredData.absent,
                      id: "absent",
                      color: "#151542",
                    },
                  ]}
                  borderRadius={5}
                  xAxis={[{
                    data: filteredData.dates,
                    scaleType: "band",
                  }]}
                />
                <Box sx={{ width: "100%", px: 5, mt: -2 }}>
                  <Slider
                    value={dateRange}
                    onChange={(_, newValue) => setDateRange(newValue)}
                    valueLabelDisplay="auto"
                    min={1}
                    max={maxDays}
                    marks={[
                      { value: 1, label: "1" },
                      { value: maxDays, label: maxDays.toString() }
                    ]}
                  />
                </Box>
              </Box>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 h-96">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  width: 400,
                  height: 250,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={15} 
                  size={200}
                  thickness={4}
                  sx={{
                    color: '#1a90ff',
                    backgroundColor: '#e6e6e6',
                    borderRadius: '50%'
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.secondary">
                    {`${Math.round(75)}%`} {/* Replace with your actual value */}
                  </Typography>
                </Box>
              </Box>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:col-span-2 h-96">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Staff Metrics (Hours {performanceRange[0]} - {performanceRange[1]})
              </h2>
              <Box sx={{ width: "100%", mb: 4 }}>
                {loading ? (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={250}
                    {...skeletonProps}
                  />
                ) : (
                  <LineChart
                  xAxis={performanceData.xAxis}
                  series={performanceData.series}
                  height={250}
                  margin={{ top: 10, right: 20, bottom: 30, left: 40 }}
                />
              )}
            </Box>
            <Box sx={{ width: "100%", px: 5 }}>
              <Slider
                value={performanceRange}
                onChange={handlePerformanceRangeChange}
                valueLabelDisplay="auto"
                step={1}
                marks={marks}
                min={0}
                max={currentHour || 1}
                sx={{ mt: -2 }}
              />
            </Box>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4  h-[45rem]">
            <h3 className="text-lg font-semibold">Occupancy Heatmap</h3>
            <div className="h-48 w-full mt-6">
            <OccupancyHeatmap />
            
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 h-80 mt-[-21rem]">
            <h3 className="text-lg font-semibold">Department Load</h3>
            <div className="h-64 w-full flex justify-center items-center">
              <Radar
                data={radarData}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    r: {
                      min: 0,
                      max: 100,
                      beginAtZero: true,
                      ticks: {
                        stepSize: 25,
                        font: {
                          size: 14,
                        },
                      },
                      pointLabels: {
                        font: {
                          size: 16,
                          weight: "bold",
                        },
                      },
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 h-80 mt-[-21rem]">
            <h3 className="text-lg font-semibold">Departments Performance</h3>
            <div className="h-64 w-full flex justify-center items-center">
              <Radar
                data={radarData}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    r: {
                      min: 0,
                      max: 100,
                      beginAtZero: true,
                      ticks: {
                        stepSize: 25,
                        font: {
                          size: 14,
                        },
                      },
                      pointLabels: {
                        font: {
                          size: 16,
                          weight: "bold",
                        },
                      },
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <AdminAttendanceList 
          onBack={() => setShowAnalytics(true)}
          dateRange={dateRange}
          attendanceData={filteredData}
        />
      )}
    </div>
  </section>
);
};

export default AdminAnalytics;