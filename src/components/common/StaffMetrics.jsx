import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart } from "@mui/x-charts/LineChart";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Skeleton from "@mui/material/Skeleton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const StaffMetrics = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [performanceRange, setPerformanceRange] = useState([0, currentHour || 1]);
  const [timeData, setTimeData] = useState([]);
  const [viewType, setViewType] = useState('daily');
  const [dailyPerformance, setDailyPerformance] = useState(0);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getTodayData = (weeklyStats) => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    return weeklyStats.find(stat => stat.date === today) || { performance_percentage: 0 };
  };

  const fetchWeeklyData = async () => {
    try {
      const response = await axios.get('https://hotelcrew-1.onrender.com/api/statics/performance/hotel/week/', {
        headers: getAuthHeaders(),
      });
      
      // Format data for graph
      const formattedData = response.data.weekly_stats.map(stat => ({
        date: new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' }),
        performance: stat.performance_percentage
      }));
      
      setWeeklyData(formattedData);

      const todayData = getTodayData(response.data.weekly_stats);
      console.log('Today data:', todayData);
      console.log('Current hour:', response.data);
      setDailyPerformance(todayData.performance_percentage);
      calculateDailyData(todayData.performance_percentage);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyData();
    // Refresh data every hour
    const interval = setInterval(fetchWeeklyData, 3600000);
    return () => clearInterval(interval);
  }, []);

  const calculateDailyData = (currentPerformance) => {
    const performanceData = [];
    let lastPerformance = 0;

    for (let i = 0; i <= currentHour; i++) {
      const hourlyRate = i === currentHour ? 
        currentPerformance - lastPerformance : 
        (currentPerformance / currentHour);
        
      performanceData.push({
        hour: `${i}:00`,
        performance: hourlyRate,
      });
      
      lastPerformance += hourlyRate;
    }

    setTimeData(performanceData);
  };

  const generateMarks = () => {
    const marks = [];
    const maxHour = viewType === 'daily' ? (currentHour || 1) : 6;
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
    if (viewType === 'weekly' && weeklyData) {
      return weeklyData;
    }
    return timeData.slice(range[0], range[1] + 1);
  };

  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
    if (event.target.value === 'daily') {
      setPerformanceRange([0, currentHour || 1]);
    } else {
      setPerformanceRange([0, 6]); // For weekly view
    }
  };

  const performanceData = {
    xAxis: [{
      id: "time",
      data: viewType === 'weekly' ? 
        getFilteredData().map(d => d.date) :
        getFilteredData(performanceRange).map(d => d.hour),
      scaleType: "band",
    }],
    series: [{
      data: viewType === 'weekly' ? 
        getFilteredData().map(d => d.performance) :
        getFilteredData(performanceRange).map(d => d.performance),
      curve: "linear",
      color: "#2A2AA9",
    }],
  };

  return (
    <div className="bg-white rounded-xl shadow-lg flex-1 w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Staff Metrics ({viewType === 'daily' ? 
            `Hours ${performanceRange[0]} - ${performanceRange[1]}` : 
            'Weekly View'})
        </h2>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>View</InputLabel>
          <Select
            value={viewType}
            onChange={handleViewTypeChange}
            label="View"
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </Select>
        </FormControl>
      </div>

      
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
  series={[{
    data: viewType === 'weekly' ? 
      getFilteredData().map(d => d.performance) :
      getFilteredData(performanceRange).map(d => d.performance),
    curve: "linear",
    color: "#4C51BF",
    area: true
  }]}
  height={300}
  margin={{ top: 5, right: 20, bottom: 30, left: 40 }}
  sx={{
    ".MuiLineElement-root": {
      strokeWidth: 2,
    },
    ".MuiAreaElement-root": {
      fillOpacity: 0.1,
    },
  }}
/>
        )}
      </Box>

      {viewType === 'daily' && (
        <Box sx={{ width: "100%", px: 2 }}>
          <Slider
            value={performanceRange}
            onChange={(event, newValue) => setPerformanceRange(newValue)}
            valueLabelDisplay="auto"
            step={1}
            marks={generateMarks()}
            min={0}
            max={currentHour || 1}
          />
        </Box>
      )}
    </div>
  );
};

export default StaffMetrics;