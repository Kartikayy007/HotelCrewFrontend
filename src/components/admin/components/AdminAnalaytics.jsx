import React, { useState, useEffect } from 'react';
import {
  Box,
  Skeleton,
  Dialog,
  DialogContent,
  Select,
  MenuItem,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";
import { TrendingUp, TrendingDown, Menu, X } from "lucide-react";
import AdminAttendanceList from "./analysis/AdminAttendanceList";
import { useSelector, useDispatch } from "react-redux";
import {
  selectStaffList,
  selectTotalStaff,
  fetchStaffData,
  fetchStaffStatus
} from '../../../redux/slices/StaffSlice';
import {
  fetchWeeklyAttendance,
  fetchAttendanceStats
} from '../../../redux/slices/AdminAttendanceSlice';
import {
  fetchRevenueStats,
  selectRoomStats
} from '../../../redux/slices/revenueSlice';
import { fetchRoomStats } from '../../../redux/slices/OcupancyRateSlice';
import StaffMetrics from "../../common/StaffMetrics";
import DepartmentPerformance from "./analysis/DepartmentPerformance";
import { FiUsers, FiCreditCard, FiLogIn, FiLogOut } from 'react-icons/fi';

const useCountAnimation = (end, duration = 500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

const StatsCard = ({ title, value, Icon, trend, previousValue, suffix = '', showTrend = true }) => {
  const getGradient = () => {
    if (title === "Total Staff") return "from-green-400 to-emerald-600";
    if (!showTrend) return "from-rose-500 to-pink-600";
    return trend > (previousValue || 0) 
    ? "from-green-400 to-emerald-600" 
    : "from-rose-500 to-pink-600";
};

  const getTrendIconColor = () => {
    if (trend > (previousValue || 0)) {
      return {
        default: "text-emerald-500",
        hover: "group-hover:text-emerald-50"
      };
    }
    return {
      default: "text-rose-500",
      hover: "group-hover:text-rose-50"
    };
  };

  const iconColors = getTrendIconColor();

  return (
    <section className="w-full sm:w-1/2 xl:w-1/4 px-2 mb-4">
      <div className="relative overflow-hidden group bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300">
        <div className={`absolute inset-0 bg-gradient-to-r ${getGradient()} translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300`} />
        
        <Icon className="absolute z-10 -top-0 -right-1 text-9xl text-slate-100 group-hover:text-white/30 group-hover:rotate-12 transition-transform duration-300" />
        
        <div className="relative z-10">
          <h3 className="text-lg font-semibold group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-semibold group-hover:text-white transition-colors duration-300">
              {suffix}{value}
            </p>
            {showTrend && trend > (previousValue || 0) ? (
              <TrendingUp className={`${iconColors.default} ${iconColors.hover} transition-colors duration-300`} size={24} />
            ) : showTrend && (
              <TrendingDown className={`${iconColors.default} ${iconColors.hover} transition-colors duration-300`} size={24} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// First, create LoadingState component
const LoadingState = () => (
  <div className="bg-[#E6EEF9] min-h-screen p-4">
    <Skeleton variant="text" width={200} height={40} className="ml-12 mb-4" /> {/* Analytics heading */}
    
    {/* Stats Cards Skeleton */}
    <div className="flex flex-wrap -mx-2 p-3 sm:p-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="w-full sm:w-1/2 xl:w-1/4 px-2 mb-4">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <Skeleton variant="text" width={120} height={24} className="mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton variant="text" width={80} height={40} />
              <Skeleton variant="circular" width={24} height={24} />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      <div className="lg:col-span-2 space-y-4">
        {/* Attendance Chart Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-4 h-96">
          <div className="flex justify-between mb-4">
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton variant="text" width={40} height={24} />
          </div>
          <Skeleton variant="rectangular" height={300} />
        </div>

        {/* Staff Metrics Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <Skeleton variant="text" width={200} height={24} className="mb-2" />
          <Skeleton variant="text" width={150} height={20} className="mb-4" />
          <Skeleton variant="rectangular" height={250} />
        </div>

        {/* Guest Movement Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Skeleton variant="text" width={180} height={24} />
              <Skeleton variant="text" width={120} height={20} />
            </div>
            <Skeleton variant="rectangular" width={120} height={40} />
          </div>
          <Skeleton variant="rectangular" height={220} />
        </div>
      </div>

      <div className="space-y-4">
        {/* Revenue Chart Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-4 h-96">
          <Skeleton variant="text" width={150} height={24} className="mb-4" />
          <Skeleton variant="rectangular" height={300} />
        </div>

        {/* Department Performance Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-4 min-h-[54.5rem]">
          <Skeleton variant="text" width={200} height={24} className="mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <Skeleton variant="text" width={150} height={20} />
                  <Skeleton variant="text" width={60} height={20} />
                </div>
                <Skeleton variant="rectangular" height={8} className="mb-2" />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="text-center">
                      <Skeleton variant="text" width={40} height={24} className="mx-auto" />
                      <Skeleton variant="text" width={60} height={16} className="mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Modify AdminAnalytics.jsx main component
const AdminAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
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
  const [localLoading, setLocalLoading] = useState(true);
  const [selectedDataType, setSelectedDataType] = useState('checkins');

  const dispatch = useDispatch();

  // Selectors
  const staffList = useSelector(selectStaffList);
  const weeklyStats = useSelector((state) => state.attendance.weeklyStats);
  const loading = useSelector((state) => state.attendance.loading);
  const roomStats = useSelector(selectRoomStats);
  const {
    dates,
    dailyRevenues,
    loading: revenueLoading,
    weekRange 
  } = useSelector((state) => state.revenue);
  const { daily_checkins, daily_checkouts } = useSelector(selectRoomStats);

  const totalStaff = useSelector(selectTotalStaff);
  const todaysRevenue = dailyRevenues[dailyRevenues.length - 1] || 0;
  const todaysCheckIns = roomStats?.daily_checkins[roomStats.daily_checkins.length - 1] || 0;
  const todaysCheckOuts = roomStats?.daily_checkouts[roomStats.daily_checkouts.length - 1] || 0;

   ("todays revenue:", todaysRevenue);

  const animatedRevenue = useCountAnimation(loading ? 0 : todaysRevenue);
  const animatedCheckIns = useCountAnimation(loading ? 0 : todaysCheckIns);
  const animatedCheckOuts = useCountAnimation(loading ? 0 : todaysCheckOuts);
  const animatedStaff = useCountAnimation(loading ? 0 : totalStaff);

  // Check-ins Data
  const checkinsData = {
    data: roomStats?.daily_checkins || [],
    labels: roomStats?.dates || []
  };

  const checkoutsData = {
    data: roomStats?.daily_checkouts || [],
    labels: roomStats?.dates || []
  };

  ('Check-ins data:', checkinsData);
  ('Revenue data:', dailyRevenues);

  const isAllDataLoaded = !loading && !revenueLoading && dates?.length > 0;

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          dispatch(fetchStaffData()),
          dispatch(fetchStaffStatus()),
          dispatch(fetchWeeklyAttendance()),
          dispatch(fetchAttendanceStats()),
          dispatch(fetchRevenueStats()),
          dispatch(fetchRoomStats())
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [dispatch]);

  useEffect(() => {
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

    // Set initial time data
    setTimeData(generateTimeData(currentHour));

    const interval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== currentHour) {
        setCurrentHour(newHour);
        setPerformanceRange([0, newHour || 1]);
        setTimeData(generateTimeData(newHour));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentHour]);

  // Utility functions
  const formatDates = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
    });
    return `${day}\n${monthDay}`;
  };

  const hasAttendanceData =
    weeklyStats.dates.length > 0 &&
    weeklyStats.total_crew_present.length > 0 &&
    weeklyStats.total_staff_absent.length > 0;

  const handlePerformanceRangeChange = (event, newValue) => {
    setPerformanceRange(newValue);
  };

  const handleChartClick = () => {
    setOpenDialog(true);
  };

  const handleSectionDoubleClick = () => {
    setDialogOpen(true);
  };

  const getLastTwoValues = (array) => {
    if (!array || array.length < 2) return [0, 0];
    return [
      array[array.length - 2] || 0,
      array[array.length - 1] || 0
    ];
  };

  //  (animatedRevenue, animatedCheckIns, animatedCheckOuts, animatedStaff);

  return (
    <div className="bg-[#E6EEF9] h-full w-full overflow-auto p-2 sm:p-4">
      {isLoading ? (
        <LoadingState />
      ) : (
        <section className="bg-[#E6EEF9] h-full w-full overflow-auto p-2 sm:p-4">
          <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12</div>">
            Analytics
          </h1>

          <div>
            <div className="flex flex-wrap -mx-2 p-3 sm:p-4">
              <StatsCard 
                title="Total Staff"
                value={loading ? 0 : animatedStaff}
                Icon={FiUsers}
                trend={totalStaff}
                previousValue={0}
                showTrend={false}  
              />
              
              <StatsCard 
                title="Today's Revenue"
                value={animatedRevenue.toLocaleString()}
                Icon={FiCreditCard}
                trend={todaysRevenue}
                previousValue={getLastTwoValues(dailyRevenues)[0]}
                suffix="₹"
              />
              
              <StatsCard 
                title="Today's Check-Ins"
                value={animatedCheckIns}
                Icon={FiLogIn}
                trend={todaysCheckIns}
                previousValue={getLastTwoValues(daily_checkins)[0]}
              />
              
              <StatsCard 
                title="Today's Check-Outs"
                value={animatedCheckOuts}
                Icon={FiLogOut}
                trend={todaysCheckOuts}
                
                previousValue={getLastTwoValues(daily_checkouts)[0]}
              />
            </div>

            {showAnalytics ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                <div className="lg:col-span-2 space-y-4">
                  <section
                    className="bg-white rounded-lg shadow-lg p-4 h-96"
                    onDoubleClick={() => setOpenDialog(true)}
                  >
                    <div className="h-96">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Attendance</h3>
                        <button
                          onClick={() => setShowAnalytics(false)}
                          className="text-gray-500 hover:text-gray-700 px-2 focus:outline-none text-4xl font-semibold h-12 z-10"
                        >
                          ⋯
                        </button>
                      </div>
                      <Box sx={{ width: "100%", height: "90%", mt: -4 }}>
                        {loading || !hasAttendanceData ? (
                          <div className="space-y-4 pt-8">
                            <Skeleton
                              variant="rectangular"
                              height={250}
                              animation="wave"
                            />
                            <div className="flex justify-between px-4">
                              <Skeleton variant="text" width={100} />
                              <Skeleton variant="text" width={100} />
                            </div>
                          </div>
                        ) : (
                          <BarChart
                            height={330}
                            series={[
                              {
                                data: weeklyStats.total_crew_present,
                                id: "present",
                                color: "#3331D1",
                              },
                              {
                                data: weeklyStats.total_staff_absent,
                                id: "absent",
                                color: "#151542",
                              },
                            ]}
                            borderRadius={5}
                            xAxis={[{
                              data: weeklyStats.dates,
                              scaleType: "band",
                              tickLabelStyle: {
                                angle: 0,
                                textAnchor: "middle",
                                fontSize: 12
                              }
                            }]}
                            margin={{ top: 40, right: 20, bottom: 30, left: 40 }}
                            sx={{
                              "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                                transform: "translateY(5px)"
                              }
                            }}
                          />
                        )}
                      </Box>
                    </div>

                    <Dialog
                      open={openDialog}
                      onClose={() => setOpenDialog(false)}
                      maxWidth="md"
                      fullWidth
                      PaperProps={{
                        style: {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                          height: "87vh",
                        },
                      }}
                      BackdropProps={{
                        sx: {
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                          backdropFilter: "blur(5px)",
                        },
                      }}
                    >
                      <DialogContent
                        sx={{
                          padding: 1,
                          "&:first-of-type": {
                            paddingTop: 0,
                          },
                        }}
                        dividers={false}
                      >
                        <AdminAttendanceList
                          onBack={() => setOpenDialog(false)}
                          dateRange={dateRange}
                        />
                      </DialogContent>
                    </Dialog>
                  </section>

                  <section
                    className="space-y-6 md:space-y-4"
                    onDoubleClick={handleSectionDoubleClick}
                  >
                    <StaffMetrics />
                    <section className="bg-white rounded-lg shadow-lg p-4 h-[40.5vh]">
                      <div className="h-96">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">Guest Movement Data</h3>
                            {weekRange && !isLoading && (
                              <p className="text-sm text-gray-600">Week of: {weekRange}</p>
                            )}
                          </div>
                          <Select
                            value={selectedDataType}
                            onChange={(e) => setSelectedDataType(e.target.value)}
                            size="small"
                            sx={{ minWidth: 120 }}
                            disabled={isLoading}
                          >
                            <MenuItem value="checkins">Check-ins</MenuItem>
                            <MenuItem value="checkouts">Check-outs</MenuItem>
                          </Select>
                        </div>
                        <div className="h-64 w-full flex justify-center items-center">
                          {!isAllDataLoaded ? (
                            <Skeleton variant="rectangular" width="100%" height={220} animation="wave" />
                          ) : (
                            <Box sx={{ width: "100%", mb: 0, mt: 0 }}>  
                            <LineChart
                            height={300}
                            margin={{ top: 5, right: 20, bottom: 40, left: 40 }}
                              series={[{
                                data: selectedDataType === 'checkins' 
                                  ? checkinsData.data
                                  : checkoutsData.data,
                                color: selectedDataType === 'checkins' ? "#3331D1" : "#0B8FD9",
                                area: true,
                                curve: "linear",
                              }]}
                              xAxis={[{
                                data: dates.map(formatDates),
                                scaleType: "band",
                                tickLabelStyle: {
                                  angle: 0,
                                  textAnchor: "middle"
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
                          </Box>
                          )}
                        </div>
                      </div>
                    </section>
                  </section>
                </div>

                <div className="space-y-4">
                  <section className="flex-1">
                    <div
                      className="bg-white rounded-lg shadow-lg p-4 h-96"
                      onDoubleClick={() => setRevenueDialogOpen(true)}
                    >
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Total Revenue</h3>
                      </div>

                      {revenueLoading ? (
                        <div className="h-[300px] w-full">
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={300}
                            animation="wave"
                          />
                        </div>
                      ) : (
                        <LineChart
                          series={[
                            {
                              data: dailyRevenues,
                              color: "#0B8FD9",
                              area: true,
                              curve: "linear",
                            },
                          ]}
                          xAxis={[
                            {
                              data: dates.map(formatDates),
                              scaleType: "band",
                              tickLabelStyle: {
                                angle: 0,
                                textAnchor: "start",
                                fontSize: 12,
                              },
                            },
                          ]}
                          sx={{
                            ".MuiLineElement-root": {
                              strokeWidth: 2,
                            },
                            ".MuiAreaElement-root": {
                              fillOpacity: 0.1,
                            },
                          }}
                          height={300}
                          margin={{ top: 20, right: 40, bottom: 20, left: 60 }}
                        />
                      )}
                    </div>
                  </section>

                  <section className="bg-white min-h-[54.5rem] rounded-lg shadow-lg p-4">
                    <h3 className="text-lg font-semibold">
                      Department Performance
                    </h3>
                    <DepartmentPerformance />
                  </section>
                </div>
              </div>
            ) : (
              <AdminAttendanceList
                onBack={() => setShowAnalytics(true)}
                dateRange={dateRange}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminAnalytics;