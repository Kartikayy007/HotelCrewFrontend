import React, {useState, useEffect} from "react";
import {
  Box,
  Skeleton,
  Dialog,
  DialogContent,
} from "@mui/material";
import {LineChart} from "@mui/x-charts";
import {BarChart} from "@mui/x-charts/BarChart";
import {TrendingUp, TrendingDown, Menu, X} from "lucide-react";
import AdminAttendanceList from "./analysis/AdminAttendanceList";
import {useSelector, useDispatch} from "react-redux";
import {selectStaffList} from "../../../redux/slices/StaffSlice";
import {fetchWeeklyAttendance} from "../../../redux/slices/AdminAttendanceSlice";
import StaffMetrics from "../../common/StaffMetrics";
import {fetchRevenueStats, selectRoomStats} from "../../../redux/slices/revenueSlice";
import DepartmentPerformance from "./analysis/DepartmentPerformance";

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

const AdminAnalytics = () => {
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
  } = useSelector((state) => state.revenue);
  const { daily_checkins, daily_checkouts } = useSelector(selectRoomStats);

  // Derived values
  const totalStaff = staffList.length - 1;
  const todaysRevenue = dailyRevenues[dailyRevenues.length - 1] || 1292;
  const todaysCheckIns = roomStats?.daily_checkins[roomStats.daily_checkins.length - 1] || 423;
  const todaysCheckOuts = roomStats?.daily_checkouts[roomStats.daily_checkouts.length - 1] || 42;

  const animatedRevenue = useCountAnimation(loading ? 0 : todaysRevenue);
  const animatedCheckIns = useCountAnimation(loading ? 0 : todaysCheckIns);
  const animatedCheckOuts = useCountAnimation(loading ? 0 : todaysCheckOuts);
  const animatedStaff = useCountAnimation(loading ? 0 : totalStaff);

  // Check-ins Data
  const checkinsData = {
    data: roomStats?.daily_checkins || [], 
    labels: roomStats?.dates || []
  };

   ('Check-ins data:', checkinsData);
   ('Revenue data:', dailyRevenues);

  useEffect(() => {
    dispatch(fetchWeeklyAttendance());
    dispatch(fetchRevenueStats());


    const intervalId = setInterval(() => {
      dispatch(fetchWeeklyAttendance());
      dispatch(fetchRevenueStats());
    }, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
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
    const day = date.toLocaleDateString("en-US", {weekday: "short"});
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

  // Handlers
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
      array[array.length - 2] || 0, // previous day
      array[array.length - 1] || 0  // current day
    ];
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        Analytics
      </h1>

      <div>
        <div className="flex flex-wrap -mx-2 p-3 sm:p-4">
          <section className="w-full sm:w-1/2 xl:w-1/4 px-2 mb-4">
            <div className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 delay-1000 hover:scale-105">
              <h3 className="text-lg font-semibold">Total Staff</h3>
              <p className="text-3xl font-semibold">{animatedStaff}</p>
            </div>
          </section>

          <section className="w-full sm:w-1/2 xl:w-1/4 px-2 mb-4">
            <div className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 delay-1000 hover:scale-105">
              <h3 className="text-lg font-semibold">Today's Revenue</h3>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-semibold">${animatedRevenue.toLocaleString()}</p>
                {todaysRevenue > (getLastTwoValues(dailyRevenues)[0] || 0) ? (
                  <TrendingUp className="text-green-500" size={24} />
                ) : (
                  <TrendingDown className="text-red-500" size={24} />
                )}
              </div>
            </div>
          </section>

          <section className="w-full sm:w-1/2 xl:w-1/4 px-2 mb-4">
            <div className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 delay-1000 hover:scale-105">
              <h3 className="text-lg font-semibold">Today's Check-Ins</h3>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-semibold">{animatedCheckIns}</p>
                {todaysCheckIns > (getLastTwoValues(daily_checkins)[0] || 0) ? (
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
                <p className="text-3xl font-semibold">{animatedCheckOuts}</p>
                {todaysCheckOuts > (getLastTwoValues(daily_checkouts)[0] || 0) ? (
                  <TrendingUp className="text-green-500" size={24} />
                ) : (
                  <TrendingDown className="text-red-500" size={24} />
                )}
              </div>
            </div>
          </section>
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
                  <Box sx={{width: "100%", height: "90%", mt: -4}}>
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
                        xAxis={[{data: weeklyStats.dates, scaleType: "band"}]}
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
                <section className="bg-white rounded-lg shadow-lg p-4 h-80">
                  <div className="h-80">
                    <h3 className="text-lg font-semibold">Check-In Data</h3>
                    <div className="h-64 w-full flex justify-center items-center">
                      <LineChart
                        height={220}
                        series={[{
                          data: checkinsData.data.length > 0 
                            ? checkinsData.data 
                            : [0], 
                          color: "#3331D1",
                          curve: "natural",
                          area: true,
                        }]}
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
                      margin={{ top: 15, right: 20, bottom: 40, left: 40 }}
                    />
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
                      margin={{top: 20, right: 40, bottom: 20, left: 60}}
                    />
                  )}
                </div>
              </section>

              <section className="bg-white rounded-lg shadow-lg p-4">
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
  );
};

export default AdminAnalytics;