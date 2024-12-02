import React, {useState, useEffect, useMemo} from "react";
import {PieChart} from "@mui/x-charts/PieChart";
import {LineChart} from "@mui/x-charts/LineChart";
import {BarChart} from "@mui/x-charts/BarChart";
import Box from "@mui/material/Box";
import {
  Dialog,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Slider,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchAttendanceStats,
  selectWeeklyStats,
} from "../../../redux/slices/AdminAttendanceSlice";
import {FaChevronUp, FaChevronDown} from "react-icons/fa";
import {
  createTask,
  selectTasksLoading,
  selectTasksError,
  selectAllTasks,
} from "../../../redux/slices/TaskSlice";
import AdminTaskAssignment from "./AdminTaskAssignment";
import {CreateAnnouncementBox} from "../../common/CreateAnnouncementBox";
import {
  createAnnouncement,
  fetchAnnouncements,
  selectAllAnnouncements,
  selectAnnouncementsLoading,
  selectAnnouncementsError,
  deleteAnnouncement,
} from "../../../redux/slices/AnnouncementSlice";
import {
  fetchStaffData,
  selectStaffPerDepartment,
  selectStaffLoading,
  selectDepartments,
  fetchStaffStatus,
  selectStaffStatus,
} from "../../../redux/slices/AdminStaffSlice";
import StaffMetrics from "../../common/StaffMetrics";
import LoadingAnimation from "../../common/LoadingAnimation";
import {fetchTasks} from "../../../redux/slices/TaskSlice";
import {
  fetchHotelDetails,
  selectTotalRooms,
} from "../../../redux/slices/HotelDetailsSlice";
import {MoreVertical} from "lucide-react";
import {AllAnnouncementsDialog} from "../../common/AllAnnouncementsDialog";
import {
  selectLatestRevenue,
  fetchRevenueStats,
  selectRoomStats,
} from "../../../redux/slices/revenueSlice";
import {
  fetchRoomStats,
  selectOccupiedRooms,
  selectAvailableRooms,
} from "../../../redux/slices/OcupancyRateSlice";
import {fetchWeeklyAttendance} from "../../../redux/slices/AdminAttendanceSlice";

function AdminDashboard() {
  const dispatch = useDispatch();
  const attendanceStats = useSelector((state) => state.attendance.stats);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const Taskloading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);

  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [performanceRange, setPerformanceRange] = useState([
    0,
    currentHour || 1,
  ]);
  const [revenueRange, setRevenueRange] = useState([0, currentHour]);
  const [timeData, setTimeData] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selected, setSelected] = useState({
    label: "Department",
    value: "",
  });

  const latestRevenue = useSelector(selectLatestRevenue);
  const revenueLoading = useSelector((state) => state.revenue.loading);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [showDoubleClickTip, setShowDoubleClickTip] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsInitialLoading(true);

        await Promise.all([
          dispatch(fetchAttendanceStats()),
          dispatch(fetchStaffData()),
          dispatch(fetchTasks()),
          dispatch(fetchHotelDetails()),
          dispatch(fetchRevenueStats()),
          dispatch(fetchRoomStats()),
          dispatch(fetchStaffStatus()),
          dispatch(fetchWeeklyAttendance()),
          dispatch(fetchAnnouncements()),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load dashboard data",
          severity: "error",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchAllData();

    // Set up intervals for periodic updates
    const revenueInterval = setInterval(() => {
      dispatch(fetchRevenueStats());
    }, 3600000);

    const roomStatsInterval = setInterval(() => {
      dispatch(fetchRoomStats());
    }, 30 * 60 * 1000);

    return () => {
      clearInterval(revenueInterval);
      clearInterval(roomStatsInterval);
    };
  }, [dispatch]);

  console.log(latestRevenue);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", 
  });

  const departments = useSelector(selectDepartments);
  const availableRooms = useSelector(selectAvailableRooms);
  const occupiedRooms = useSelector(selectOccupiedRooms);

  const handleSelect = (dept) => {
    setSelected(dept);
    setIsDropdownOpen(false);
  };

  const skeletonProps = {
    animation: "wave",
    sx: {
      animationDuration: "0.8s",
    },
  };

  const [cumulativeRevenue, setCumulativeRevenue] = useState(0);

  const STORAGE_KEY = "hourlyRevenueData";
  const HOURS_IN_DAY = 24;

  const [hourlyRevenues, setHourlyRevenues] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = new Array(HOURS_IN_DAY).fill(0);
    if (stored) {
      return JSON.parse(stored);
    }
    const currentHour = new Date().getHours();
    if (latestRevenue) {
      initial[currentHour] = parseFloat(latestRevenue) - cumulativeRevenue;
    }
    return initial;
  });

  useEffect(() => {
    if (latestRevenue) {
      const currentHour = new Date().getHours();
      setHourlyRevenues((prev) => {
        const updated = [...prev];
        updated[currentHour] = parseFloat(latestRevenue) - cumulativeRevenue;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  useEffect(() => {
    const midnightClear = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        localStorage.removeItem(STORAGE_KEY);
        setHourlyRevenues(new Array(HOURS_IN_DAY).fill(0));
        setCumulativeRevenue(0);
      }
    }, 60000);

    const revenueUpdate = setInterval(() => {
      const newHour = new Date().getHours();

      if (newHour !== currentHour) {
        if (latestRevenue) {
          const newRevenue = parseFloat(latestRevenue);
          setHourlyRevenues((prev) => {
            const updated = [...prev];
            updated[currentHour] = newRevenue - cumulativeRevenue;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
          setCumulativeRevenue(newRevenue);
        }

        setCurrentHour(newHour);
        setPerformanceRange([0, newHour || 1]);
        setRevenueRange([0, newHour || 1]);
        dispatch(fetchRevenueStats());
        setTimeData(generateTimeData());
      }
    }, 60000);

    setTimeData(generateTimeData());
    setLoading(false);

    return () => {
      clearInterval(revenueUpdate);
      clearInterval(midnightClear);
    };
  }, [currentHour, latestRevenue, cumulativeRevenue]);

  const generateTimeData = () => {
    const timeData = [];
    for (let i = 0; i <= currentHour; i++) {
      timeData.push({
        hour: `${i}:00`,
        revenue: hourlyRevenues[i],
        cumulative:
          i === 0
            ? hourlyRevenues[0]
            : timeData[i - 1].cumulative + hourlyRevenues[i],
      });
    }
    return timeData;
  };

  const getFilteredRevenueData = () => {
    return timeData.slice(revenueRange[0], revenueRange[1] + 1);
  };

  const occupancyData = [
    {
      id: 0,
      value: occupiedRooms,
      label: "Occupied",
      color: "#252941",
    },
    {
      id: 1,
      value: availableRooms,
      label: "Vacant",
      color: "#8094D4",
    },
  ];

  const tasks = useSelector(selectAllTasks);
  const staffPerDepartment = useSelector(state => state.staff?.staffPerDepartment) || {};

  const totalStaff = useMemo(() => {
    if (!staffPerDepartment || typeof staffPerDepartment !== 'object') {
      return 0;
    }
    
    return Object.values(staffPerDepartment).reduce(
      (sum, count) => sum + (Number(count) || 0),
      0
    );
  }, [staffPerDepartment]);

  console.log("Total staff count:", totalStaff);

  const inProgressCount = Array.isArray(tasks)
    ? tasks.filter((task) => task.status.toLowerCase() === "in_progress").length
    : 0;
  const pendingCount = Array.isArray(tasks)
    ? tasks.filter((task) => task.status.toLowerCase() === "pending").length
    : 0;
  const busyStaffCount = inProgressCount + pendingCount;
  const vacantStaffCount = Math.max(0, totalStaff - busyStaffCount);

  const staffStatus = useSelector(selectStaffStatus);

  const staffStatusData = [
    {
      id: 0,
      value: staffStatus.busy,
      label: `Busy (${staffStatus.busy})`,
      color: "#252941"
    },
    {
      id: 1,
      value: staffStatus.available,
      label: `Available (${staffStatus.available})`,
      color: "#8094D4"
    }
  ];

  const detailedStaffStatus = [
    {id: 0, value: inProgressCount, label: "In Progress", color: "#252941"},
    {id: 1, value: pendingCount, label: "Pending", color: "#6B46C1"},
    {id: 2, value: vacantStaffCount, label: "Vacant", color: "#8094D4"},
  ];

  const weeklyStats = useSelector(selectWeeklyStats);

  const getTodayStats = () => {
    if (
      !weeklyStats.dates ||
      !weeklyStats.total_crew_present ||
      !weeklyStats.total_staff_absent
    ) {
      return {present: 0, absent: 0};
    }

    const today = new Date().toISOString().split("T")[0];
    const todayIndex = weeklyStats.dates.findIndex((date) => date === today);

    if (todayIndex === -1) {
      return {present: 0, absent: 0};
    }

    return {
      present: weeklyStats.total_crew_present[todayIndex] || 0,
      absent: weeklyStats.total_staff_absent[todayIndex] || 0,
    };
  };

  const todayStats = getTodayStats();
  const staffAttendance = [
    {
      id: 0,
      value: todayStats.present,
      label: "Present",
      color: "#8094D4",
    },
    {
      id: 1,
      value: todayStats.absent,
      label: "Absent",
      color: "#252941",
    },
  ];

  const staffLoading = useSelector(selectStaffLoading);

  const departmentData = {
    xAxis: [
      {
        id: "departments",
        data: Object.keys(staffPerDepartment).map(
          (dept) =>
            dept.charAt(0).toUpperCase() +
            dept.slice(1, 6) +
            (dept.length > 6 ? "..." : "")
        ),
        scaleType: "band",
        labelStyle: {
          fontSize: 10,
          angle: 0,
          textAnchor: "end",
          dominantBaseline: "central",
        },
        tickLabelStyle: {
          angle: 0,
          fontSize: 10,
        },
      },
    ],
    series: [
      {
        type: "bar",
        data: Object.values(staffPerDepartment),
        color: "#4C51BF",
      },
    ],
  };

  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const announcements = useSelector(selectAllAnnouncements);
  const announcementsLoading = useSelector(selectAnnouncementsLoading);
  const announcementsError = useSelector(selectAnnouncementsError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
  });

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewAnnouncement({title: "", description: ""});
  };

  const handleCreateAnnouncement = async (announcementData) => {
    try {
      setLoading(true);
      const enrichedData = {
        ...announcementData,
        created_at: new Date().toISOString(),
      };

      await dispatch(createAnnouncement(enrichedData)).unwrap();
      setShowAnnouncementBox(false);

      await dispatch(fetchAnnouncements());

      setSnackbar({
        open: true,
        message: "Announcement created successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Create announcement error:", error);
      setSnackbar({
        open: true,
        message: error || "Failed to create announcement",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleViewClose = () => {
    setSelectedAnnouncement(null);
  };

  const handleDelete = async () => {
    if (!selectedAnnouncement?.id) {
      setSnackbar({
        open: true,
        message: "Invalid announcement ID",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(deleteAnnouncement(selectedAnnouncement.id)).unwrap();
      handleViewClose();
      setSnackbar({
        open: true,
        message: "Announcement deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({
        open: true,
        message: error?.message || "Failed to delete announcement",
        severity: "error",
      });
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a task title",
        severity: "error",
      });
      return;
    }

    if (!taskDescription.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a task description",
        severity: "error",
      });
      return;
    }

    if (!selected.value) {
      setSnackbar({
        open: true,
        message: "Please select a department",
        severity: "error",
      });
      return;
    }

    try {
      const today = new Date();
      today.setHours(parseInt(selectedHour, 10));
      today.setMinutes(parseInt(selectedMinute, 10));
      today.setSeconds(0);

      const formattedDeadline = today.toISOString();
      await dispatch(
        createTask({
          title: taskTitle.trim(),
          description: taskDescription.trim(),
          department: selected.value,
          deadline: formattedDeadline,
        })
      ).unwrap();

      dispatch(fetchTasks());

      setTaskTitle("");
      setTaskDescription("");
      setSelected({value: "", label: "Department"});
      setSelectedHour("09");
      setSelectedMinute("00");

      setSnackbar({
        open: true,
        message: "Task assigned successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to assign task",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({...snackbar, open: false});
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);

  const handleDotsClose = () => {
    setAnchorEl(null);
  };

  const handleShowTaskAssignment = () => {
    setShowTaskAssignment(true);
    handleDotsClose();
  };

  const [deadline, setDeadline] = useState("");
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const hours = Array.from({length: 24}, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({length: 60}, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const [showAnnouncementBox, setShowAnnouncementBox] = useState(false);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);

  const sortedAnnouncements = useMemo(() => {
    if (!announcements?.length) return [];

    return [...announcements].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : null;
      const dateB = b.created_at ? new Date(a.created_at) : null;

      if (!dateA || isNaN(dateA.getTime())) return 1;
      if (!dateB || isNaN(dateB.getTime())) return -1;

      return dateB - dateA;
    });
  }, [announcements]);

  const formatDataForGraph = () => {
    return revenueData.map((point) => ({
      time: `${point.hour}:${point.minute}`,
      revenue: point.revenue,
    }));
  };

  useEffect(() => {
    const handleTaskMonitorOpen = () => {
      // Check if user has disabled the notification
      const hideNotification = localStorage.getItem('hideTaskMonitorTip');
      
      if (!hideNotification) {
        // Show notification with 30% chance
        if (Math.random() < 0.3) {
          setShowDoubleClickTip(true);
        }
      }
    };
  
    // Show notification when task monitor opens
    if (showTaskAssignment) {
      handleTaskMonitorOpen();
    }
  }, [showTaskAssignment]);
  
  const handleHideNotification = () => {
    localStorage.setItem('hideTaskMonitorTip', 'true');
    setShowDoubleClickTip(false);
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      {isInitialLoading ? (
        <><div className="w-full h-full flex flex-col gap-4 p-4">
          <Skeleton variant="rectangular" height={60} />
          <div className="flex flex-col xl:flex-row gap-4"></div>
          <div className="flex-1">
            <Skeleton variant="rectangular" height={320} />
          </div>
          <div className="w-full xl:w-[30%]">
            <Skeleton variant="rectangular" height={320} />
          </div>
        </div><Skeleton variant="rectangular" height={400} /></>
      ) : (
        <>
          <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
            {greeting}
          </h1>
          <div className="flex flex-col xl:flex-row  justify-around">
            <div className="flex flex-col space-y-6 w-full xl:w-4/6">
              <div className="bg-white rounded-xl shadow-lg min-h-[320px] w-full p-4">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Hotel Status
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2">
                  {loading ? (
                    <>
                      <Skeleton
                        variant="rectangular"
                        width={250}
                        height={220}
                        {...skeletonProps}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={250}
                        height={220}
                        {...skeletonProps}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={250}
                        height={220}
                        {...skeletonProps}
                      />
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row overflow-hidden flex-1">
                        <div className="flex-1 min-w-[250px] ">
                          <h3 className="font-medium mb-2 text-center">
                            Occupancy Rate
                          </h3>
                          {occupiedRooms === 0 && availableRooms === 0 ? (
                            <div className="flex items-center justify-center h-[180px] text-gray-500">
                              No Occupancy Data Available
                            </div>
                          ) : (
                            <PieChart
                              series={[
                                {
                                  data: occupancyData,
                                  highlightScope: {
                                    fade: "global",
                                    highlight: "item",
                                  },
                                  innerRadius: 45,
                                  paddingAngle: 1,
                                  cornerRadius: 1,
                                },
                              ]}
                              height={220}
                              margin={{top: 0, bottom: 40, left: 0, right: 0}}
                              slotProps={{
                                legend: {
                                  direction: "row",
                                  position: {
                                    vertical: "bottom",
                                    horizontal: "center",
                                  },
                                  padding: 0,
                                  markSize: 10,
                                  itemGap: 15,
                                  labelStyle: {
                                    fontSize: 12,
                                    fontWeight: 500,
                                  },
                                },
                              }}
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-[250px]">
                          <h3 className="font-medium mb-2 text-center">
                            Staff Status
                          </h3>
                          {staffStatus.loading ? (
                            <Skeleton variant="circular" width={220} height={220} />
                          ) : staffStatus.total === 0 ? (
                            <div className="flex items-center justify-center h-[180px] text-gray-500">
                              No Staff Data Available
                            </div>
                          ) : (
                            <PieChart
                              series={[
                                {
                                  data: staffStatusData,
                                  highlightScope: {
                                    fade: "global",
                                    highlight: "item"
                                  },
                                  innerRadius: 45,
                                  paddingAngle: 1,
                                  cornerRadius: 1,
                                }
                              ]}
                              height={220}
                              margin={{top: 0, bottom: 40, left: 0, right: 0}}
                              slotProps={{
                                legend: {
                                  direction: "row",
                                  position: {
                                    vertical: "bottom",
                                    horizontal: "center"
                                  },
                                  padding: 0,
                                  markSize: 10,
                                  itemGap: 15,
                                  labelStyle: {
                                    fontSize: 12,
                                    fontWeight: 500
                                  }
                                }
                              }}
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-[250px]">
                          <h3 className="font-medium mb-2 text-center">
                            Staff Attendance
                          </h3>

                          {attendanceStats.total_present === 0 ? (
                            <div className="flex items-center justify-center h-[180px] text-gray-500">
                              No Data Available
                            </div>
                          ) : (
                            <PieChart
                              series={[
                                {
                                  data: staffAttendance,
                                  highlightScope: {
                                    fade: "global",
                                    highlight: "item",
                                  },
                                  innerRadius: 45,
                                  paddingAngle: 1,
                                  cornerRadius: 1,
                                },
                              ]}
                              height={220}
                              margin={{top: 0, bottom: 40, left: 0, right: 0}}
                              slotProps={{
                                legend: {
                                  direction: "row",
                                  position: {
                                    vertical: "bottom",
                                    horizontal: "center",
                                  },
                                  padding: 0,
                                  markSize: 10,
                                  itemGap: 10,
                                  labelStyle: {
                                    fontSize: 13,
                                    fontWeight: 500,
                                  },
                                },
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg w-full p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Revenue Overview
                  </h2>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Today's Total Revenue
                    </p>
                    <p className="text-xl font-bold">
                      ₹{latestRevenue || "0.00"}
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
                ) : (
                  <>
                    <LineChart
                      height={300}
                      series={[
                        {
                          data: getFilteredRevenueData().map(
                            (data) => data.revenue
                          ),
                          color: "#4C51BF",
                          area: true,
                          curve: "linear",
                        },
                      ]}
                      xAxis={[
                        {
                          data: getFilteredRevenueData().map(
                            (data) => data.hour
                          ),
                          scaleType: "band",
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
                    />
                    <div className="mt-4 px-4">
                      <Slider
                        value={revenueRange}
                        onChange={(_, newValue) => setRevenueRange(newValue)}
                        valueLabelDisplay="auto"
                        min={0}
                        max={currentHour}
                        marks={[
                          {value: 0, label: "00:00"},
                          {value: currentHour, label: `${currentHour}:00`},
                        ]}
                        sx={{
                          color: "#4C51BF",
                          "& .MuiSlider-thumb": {
                            backgroundColor: "#4C51BF",
                          },
                          "& .MuiSlider-track": {
                            backgroundColor: "#4C51BF",
                          },
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              <StaffMetrics />
            </div>

            <div className="flex flex-col space-y-6 w-full xl:w-[30%] mt-5 xl:mt-0">
              <div className="bg-white rounded-xl shadow-lg min-h-[416px] w-full p-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">
                  Staff Database
                </h2>
                <Box sx={{position: "relative", height: 340}}>
                  {staffLoading ? (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={340}
                      animation="wave"
                      sx={{
                        borderRadius: 2,
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  ) : (
                    <BarChart
                      xAxis={departmentData.xAxis}
                      series={departmentData.series}
                      height={340}
                      margin={{top: 10, right: 10, bottom: 20, left: 40}}
                      sx={{
                        ".MuiBarElement-root:hover": {
                          fill: "#6B46C1",
                        },
                      }}
                      borderRadius={10}
                    />
                  )}
                </Box>
              </div>

              <div className="bg-white rounded-xl shadow-lg w-full p-4 flex flex-col h-[40rem] xl:h-[calc(40vh)] ">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Today's Announcements
                  </h2>
                  <button
                    onClick={() => setShowAllAnnouncements(true)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto mb-4">
                  {announcementsLoading ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="border-b border-gray-200 py-4 last:border-0"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <Skeleton
                              variant="text"
                              width={`${Math.random() * (75 - 55) + 55}%`}
                              height={28}
                              sx={{
                                backgroundColor: "rgba(0,0,0,0.1)",
                                borderRadius: "4px",
                              }}
                            />
                            <Skeleton
                              variant="text"
                              width={100}
                              height={20}
                              sx={{
                                backgroundColor: "rgba(0,0,0,0.1)",
                                borderRadius: "4px",
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Skeleton
                              variant="text"
                              width="100%"
                              height={16}
                              sx={{
                                backgroundColor: "rgba(0,0,0,0.1)",
                                borderRadius: "4px",
                              }}
                            />
                            <Skeleton
                              variant="text"
                              width={`${Math.random() * (80 - 60) + 60}%`}
                              height={16}
                              sx={{
                                backgroundColor: "rgba(0,0,0,0.1)",
                                borderRadius: "4px",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-scroll">
                      {sortedAnnouncements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 px-4">
                          <svg
                            className="w-12 h-12 text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No Announcements
                          </h3>
                          <p className="text-gray-500 text-center">
                            There are no announcements at the moment.
                          </p>
                        </div>
                      ) : (
                        sortedAnnouncements.map((announcement) => (
                          <div
                            key={announcement._id}
                            className="border-b border-gray-200 py-4 last:border-0 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleViewAnnouncement(announcement)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">
                                {announcement.title}
                              </h3>
                              <span className="text-sm text-gray-500">
                                {announcement.created_at &&
                                !isNaN(new Date(announcement.created_at))
                                  ? new Date(
                                      announcement.created_at
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "Date not available"}
                              </span>
                            </div>
                            <p className="text-gray-600">
                              {announcement.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-auto">
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setShowAnnouncementBox(true)}
                    sx={{
                      backgroundColor: "#3A426F",
                      "&:hover": {backgroundColor: "#3A426F"},
                      borderRadius: "12px",
                    }}
                  >
                    Create Announcement
                  </Button>
                </div>

                {showAnnouncementBox && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-2xl mx-4">
                      <CreateAnnouncementBox
                        onClose={() => setShowAnnouncementBox(false)}
                        onSubmit={handleCreateAnnouncement}
                        departments={departments}
                      />
                    </div>
                  </div>
                )}

                <Dialog
                  open={!!selectedAnnouncement}
                  onClose={handleViewClose}
                  maxWidth="sm"
                  fullWidth
                  BackdropProps={{
                    sx: {
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(5px)",
                    },
                  }}
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      View Announcement
                    </h2>
                    <div className="space-y-4">
                      <TextField
                        label="Title"
                        fullWidth
                        value={selectedAnnouncement?.title || ""}
                        InputProps={{readOnly: true}}
                      />
                      <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={selectedAnnouncement?.description || ""}
                        InputProps={{readOnly: true}}
                      />
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Department:</span>{" "}
                          {selectedAnnouncement?.department}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Urgency:</span>{" "}
                          {selectedAnnouncement?.urgency}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Created By:</span>{" "}
                          {selectedAnnouncement?.assigned_by}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Created At:</span>{" "}
                          {selectedAnnouncement?.created_at &&
                            new Date(
                              selectedAnnouncement.created_at
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </p>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Assigned To:</span>
                          <ul className="list-disc pl-5 mt-1">
                            {selectedAnnouncement?.assigned_to?.map(
                              (person, index) => <li key={index}>{person}</li>
                            ) || []}
                          </ul>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          onClick={handleDelete}
                          variant="contained"
                          sx={{
                            backgroundColor: "#dc2626",
                            "&:hover": {backgroundColor: "#b91c1c"},
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={handleViewClose}
                          variant="contained"
                          sx={{
                            backgroundColor: "#3A426F",
                            "&:hover": {backgroundColor: "#3A426F"},
                          }}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </Dialog>
              </div>

              <form
                onSubmit={handleAssign}
                className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow-lg lg:flex-1"
              >
                <div className="flex justify-between items-center mb-2 ">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Assign Task
                  </h2>
                  <IconButton
                    onClick={handleShowTaskAssignment}
                    size="small"
                    className="text-gray-600"
                  >
                    <MoreVertical />
                  </IconButton>
                </div>

                <input
                  type="text"
                  placeholder="Task Title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full focus:border-gray-300 focus:outline-none"
                />
                <div className="flex justify-between gap-4">
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${
                        selected.value ? "text-black" : "text-gray-400"
                      } focus:outline-none flex justify-between items-center`}
                    >
                      {selected.label}
                      {isDropdownOpen ? (
                        <FaChevronUp className="text-gray-600" />
                      ) : (
                        <FaChevronDown className="text-gray-600" />
                      )}
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                        {departments.map((dept) => (
                          <button
                            key={dept.value}
                            type="button"
                            onClick={() => handleSelect(dept)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            {dept.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative w-full mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={selectedHour}
                      onChange={(e) => setSelectedHour(e.target.value)}
                      className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-1/2 focus:outline-none"
                    >
                      {hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}:00
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedMinute}
                      onChange={(e) => setSelectedMinute(e.target.value)}
                      className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-1/2 focus:outline-none"
                    >
                      {minutes.map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Task Description"
                  maxLength={350}
                  className="border border-gray-200 w-full rounded-xl bg-[#e6eef9] p-2 xl:h-full h-72 resize-none mb-2 overflow-y-auto focus:border-gray-300 focus:outline-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={Taskloading}
                    className="h-9 w-full bg-[#3A426F] font-Montserrat font-bold rounded-xl text-white disabled:opacity-50 shadow-xl flex items-center justify-center"
                  >
                    {Taskloading ? (
                      <LoadingAnimation size={24} color="#FFFFFF" />
                    ) : (
                      "Assign"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <Dialog
            open={showTaskAssignment}
            onClose={() => setShowTaskAssignment(false)}
            maxWidth="lg"
            fullWidth
            BackdropProps={{
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(5px)",
              },
            }}
          >
            <AdminTaskAssignment onClose={() => setShowTaskAssignment(false)} />
            {showDoubleClickTip && (
              <Alert 
                severity="info"
                sx={{ 
                  position: 'fixed',
                  top: 20,
                  right: 20,
                  zIndex: 9999,
                  width: 'auto',
                  maxWidth: '400px',
                  boxShadow: 3,
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
                onClose={() => setShowDoubleClickTip(false)}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={handleHideNotification}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Don't show again
                  </Button>
                }
              >
                <div className="flex flex-col">
                  <span className="font-medium">Pro tip:</span>
                  <span className="text-sm">
                    Double-click on any task card to view details or delete tasks
                  </span>
                </div>
              </Alert>
            )}
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbar.severity}
              variant="filled"
              sx={{width: "100%"}}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
          <AllAnnouncementsDialog
            open={showAllAnnouncements}
            onClose={() => setShowAllAnnouncements(false)}
          />
        </>
      )}
    </section>
  );
}

export default AdminDashboard;