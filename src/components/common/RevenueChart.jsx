import React, {useState, useEffect} from "react";
import {LineChart} from "@mui/x-charts/LineChart";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Skeleton from "@mui/material/Skeleton";

function RevenueChart() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [revenueRange, setRevenueRange] = useState([0, currentHour || 1]);
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateTimeData = (hour) => {
    const data = [];
    for (let i = 0; i <= hour; i++) {
      data.push({
        hour: `${i}:00`,
        revenue: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
      });
    }
    return data;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== currentHour) {
        setCurrentHour(newHour);
        setRevenueRange([0, newHour || 1]);
        setTimeData(generateTimeData(newHour));
      }
    }, 60000);

    setTimeData(generateTimeData(currentHour));
    setLoading(false);

    return () => clearInterval(interval);
  }, [currentHour]);

  const generateMarks = () => {
    const marks = [];
    const maxHour = currentHour || 1;

    marks.push({value: 0, label: "0h"});
    if (maxHour >= 6) marks.push({value: 6, label: "6h"});
    if (maxHour >= 12) marks.push({value: 12, label: "12h"});
    if (maxHour >= 18) marks.push({value: 18, label: "18h"});
    if (maxHour === 24) marks.push({value: 24, label: "24h"});
    if (!marks.find((mark) => mark.value === maxHour)) {
      marks.push({value: maxHour, label: `${maxHour}h`});
    }
    return marks;
  };

  const getFilteredData = (range) => {
    return timeData.slice(range[0], range[1] + 1);
  };

  const revenueData = {
    xAxis: [
      {
        id: "hours",
        data: getFilteredData(revenueRange).map((d) => d.hour),
        scaleType: "band",
      },
    ],
    series: [
      {
        data: getFilteredData(revenueRange).map((d) => d.revenue),
        curve: "linear",
        color: "#6B46C1",
        highlightScope: {
          highlighted: "none",
          faded: "global",
        },
      },
    ],
  };

  const handleRevenueRangeChange = (event, newValue) => {
    setRevenueRange(newValue);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg min-h-[384px] w-full p-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Revenue (Hours {revenueRange[0]} - {revenueRange[1]})
      </h2>
      <Box sx={{width: "100%", mb: 4}}>
        {loading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={250}
            animation="wave"
            sx={{animationDuration: "0.8s"}}
          />
        ) : (
          <LineChart
            xAxis={revenueData.xAxis}
            series={revenueData.series}
            height={250}
            margin={{top: 20, right: 20, bottom: 30, left: 40}}
            sx={{
              ".MuiLineElement-root": {
                strokeWidth: 2,
              },
            }}
          />
        )}
      </Box>
      <Box sx={{width: "100%", px: 2}}>
        <Slider
          value={revenueRange}
          onChange={handleRevenueRangeChange}
          valueLabelDisplay="auto"
          step={1}
          marks={generateMarks()}
          min={0}
          max={currentHour || 1}
          sx={{
            bottom: 20,
            height: 3,
            "& .MuiSlider-thumb": {
              height: 12,
              width: 12,
            },
          }}
        />
      </Box>
    </div>
  );
}

export default RevenueChart;