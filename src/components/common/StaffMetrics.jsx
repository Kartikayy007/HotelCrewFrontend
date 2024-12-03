import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart } from "@mui/x-charts/LineChart";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const StaffMetrics = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekRange, setWeekRange] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const formatDateRange = (dateString) => {
    const [startDate, endDate] = dateString.split(' - ').map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    });
    return `${startDate} - ${endDate}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${weekday}\n${month}/${day}`;
  };

  const fetchWeeklyData = async () => {
    try {
      const response = await axios.get('https://hotelcrew-1.onrender.com/api/statics/performance/hotel/week/', {
        headers: getAuthHeaders(),
      });
      
      // Format data for graph with weekday and date
      const formattedData = response.data.weekly_stats.map(stat => ({
        date: formatDate(stat.date),
        performance: stat.performance_percentage
      }));
      
      setWeeklyData(formattedData);
      setWeekRange(formatDateRange(response.data.week_range));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyData();
    // Refresh data every hour
    const interval = setInterval(fetchWeeklyData, 3600000);
    return () => clearInterval(interval);
  }, []);

  const performanceData = {
    xAxis: [{
      id: "time",
      data: weeklyData.map(d => d.date),
      scaleType: "band",
    }],
    series: [{
      data: weeklyData.map(d => d.performance),
      curve: "linear",
      color: "#2A2AA9",
    }],
  };

  return (
    <div className="bg-white rounded-xl shadow-lg flex-1 w-full p-4">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Staff Performance Metrics
        </h2>
        {weekRange && (
          <p className="text-sm text-gray-600">
            Week of: {weekRange}
          </p>
        )}
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
              data: weeklyData.map(d => d.performance),
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
    </div>
  );
};

export default StaffMetrics;