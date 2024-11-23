import React, {useState, useEffect} from "react";
import {
  Box,
  Skeleton,
  Slider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import {LineChart} from "@mui/x-charts";
import {BarChart} from "@mui/x-charts/BarChart";
import {Radar} from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import {TrendingUp, TrendingDown, Menu, X} from "lucide-react";
import AdminAttendanceList from "./analysis/AdminAttendanceList";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  ChartLegend
);

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [performanceRange, setPerformanceRange] = useState([
    0,
    currentHour || 1,
  ]);
  const [timeData, setTimeData] = useState([]);
  const [dateRange, setDateRange] = useState([1, new Date().getDate()]);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [openDialog, setOpenDialog] = useState(false);
  const [revenueDialogOpen, setRevenueDialogOpen] = useState(false);
  const [dialogTimeRange, setDialogTimeRange] = useState("week");
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const generateAttendanceData = () => {
    const data = {
      dates: [],
      present: [],
      absent: [],
    };

    const today = new Date();
    const currentDay = today.getDay();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
        backgroundColor: "#0B8FD980",
        borderColor: "#0B8FD9",
        pointBackgroundColor: "#0B8FD9",
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

  const handleChartClick = () => {
    setOpenDialog(true);
  };

  const handleSectionDoubleClick = () => {
    setDialogOpen(true);
  };

  const skeletonProps = {
    animation: "wave",
    variant: "rectangular",
    width: "100%",
    height: 250,
  };

  const StaffMetricsDialog = () => (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      maxWidth="lg"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <DialogTitle>
        Staff Metrics (Hours {performanceRange[0]} - {performanceRange[1]})
      </DialogTitle>
      <DialogContent>
        <Box sx={{width: "100%", mb: 4}}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={400}
              {...skeletonProps}
            />
          ) : (
            <LineChart
              xAxis={performanceData.xAxis}
              series={performanceData.series}
              height={400}
              margin={{top: 10, right: 20, bottom: 30, left: 40}}
            />
          )}
        </Box>
        <Box sx={{width: "100%", px: 5}}>
          <Slider
            value={performanceRange}
            onChange={handlePerformanceRangeChange}
            valueLabelDisplay="auto"
            step={1}
            marks={marks}
            min={0}
            max={currentHour || 1}
            sx={{mt: -2}}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        Analytics
      </h1>

      <div>
        {/* Metrics Section */}
        <div className="flex flex-wrap -mx-2 p-3 sm:p-4">
          <section className="w-full sm:w-1/2 xl:w-1/4 px-2 mb-4">
            <div className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 delay-1000 hover:scale-105">
              <h3 className="text-lg font-semibold">Total Staff</h3>
              <p className="text-3xl font-semibold">136</p>
            </div>
          </section>

          <section className="w-full sm:w-1/2 xl:w-1/4 px-2 mb-4">
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
          </section>

          <section className="w-full sm:w-1/2 xl:w-1/4 px-2 mb-4">
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
          </section>

          <section className="w-full sm:w-1/2 xl:w-1/4 px-2 mb-4">
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
          </section>
        </div>

        {/* Charts and Analytics Section */}
        {showAnalytics ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Attendance Chart */}
              <section
                className="bg-white rounded-lg shadow-lg p-4 h-96"
                onDoubleClick={() => setOpenDialog(true)}
              >
                <div className=" h-96">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Attendance</h3>
                    <button
                      onClick={() => setShowAnalytics(false)}
                      className="text-gray-500 hover:text-gray-700 px-2 focus:outline-none text-4xl font-semibold h-12 z-10"
                    >
                      ⋯
                    </button>
                  </div>
                  {/* Original chart content */}
                  <Box sx={{width: "100%", height: "90%", mt: -7}}>
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
                      xAxis={[{data: filteredData.dates, scaleType: "band"}]}
                    />
                  </Box>
                </div>

                {/* Enhanced Dialog with Tabs */}
                <Dialog
                  open={openDialog}
                  onClose={() => setOpenDialog(false)}
                  maxWidth="lg"
                  fullWidth
                  PaperProps={{
                    style: {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      height: "80vh",
                    },
                  }}
                  BackdropProps={{
                    sx: {
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(5px)",
                    },
                  }}
                >
                  <DialogContent>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">Attendance</h3>
                    </div>

                    <Tabs
                      value={activeTab}
                      onChange={(_, newValue) => setActiveTab(newValue)}
                      sx={{borderBottom: 1, borderColor: "divider", mb: 2}}
                    >
                      <Tab label="Graph" />
                      <Tab label="Attendance List" />
                    </Tabs>

                    {activeTab === 0 && (
                      <Box sx={{width: "100%", height: "500px"}}>
                        <BarChart
                          height={450}
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
                          xAxis={[
                            {data: filteredData.dates, scaleType: "band"},
                          ]}
                        />
                        <Box sx={{width: "100%", px: 5, mt: 2}}>
                          <Slider
                            value={dateRange}
                            onChange={(_, newValue) => setDateRange(newValue)}
                            valueLabelDisplay="auto"
                            min={1}
                            max={maxDays}
                            marks={[
                              {value: 1, label: "1"},
                              {value: maxDays, label: maxDays.toString()},
                            ]}
                          />
                        </Box>
                      </Box>
                    )}

                    {activeTab === 1 && (
                      <AdminAttendanceList
                        onBack={() => setOpenDialog(false)}
                        dateRange={dateRange}
                        attendanceData={filteredData}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </section>

              <section
                className="h-96"
                onDoubleClick={handleSectionDoubleClick}
              >
                <div className="bg-white rounded-lg shadow-lg p-4 h-96">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    Staff Metrics (Hours {performanceRange[0]} -{" "}
                    {performanceRange[1]})
                  </h2>
                  <Box sx={{width: "100%", mb: 4}}>
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
                        margin={{top: 10, right: 20, bottom: 30, left: 40}}
                      />
                    )}
                  </Box>
                  <Box sx={{width: "100%", px: 5}}>
                    <Slider
                      value={performanceRange}
                      onChange={handlePerformanceRangeChange}
                      valueLabelDisplay="auto"
                      step={1}
                      marks={marks}
                      min={0}
                      max={currentHour || 1}
                      sx={{mt: -2}}
                    />
                  </Box>
                </div>
                <StaffMetricsDialog />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="bg-white rounded-lg shadow-lg p-4 h-80">
                  <div className="h-80 ">
                    <h3 className="text-lg font-semibold">Department Load</h3>
                    <div className="h-64 w-full flex justify-center items-center">
                      <Radar
                        data={radarData}
                        options={{
                          plugins: {
                            legend: {display: false},
                          },
                          scales: {
                            r: {
                              min: 0,
                              max: 100,
                              beginAtZero: true,
                              ticks: {
                                stepSize: 25,
                                font: {size: 14},
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
                </section>
                <section className="bg-white rounded-lg shadow-lg p-4 h-80">
                  <div className="h-80">
                    <h3 className="text-lg font-semibold">
                      Departments Performance
                    </h3>
                    <div className="h-64 w-full flex justify-center items-center">
                      <Radar
                        data={radarData}
                        options={{
                          plugins: {
                            legend: {display: false},
                          },
                          scales: {
                            r: {
                              min: 0,
                              max: 100,
                              beginAtZero: true,
                              ticks: {
                                stepSize: 25,
                                font: {size: 14},
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
                </section>
              </div>
            </div>

            <div className="space-y-4">
              {/* Revenue Chart */}
              <section className="h-96">
                <div
                  className="bg-white rounded-lg shadow-lg p-4 h-96"
                  onDoubleClick={() => setRevenueDialogOpen(true)}
                >
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">Total Revenue</h3>
                  </div>

                  <LineChart
                    series={[
                      {
                        data: [65, 59, 80, 81, 56, 55, 40],
                        color: "#0B8FD9",
                        curve: "natural",
                      },
                    ]}
                    xAxis={[
                      {
                        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                        scaleType: "band",
                      },
                    ]}
                    height={300}
                    margin={{top: 20, right: 20, bottom: 30, left: 40}}
                  />

                  <div
                    className={`flex items-center gap-2 ${
                      30 > 25 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {30 > 25 ? (
                      <TrendingUp size={20} />
                    ) : (
                      <TrendingDown size={20} />
                    )}
                    <span className="font-medium">
                      {30 > 25 ? "+5%" : "-5%"} from last week
                    </span>
                  </div>
                </div>
                <Dialog
                  open={revenueDialogOpen}
                  onClose={() => setRevenueDialogOpen(false)}
                  maxWidth="md"
                  fullWidth
                  BackdropProps={{
                    sx: {
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(5px)",
                    },
                  }}
                >
                  <DialogTitle>Total Revenue Details</DialogTitle>
                  <DialogContent>
                    <div className="flex justify-between items-center mb-4">
                      <select
                        className="border rounded-md px-3 py-1 text-sm bg-gray-50"
                        value={dialogTimeRange}
                        onChange={(e) => setDialogTimeRange(e.target.value)}
                      >
                        <option value="day">Today</option>
                        <option value="week">This Week</option>
                      </select>
                    </div>

                    <LineChart
                      series={[
                        {
                          data: [65, 59, 80, 81, 56, 55, 40],
                          color: "#0B8FD9",
                          curve: "natural",
                        },
                      ]}
                      xAxis={[
                        {
                          data: [
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                          ],
                          scaleType: "band",
                        },
                      ]}
                      height={300}
                      margin={{top: 20, right: 20, bottom: 30, left: 40}}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setRevenueDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </section>

              <section className="bg-white rounded-lg shadow-lg p-4 h-[45rem]">
                <h3 className="text-lg font-semibold">
                  Monthly Revenue Analysis
                </h3>
                <div className="h-48 w-full mt-6">
                  <LineChart
                    height={400}
                    series={[
                      {
                        data: [
                          42000, 48000, 55000, 58000, 62000, 68000, 72000,
                          75000, 71000, 68000, 65000, 70000,
                        ],
                        label: "2024",
                        color: "#2563eb",
                        showMark: true,
                      },
                      {
                        data: [
                          38000, 42000, 48000, 50000, 54000, 59000, 65000,
                          68000, 64000, 60000, 58000, 63000,
                        ],
                        label: "2023",
                        color: "#94a3b8",
                        showMark: false,
                        style: {
                          strokeDasharray: "5 5",
                        },
                      },
                    ]}
                    xAxis={[
                      {
                        data: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                        scaleType: "band",
                      },
                    ]}
                    yAxis={[
                      {
                        label: "Revenue ($)",
                      },
                    ]}
                    sx={{
                      ".MuiLineElement-root": {
                        strokeWidth: 2,
                      },
                      ".MuiMarkElement-root": {
                        stroke: "#fff",
                        scale: "1.2",
                      },
                    }}
                    margin={{top: 20, right: 20, bottom: 30, left: 70}}
                  />
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span>Current Year</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span>Previous Year</span>
                  </div>
                </div>
              </section>
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
