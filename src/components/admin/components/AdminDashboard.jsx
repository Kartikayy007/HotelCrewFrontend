import React, {useState, useEffect, useMemo} from "react";
import {PieChart} from "@mui/x-charts/PieChart";
import {LineChart} from "@mui/x-charts/LineChart";
import {BarChart} from "@mui/x-charts/BarChart";
import Box from "@mui/material/Box";
import {Tooltip} from "@mui/material";
import {
  Dialog,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Skeleton,
} from "@mui/material";
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
  fetchTodayAnnouncements,
  selectTodayAnnouncements,
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
} from "../../../redux/slices/StaffSlice";
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
import {selectDepartmentNames} from "../../../redux/slices/HotelDetailsSlice";

const DeleteConfirmationDialog = ({open, onClose, onConfirm, loading}) => (
  <Dialog
    open={open}
    onClose={onClose}
    sx={{
      "& .MuiDialog-paper": {
        margin: "16px",
        maxWidth: "400px",
      },
      zIndex: 1400,
    }}
  >
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this announcement? This action cannot be
        undone.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  </Dialog>
);

const DashboardLoadingState = () => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";
  return (
    <>
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        {greeting}
      </h1>
      <div className="flex flex-col xl:flex-row justify-around">
        <div className="flex flex-col space-y-6 w-full xl:w-4/6">
          <div className="bg-white rounded-xl shadow-lg min-h-[320px] w-full p-4">
            <Skeleton
              variant="text"
              width="200px"
              height={32}
              className="mb-4"
            />
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 min-w-[250px]">
                  <Skeleton
                    variant="text"
                    width="150px"
                    height={24}
                    className="mx-auto mb-2"
                  />
                  <Skeleton
                    variant="circular"
                    width={220}
                    height={220}
                    className="mx-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <Skeleton variant="text" width="200px" height={32} />
              <div className="text-right">
                <Skeleton variant="text" width="120px" height={20} />
                <Skeleton variant="text" width="80px" height={32} />
              </div>
            </div>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              className="mb-4"
            />
            <Skeleton variant="rectangular" width="100%" height={40} />
          </div>

          <div className="bg-white rounded-xl shadow-lg w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <Skeleton variant="text" width="200px" height={32} />
              <Skeleton variant="text" width="100px" height={32} />
            </div>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              className="mb-4"
            />
            <Skeleton variant="rectangular" width="100%" height={40} />
          </div>
        </div>

        <div className="flex flex-col space-y-6 w-full xl:w-[30%] mt-5 xl:mt-0">
          <div className="bg-white rounded-xl shadow-lg min-h-[416px] w-full p-4">
            <Skeleton
              variant="text"
              width="180px"
              height={32}
              className="mb-4"
            />
            <Skeleton variant="rectangular" width="100%" height={340} />
          </div>

          <div className="bg-white rounded-xl shadow-lg w-full p-4 flex flex-col h-[40rem] xl:h-[calc(40vh)]">
            <div className="flex justify-between items-center mb-4">
              <Skeleton variant="text" width="200px" height={32} />
              <Skeleton variant="circular" width={24} height={24} />
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-b border-gray-200 py-4 last:border-0"
                >
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={24}
                    className="mb-2"
                  />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                </div>
              ))}
            </div>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={40}
              className="mt-auto"
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton variant="text" width="150px" height={32} />
              <Skeleton variant="circular" width={24} height={24} />
            </div>
            <div className="space-y-4">
              <Skeleton variant="rectangular" width="100%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={200} />
              <Skeleton variant="rectangular" width="100%" height={40} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function AdminDashboard() {
  const dispatch = useDispatch();
  const attendanceStats = useSelector((state) => state.attendance.stats);
  const hotelDepartments = useSelector(selectDepartmentNames);
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
  const dailyRevenues = useSelector((state) => state.revenue.dailyRevenues);
  const dates = useSelector((state) => state.revenue.dates);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [showDoubleClickTip, setShowDoubleClickTip] = useState(false);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [previousTotalRevenue, setPreviousTotalRevenue] = useState(0);

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
          dispatch(fetchTodayAnnouncements()),
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

  latestRevenue;

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
      const currentTotalRevenue = parseFloat(latestRevenue);

      setHourlyRevenues((prev) => {
        const updated = [...prev];
        if (currentTotalRevenue > previousTotalRevenue) {
          updated[currentHour] = currentTotalRevenue - previousTotalRevenue;
        } else {
          updated[currentHour] = 0;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      setPreviousTotalRevenue(currentTotalRevenue);
    }
  }, [latestRevenue]);

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
            // Only update if there's actual new revenue
            if (newRevenue > previousTotalRevenue) {
              updated[currentHour] = newRevenue - previousTotalRevenue;
            } else {
              updated[currentHour] = 0; // No new revenue this hour
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
          setPreviousTotalRevenue(newRevenue);
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

  useEffect(() => {
    // Initial fetch
    dispatch(fetchRevenueStats());

    // Set up hourly fetch
    const interval = setInterval(() => {
      dispatch(fetchRevenueStats());
    }, 3600000); // 1 hour in milliseconds

    return () => clearInterval(interval);
  }, [dispatch]);

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
      label: `Occupied (${occupiedRooms})`,
      color: "#252941",
    },
    {
      id: 1,
      value: availableRooms,
      label: `Available (${availableRooms})`,
      color: "#8094D4",
    },
  ];

  const tasks = useSelector(selectAllTasks);
  const staffPerDepartment =
    useSelector((state) => state.staff?.staffPerDepartment) || {};

  const totalStaff = useMemo(() => {
    if (!staffPerDepartment || typeof staffPerDepartment !== "object") {
      return 0;
    }

    return Object.values(staffPerDepartment).reduce(
      (sum, count) => sum + (Number(count) || 0),
      0
    );
  }, [staffPerDepartment]);

  // ("Total staff count:", totalStaff);

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
      color: "#252941",
    },
    {
      id: 1,
      value: staffStatus.available,
      label: `Available (${staffStatus.available})`,
      color: "#8094D4",
    },
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
      label: `Present (${todayStats.present})`,
      color: "#8094D4",
    },
    {
      id: 1,
      value: todayStats.absent,
      label: `Absent (${todayStats.absent})`,
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

  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleCreateAnnouncement = async (announcementData) => {
    try {
      setLoading(true);

      const enrichedData = {
        ...announcementData,
        department: capitalizeFirstLetter(announcementData.department),
        created_at: new Date().toISOString(),
      };

      await dispatch(createAnnouncement(enrichedData)).unwrap();
      setShowAnnouncementBox(false);
      await dispatch(fetchTodayAnnouncements());

      setSnackbar({
        open: true,
        message: "Announcement created successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Create announcement error:", error);

      // Extract the specific error message and customize it with department name
      let errorMessage;
      if (error?.department) {
        const departmentName = enrichedData.department || "selected department";
        errorMessage = `No staff found in ${departmentName} department`;
      } else {
        // Fallback error message
        errorMessage =
          typeof error === "string"
            ? error
            : error?.message || "Failed to create announcement";
      }

      setSnackbar({
        open: true,
        message: errorMessage,
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
    if (!selectedAnnouncement?.id) return;

    try {
      setDeleteLoading(true);
      await dispatch(deleteAnnouncement(selectedAnnouncement.id)).unwrap();

      dispatch(fetchTodayAnnouncements());
      setShowConfirmDialog(false);
      setSelectedAnnouncement(null);

      // Show success message (optional)
      setSnackbar({
        open: true,
        message: "Announcement deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete announcement",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // In handleAssign function
  const handleAssign = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Validation check
    if (
      !taskTitle ||
      !selected.value ||
      !taskDescription ||
      !selectedHour ||
      !selectedMinute
    ) {
      const timeout = setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);

      const handleClick = () => {
        setFormSubmitted(false);
        document.removeEventListener("click", handleClick);
        clearTimeout(timeout);
      };

      document.addEventListener("click", handleClick);
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
          department: capitalizeFirstLetter(selected.value),
          deadline: formattedDeadline,
        })
      ).unwrap();

      await Promise.all([dispatch(fetchTasks()), dispatch(fetchStaffStatus())]);

      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setSelected({value: "", label: "Department"});
      setSelectedHour("09");
      setSelectedMinute("00");
      setFormSubmitted(false); // Reset tooltip state

      setSnackbar({
        open: true,
        message: "Task assigned successfully",
        severity: "success",
      });
    } catch (err) {
      let errorMessage;

      if (
        err?.non_field_errors?.[0]?.includes(
          "No staff in the specified department"
        )
      ) {
        const deptName = selected?.label || "selected department";
        errorMessage = `No staff members available in ${deptName} department`;
      } else {
        errorMessage =
          err?.errors?.detail ||
          err?.message ||
          (typeof err === "object" ? Object.values(err)[0] : err) ||
          "Failed to assign task";
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      console.error("Task assignment error:", err);

      // Auto-hide error tooltips after 3 seconds
      const timeout = setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);

      const handleClick = () => {
        setFormSubmitted(false);
        document.removeEventListener("click", handleClick);
        clearTimeout(timeout);
      };

      document.addEventListener("click", handleClick);
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
  const todayAnnouncements = useSelector(selectTodayAnnouncements);

  const sortedAnnouncements = useMemo(() => {
    if (!todayAnnouncements?.length) return [];

    return [...todayAnnouncements].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
  }, [todayAnnouncements]);

  const formatDataForGraph = () => {
    return revenueData.map((point) => ({
      time: `${point.hour}:${point.minute}`,
      revenue: point.revenue,
    }));
  };

  useEffect(() => {
    const handleTaskMonitorOpen = () => {
      // Check if user has disabled the notification
      const hideNotification = localStorage.getItem("hideTaskMonitorTip");

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
    localStorage.setItem("hideTaskMonitorTip", "true");
    setShowDoubleClickTip(false);
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const extractDepartment = (assignedString) => {
    const match = assignedString.match(/\(([^)]+)\)/g);
    return match && match[1] ? match[1].replace(/[()]/g, "") : "";
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      {isInitialLoading ? (
        <DashboardLoadingState />
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
                            <Skeleton
                              variant="circular"
                              width={220}
                              height={220}
                            />
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
                    Weekly Revenue Overview
                  </h2>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Latest Revenue</p>
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
                  <LineChart
                    height={300}
                    series={[
                      {
                        data: dailyRevenues?.length ? dailyRevenues : [0],
                        color: "#4C51BF",
                        area: true,
                        curve: "linear",
                      },
                    ]}
                    xAxis={[
                      {
                        data: dates?.length ? dates : ["No data"],
                        scaleType: "band",
                        tickLabelStyle: {
                          angle: 0,
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
                  />
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
                            key={announcement.id}
                            className="border-b border-gray-200 py-4 last:border-0 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleViewAnnouncement(announcement)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {announcement.title}
                                </h3>
                                <span className="text-sm text-gray-500">
                                  {announcement.department} •{" "}
                                  {announcement.urgency}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(
                                  announcement.created_at
                                ).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-gray-600 line-clamp-2">
                              {announcement.description}
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
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
                    <div className="bg-white rounded-xl w-full max-w-2xl mx-4">
                      <CreateAnnouncementBox
                        onClose={() => setShowAnnouncementBox(false)}
                        onSubmit={handleCreateAnnouncement}
                        departments={hotelDepartments}
                      />
                    </div>
                  </div>
                )}

                <Dialog
                  open={!!selectedAnnouncement}
                  onClose={handleViewClose}
                  maxWidth="sm"
                  fullWidth
                  sx={{zIndex: 1300}}
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
                            {Array.from(
                              new Set( // Remove duplicates
                                selectedAnnouncement?.assigned_to?.map(
                                  (person) => extractDepartment(person)
                                )
                              )
                            ).map((department, index) => (
                              <li key={index}>{department}</li>
                            )) || []}
                          </ul>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          onClick={() => setShowConfirmDialog(true)}
                          variant="contained"
                          color="error"
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
                <div className="flex justify-between items-center mb-2">
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

                <Tooltip
                  open={formSubmitted && taskTitle === ""}
                  title="Task title is required"
                  arrow
                  placement="top"
                >
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full focus:border-gray-300 focus:outline-none"
                  />
                </Tooltip>

                <div className="flex justify-between gap-4">
                  <Tooltip
                    open={formSubmitted && !selected.value}
                    title="Please select a department"
                    arrow
                    placement="top"
                  >
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
                          {hotelDepartments.map((dept) => (
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
                  </Tooltip>
                </div>

                <div className="relative w-full mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <Tooltip
                    open={formSubmitted && (!selectedHour || !selectedMinute)}
                    title="Please select deadline time"
                    arrow
                    placement="top"
                  >
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
                        className="border border- gray-200 rounded-xl bg-[#e6eef9] p-2 w-1/2 focus:outline-none"
                      >
                        {minutes.map((minute) => (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Tooltip>
                </div>

                <Tooltip
                  open={formSubmitted && taskDescription === ""}
                  title="Task description is required"
                  arrow
                  placement="top"
                >
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Task Description"
                    maxLength={350}
                    className="border border-gray-200 w-full rounded-xl bg-[#e6eef9] p-2 xl:h-full h-72 resize-none mb-2 overflow-y-auto focus:border-gray-300 focus:outline-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
                  />
                </Tooltip>

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
                  position: "fixed",
                  top: 20,
                  right: 20,
                  zIndex: 9999,
                  width: "auto",
                  maxWidth: "400px",
                  boxShadow: 3,
                  "& .MuiAlert-message": {
                    width: "100%",
                  },
                }}
                onClose={() => setShowDoubleClickTip(false)}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleHideNotification}
                    sx={{fontSize: "0.75rem"}}
                  >
                    Don't show again
                  </Button>
                }
              >
                <div className="flex flex-col">
                  <span className="font-medium">Pro tip:</span>
                  <span className="text-sm">
                    Double-click on any task card to view details or delete
                    tasks
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
          <DeleteConfirmationDialog
            open={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
            onConfirm={handleDelete}
            loading={deleteLoading}
          />
        </>
      )}
    </section>
  );
}

export default AdminDashboard;
