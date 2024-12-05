// src/components/common/RevenueDashboard.jsx
import React from 'react';
import { LineChart } from '@mui/x-charts';
import { Skeleton } from '@mui/material';

const RevenueDashboard = ({
  revenueLoading = false,
  dailyRevenues = [],
  dates = [],
  latestRevenue = "0.00",
  skeletonProps = {}
}) => {
  // Enhanced console logs
  console.log('Raw Revenue Props:', {
    revenueLoading,
    dailyRevenues: dailyRevenues || [],
    dates: dates || [],
    latestRevenue,
    length: {
      dailyRevenues: dailyRevenues?.length,
      dates: dates?.length
    }
  });

  // Add type checking
  const validDailyRevenues = (dailyRevenues || [])
    .map(revenue => parseFloat(revenue))
    .filter(revenue => !isNaN(revenue));

  const validDates = (dates || [])
    .filter(date => date && typeof date === 'string');

  console.log('Processed Data:', {
    validDailyRevenues,
    validDates,
    hasPositiveRevenue: validDailyRevenues.some(v => v > 0)
  });

  // Ensure we have matching data points
  const dataLength = Math.min(validDailyRevenues.length, validDates.length);
  
  const chartData = {
    revenues: validDailyRevenues.slice(0, dataLength).map(Number), // Convert to numbers
    dates: validDates.slice(0, dataLength)
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Weekly Revenue Overview
        </h2>

        <div className="text-right">
          <p className="text-sm text-gray-500">
            Latest Revenue
          </p>
          <p className="text-xl font-bold">
            ₹{latestRevenue}
          </p>
        </div>
      </div>

      {revenueLoading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          {...skeletonProps}
        />
      ) : chartData.revenues.length === 0 || !chartData.revenues.some(v => v > 0) ? (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No revenue data available
        </div>
      ) : (
               <LineChart
          height={300}
          series={[{
            data: chartData.revenues?.length ? chartData.revenues : [0],
            color: "#4C51BF",
            area: true,
            curve: "catmullRom"
          }]}
          xAxis={[{
            data: chartData.dates?.length ? chartData.dates : ['No data'],
            scaleType: "band",
            tickLabelStyle: {
              angle: 0,
              fontSize: 12
            }
          }]}
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
    </div>
  );
};

export default RevenueDashboard;