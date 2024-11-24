import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { LineChart } from "@mui/x-charts/LineChart";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Skeleton from "@mui/material/Skeleton";
import { selectAllTasks, selectTasksLoading } from "../../redux/slices/TaskSlice";
import { selectStaffPerDepartment, fetchStaffData } from "../../redux/slices/StaffSlice";

function StaffMetrics() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const staffPerDepartment = useSelector(selectStaffPerDepartment);
  const loading = useSelector(selectTasksLoading);
  
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [performanceRange, setPerformanceRange] = useState([0, currentHour || 1]);
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    dispatch(fetchStaffData());
  }, [dispatch]);

  useEffect(() => {
    if (tasks.length && staffPerDepartment) {
      calculatePerformanceData();
    }
  }, [tasks, staffPerDepartment, currentHour]);

  const calculatePerformanceData = () => {
    const performanceData = [];
    const totalAvailableStaff = Object.values(staffPerDepartment).reduce(
      (sum, count) => sum + count,
      0
    );

    for (let i = 0; i <= currentHour; i++) {
      const workedAndCompletedStaff = tasks.filter(
        task => task.status === 'completed' || task.status === 'in-progress'
      ).length;

      const performanceRate = (workedAndCompletedStaff / totalAvailableStaff) * 100;

      performanceData.push({
        hour: `${i}:00`,
        performance: performanceRate,
      });
    }

    setTimeData(performanceData);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== currentHour) {
        setCurrentHour(newHour);
        setPerformanceRange([0, newHour || 1]);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentHour]);

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

  const getFilteredData = (range) => {
    return timeData.slice(range[0], range[1] + 1);
  };

  const performanceData = {
    xAxis: [
      {
        id: "time",
        data: getFilteredData(performanceRange).map((d) => d.hour),
        scaleType: "band",
      },
    ],
    series: [
      {
        data: getFilteredData(performanceRange).map((d) => d.performance),
        curve: "linear",
        color: "#2A2AA9",
      },
    ],
  };

  const handlePerformanceRangeChange = (event, newValue) => {
    setPerformanceRange(newValue);
  };

  const StatsDisplay = () => {
    const totalAvailableStaff = Object.values(staffPerDepartment).reduce(
      (sum, count) => sum + count,
      0
    );
    const workedAndCompletedStaff = tasks.filter(
      task => task.status === 'completed' || task.status === 'in-progress'
    ).length;
    const currentPerformance = timeData.length > 0 ? 
      timeData[timeData.length - 1].performance.toFixed(1) : '0';

    return (
      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Available Staff</p>
          <p className="text-2xl font-bold">{totalAvailableStaff}</p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Worked & Completed</p>
          <p className="text-2xl font-bold">{workedAndCompletedStaff}</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Current Performance Rate</p>
          <p className="text-2xl font-bold">{currentPerformance}%</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg flex-1 w-full p-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Staff Metrics (Hours {performanceRange[0]} - {performanceRange[1]})
      </h2>

      <StatsDisplay />
      
      <Box sx={{ width: "100%", mb: 4, mt: 5 }}>
        {loading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={250}
            animation="wave"
            sx={{ animationDuration: "0.8s" }}
          />
        ) : (
          <LineChart
            xAxis={performanceData.xAxis}
            series={performanceData.series}
            height={250}
            margin={{ top: 5, right: 20, bottom: 30, left: 40 }}
          />
        )}
      </Box>

      <Box sx={{ width: "100%", px: 2 }}>
        <Slider
          value={performanceRange}
          onChange={handlePerformanceRangeChange}
          valueLabelDisplay="auto"
          step={1}
          marks={generateMarks()}
          min={0}
          max={currentHour || 1}
        />
      </Box>
    </div>
  );
}

export default StaffMetrics;