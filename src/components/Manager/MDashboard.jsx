import {useState, useEffect, useRef} from "react";
import * as React from "react";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import {PieChart} from "@mui/x-charts/PieChart";
import {LineChart} from "@mui/x-charts/LineChart";
import {BarChart} from "@mui/x-charts/BarChart";
import {FaStar} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {BsThreeDots} from "react-icons/bs";
import {
  fetchStaffData,
  selectStaffPerDepartment,
  selectStaffLoading,
} from "../../redux/slices/StaffSlice";
import {
  fetchAttendanceStats,
  selectError,
  selectStats,
  selectLoading,
} from "../../redux/slices/AttendanceSlice";
import {
  Dialog,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Select,
  MenuItem,
  Menu,
} from "@mui/material";
import {CreateAnnouncementBox} from "../common/CreateAnnouncementBox";
import {
  createAnnouncement,
  fetchTodayAnnouncements, // Add this
  selectAllAnnouncements,
  selectAnnouncementsLoading,
  selectAnnouncementsError,
  deleteAnnouncement,
  selectTodayAnnouncements, // Add this
} from "../../redux/slices/AnnouncementSlice";
// import { createTask, selectTasksLoading, selectTasksError } from '../../redux/slices/TaskSlice';
import Slider from "@mui/material/Slider";
import {
  fetchGuestData,
  selectCheckins,
  selectCheckouts,
  selectDates,
  selectGuestError,
  selectGuestLoading,
} from "../../redux/slices/GuestSlice";
import {Skeleton} from "@mui/material";
import Box from "@mui/material/Box";
import AdminTaskAssignment from "../admin/components/AdminTaskAssignment";
import LoadingAnimation from "../common/LoadingAnimation";
import {
  fetchLeaveRequests,
  fetchLeaveCount,
  selectLeaveCount,
  selectLeaveError,
  selectLeaveLoading,
  selectLeaveRequests,
  selectUpdateStatus
}
  from "../../redux/slices/leaveSlice";
import {
  selectLatestRevenue,
  fetchRevenueStats,
  selectRoomStats,
} from "../../redux/slices/revenueSlice";
import {
  fetchRoomStats,
  selectOccupiedRooms,
  selectAvailableRooms,
  selectOccupancyLoading,
  selectOccupancyError
} from "../../redux/slices/OcupancyRateSlice";
import {
  createTask,
  selectTasksLoading,
  selectTasksError,
  selectAllTasks,
  fetchTasks,
} from "../../redux/slices/TaskSlice";
import {MoreVertical} from "lucide-react";
import {AllAnnouncementsDialog} from "../common/AllAnnouncementsDialog";
import RevenueDashboard from "../common/RevenueDashboard";
import {
  selectHotelDetails,
  fetchHotelDetails,
  selectDepartmentNames,
} from "../../redux/slices/HotelDetailsSlice";
import AdminTaskAssignment from "../admin/components/AdminTaskAssignment";
import {Tooltip} from "@mui/material";

const MDashboard = () => {
  const dispatch = useDispatch();
  // const [loading,setloading]=useState(false);
  // const [isPriority, setIsPriority] = useState(false);
  const [isPriorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [taskDescription, setTaskDescription] = useState("");
  const Taskloading = useSelector(selectTasksLoading);
  const Taskerror = useSelector(selectTasksError);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [performanceRange, setPerformanceRange] = useState([
    0,
    currentHour || 1,
  ]);
  const [revenueRange, setRevenueRange] = useState([0, currentHour || 1]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAnnouncementBox, setShowAnnouncementBox] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const leaveRequests = useSelector(selectLeaveRequests);
  const leaveLoading = useSelector(selectLeaveLoading);
  const leaveError = useSelector(selectLeaveError);
  const leaveCount = useSelector(selectLeaveCount);
  const updateLeaveStatus = useSelector(selectUpdateStatus);
  const checkins = useSelector(selectCheckins);
  const checkouts = useSelector(selectCheckouts);
  const guestloading = useSelector(selectGuestLoading);
  const guesterror = useSelector(selectGuestError);
  const [sliderValue, setSliderValue] = useState([0, 6]);
  const [inOutData, setInOutData] = useState({
    xAxis: [
      {
        data: [],
        scaleType: "band",
        categoryGapRatio: 0.5,
      },
    ],
    series: [
      {
        id: "checkin",
        type: "bar",
        data: [],
        color: "#8094D4",
        label: "Check-in",
      },
      {
        id: "checkout",
        type: "bar",
        data: [],
        color: "#2A2AA9",
        label: "Check-out",
      },
    ],
  });

  // const departments = useSelector(selectDepartments);
  const availableRooms = useSelector(selectAvailableRooms);
  const occupiedRooms = useSelector(selectOccupiedRooms);
  const dailyRevenues = useSelector((state) => {
    console.log("Redux State:", state.revenue);
    return state.revenue.dailyRevenues;
  });
  const dates = useSelector((state) => state.revenue.dates);
  const latestRevenue = useSelector(selectLatestRevenue);
  const revenueLoading = useSelector((state) => state.revenue.loading);

  // Log the selected values
  console.log("Selected Revenue Data:", {
    dailyRevenues,
    dates,
    latestRevenue,
    revenueLoading,
  });

  const hotelDetails = useSelector(selectHotelDetails);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchRevenueStats()).unwrap();
        console.log("Revenue API Response:", result);
      } catch (error) {
        console.error("Revenue API Error:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 3600000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {

    dispatch(fetchGuestData());
    dispatch(fetchRoomStats());
    dispatch(fetchRevenueStats());
    dispatch(fetchStaffData());
    dispatch(fetchTasks());
    const interval = setInterval(() => {
      dispatch(fetchRoomStats());
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    department: false,
    priority: false,
    description: false,
  });

  useEffect(() => {
    if (hotelDetails?.department_names) {
      const deptArray = hotelDetails.department_names
        .split(",")
        .map((dept) => dept.trim())
        .map((dept) => ({
          value: dept.toLowerCase(),
          label: dept.charAt(0).toUpperCase() + dept.slice(1),
        }));
      setDepartments(deptArray);
    }
  }, [hotelDetails]);

  useEffect(() => {
    dispatch(fetchHotelDetails());
    // ... your other dispatch calls
  }, [dispatch]);

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

  useEffect(() => {
    if (Array.isArray(dates) && dates.length > 0) {
      setInOutData({
        xAxis: [
          {
            data: dates,
            scaleType: "band",
            categoryGapRatio: 0.5,
          },
        ],
        series: [
          {
            id: "checkin",
            type: "bar",
            data: checkins,
            color: "#8094D4",
            label: "Check-in",
          },
          {
            id: "checkout",
            type: "bar",
            data: checkouts,
            color: "#2A2AA9",
            label: "Check-out",
          },
        ],
      });
    }
  }, [dates, checkins, checkouts]);

  const filteredData = {
    xAxis: [inOutData.xAxis[0].data.slice(sliderValue[0], sliderValue[1] + 1)],
    series: inOutData.series.map((s) => ({
      ...s,
      data: s.data.slice(sliderValue[0], sliderValue[1] + 1),
    })),
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  useEffect(() => {
    const intervalId = setInterval((  ) => {
      const currentDate = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
      const currentIndex = dates.findIndex((date) => date === currentDate);
      if (currentIndex !== -1) {
        setSliderValue([currentIndex, currentIndex + 6]); // Move the slider
      }
    }, 86400000); // Update the slider every day

    return () => clearInterval(intervalId);
  }, [dates]);

  useEffect(() => {
    // Define the date for fetchLeaveCount
    const currentDate = new Date().toISOString().split("T")[0]; // Format as "YYYY-MM-DD"

    // Function to fetch data
    const fetchData = () => {
      dispatch(fetchLeaveRequests());
      dispatch(fetchLeaveCount(currentDate));
      dispatch(fetchAttendanceStats());
    };

    // Fetch immediately on mount
    fetchData();

    // Set up interval to fetch every 4 minutes (240,000 ms)
    const intervalId = setInterval(fetchData, 240000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const skeletonProps = {
    animation: "wave",
    sx: {
      animationDuration: "0.8s",
    },
  };

  const departments = useSelector(selectStaffPerDepartment);
  const staffLoading = useSelector(selectStaffLoading);

  useEffect(() => {
    dispatch(fetchStaffData());
  }, [dispatch]);

  const [selected, setSelected] = useState({label: "Department", value: ""});

  // const {  error } = useSelector((state) => state.attendance);
  const stats = useSelector(selectStats);
  const statError = useSelector(selectError);
  const statLoading = useSelector(selectLoading);
  // const staffStatus = [
  //   { id: 0, value: 45, label: "Busy", color: "#252941" },
  //   { id: 1, value: 35, label: "Vacant", color: "#8094D4" },
  // ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const hotelDepartments = useSelector(selectDepartmentNames);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Add these handlers
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleShowAllAnnouncements = () => {
    setShowAllAnnouncements(true);
    handleMenuClose();
  };

  const handleDotsClose = () => {
    setAnchorEl(null);
  };

  const handleShowTaskAssignment = () => {
    setShowTaskAssignment(true);
    handleDotsClose();
  };
  const staffAttendanceData = [
    {
      id: 0,
      value: stats.total_present,
      label: `Present (${stats.total_present})`,
      color: "#252941",
    },
    {
      id: 1,
      value: stats.total_crew - stats.total_present,
      label: `Absent (${stats.total_crew - stats.total_present})`,
      color: "#8094D4",
    },
  ];

  // if (!Array.isArray(staffList)) {
  //   return <div>Loading staff list...</div>;
  // }
  const tasks = useSelector(selectAllTasks);
  const staffPerDepartment = useSelector(selectStaffPerDepartment);

  "Staff per department:", staffPerDepartment;
  "All tasks:", tasks;

  const totalStaff = staffPerDepartment?Object.values(staffPerDepartment).reduce(
    (sum, count) => sum + count,
    0
  ):0;
  "Total staff count:", totalStaff;

  const inProgressCount = Array.isArray(tasks)
    ? tasks.filter((task) => task.status.toLowerCase() === "in_progress").length
    : 0;
  const pendingCount = Array.isArray(tasks)
    ? tasks.filter((task) => task.status.toLowerCase() === "pending").length
    : 0;
  const busyStaffCount = inProgressCount + pendingCount;
  const vacantStaffCount = Math.max(0, totalStaff - busyStaffCount);

  const staffStatus = [
    {
      id: 0,
      value: busyStaffCount,
      label: `Busy (${busyStaffCount})`,
      color: "#252941",
    },
    {
      id: 1,
      value: vacantStaffCount,
      label: `Vacant (${vacantStaffCount})`,
      color: "#8094D4",
    },
  ];

  const rotateWeeklyData = (data, todayIndex) => {
    // Rotate the xAxis and series data to make todayIndex the last element
    const {xAxis, series} = data;

    const rotatedXAxis = [
      ...xAxis[0].data.slice(todayIndex + 1),
      ...xAxis[0].data.slice(0, todayIndex + 1),
    ];

    const rotatedSeries = series.map((s) => ({
      ...s,
      data: [
        ...s.data.slice(todayIndex + 1),
        ...s.data.slice(0, todayIndex + 1),
      ],
    }));

    return {xAxis: [{...xAxis[0], data: rotatedXAxis}], series: rotatedSeries};
  };

  const getCurrentDayIndex = () => {
    const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return currentDay;
  };

  const getFilteredData = (range) => {
    return timeData.slice(range[0], range[1] + 1);
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
  const marks = generateMarks();
  useEffect(() => {
    const interval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== currentHour) {
        setCurrentHour(newHour);
        setPerformanceRange([0, newHour || 1]);
        setRevenueRange([0, newHour || 1]);
        setTimeData(generateTimeData(newHour));
      }
    }, 60000);

    setTimeout(() => {
      setTimeData(generateTimeData(currentHour));

      setLoading(false);
    }, 1500);

    return () => clearInterval(interval);
  }, [currentHour]);

  const handleSelect = (dept) => {
    setSelected(dept);
    setIsDropdownOpen(false);
  };
  // useEffect(() => {
  //    ("Updated taskData:", taskData);
  // }, [taskData]);

  // localStorage.setItem('accessToken',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NTc4MzMzLCJpYXQiOjE3MzE5ODYzMzMsImp0aSI6IjMxNjk0NTQzNWIzYTQ0MDBhM2MxOGE5M2UzZTk5NTQ0IiwidXNlcl9pZCI6NzF9.Dyl7m7KmXCrMvqbPo31t9q7wWcYgLHCNi9SNO6SPfrY")

  // const dataToSend = {
  //   title,
  //   description,
  //   department,
  //   // priority,
  // };

  //   try {
  //     const response = await dispatch(createTask(taskData));
  //     //  (response.data);
  //     if (response.data.status === 'success') {
  //       alert('Task created successfully');
  //     } else {
  //       alert('Failed to create task: ' + response.data.message);
  //     }
  //   } catch (error) {
  //     alert('An error occurred: ' + error.message);
  //   }
  // };
    // Add this helper function at the top of component
  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  // Modified handleAssign with capitalized department
  const handleAssign = async (e) => {
    e.preventDefault();
  
    const errors = {
      title: !taskTitle,
      department: !selected.value,
      deadline: !selectedHour || !selectedMinute,
      description: !taskDescription,
    };
  
    setFieldErrors(errors);
  
    if (Object.values(errors).some((error) => error)) {
      return;
    }
  
    // Create deadline timestamp
    const today = new Date();
    today.setHours(parseInt(selectedHour, 10));
    today.setMinutes(parseInt(selectedMinute, 10));
    today.setSeconds(0);
  
    const formattedDeadline = today.toISOString();
  
    const taskData = {
      title: taskTitle,
      description: taskDescription,
      department: capitalizeFirstLetter(selected.value), // Capitalize department
      deadline: formattedDeadline,
    };
  
    try {
      await dispatch(createTask(taskData)).unwrap();
      setSnackbar({
        open: true,
        message: "Task created successfully",
        severity: "success",
      });
      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setSelected({label: "Department", value: ""});
      setSelectedHour("09");
      setSelectedMinute("00");
      setFieldErrors({
        title: false,
        department: false,
        deadline: false,
        description: false,
      });
    } catch (err) {
      let errorMessage;
  
      if (err?.non_field_errors?.[0]?.includes("No staff in the specified department")) {
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
      
      const timeout = setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
  
      const handleClick = () => {
        setFormSubmitted(false);
        document.removeEventListener('click', handleClick);
        clearTimeout(timeout);
      };
  
      document.addEventListener('click', handleClick);
    }
  };

  // Add Snackbar close handler
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({...prev, open: false}));
  };

  const announcements = useSelector(selectTodayAnnouncements);
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

  useEffect(() => {
    dispatch(fetchTodayAnnouncements());
  }, [dispatch]);

  const handleCreateAnnouncement = async (announcementData) => {
    try {
      // Dispatch the createAnnouncement action
      const result = await dispatch(createAnnouncement(announcementData)).unwrap();
      
      // Show success message
      setSnackbar({
        open: true,
        message: "Announcement created successfully",
        severity: "success"
      });
  
      // Close modal and reset form
      handleModalClose();
  
      // Refresh today's announcements
      dispatch(fetchTodayAnnouncements());
  
    } catch (error) {
      // Show error message
      setSnackbar({
        open: true,
        message: error.message || "Failed to create announcement",
        severity: "error"
      });
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

    setDeleteLoading(true);
    try {
      await dispatch(deleteAnnouncement(selectedAnnouncement.id)).unwrap();
      setShowConfirmDialog(false);
      handleViewClose();
      setSnackbar({
        open: true,
        message: "Announcement deleted successfully",
        severity: "success",
      });
      // Refetch announcements
      dispatch(fetchTodayAnnouncements());
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to delete announcement",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const pendingLeavesCount = leaveRequests.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const [selectedDataType, setSelectedDataType] = useState("checkins");
  const daily_checkins = useSelector((state) => state.revenue.daily_checkins);
  const daily_checkouts = useSelector((state) => state.revenue.daily_checkouts);
  const weekRange = useSelector((state) => state.revenue.weekRange);

  // Format dates helper function
  const formatDates = (date) => {
    const d = new Date(date);
    const day = d.toLocaleDateString("en-US", {weekday: "short"});
    const monthDay = d.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
    });
    return `${day}\n${monthDay}`;
  };

  const extractDepartment = (assignedString) => {
    // Format: "email@example.com (Staff) (Department) (Shift)"
    const match = assignedString.match(/\(([^)]+)\)/g);
    return match && match[1] ? match[1].replace(/[()]/g, '') : '';
  };

  // Add state for deadline time
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("00");

  // Generate hours and minutes arrays
  const hours = Array.from({length: 24}, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({length: 60}, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Add these states at the top of MDashboard component
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const announcementContainerRef = useRef(null);

  // Add this function to handle scroll
  const handleAnnouncementScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !announcementsLoading && hasMore) {
      loadMoreAnnouncements();
    }
  };

  // Add function to load more announcements
  const loadMoreAnnouncements = async () => {
    try {
      const response = await dispatch(fetchAnnouncements(`?page=${page + 1}`)).unwrap();
      if (response.results?.length > 0) {
        setPage(prev => prev + 1);
        setHasMore(!!response.next);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more announcements:', error);
    }
  };

  const renderAnnouncements = () => {
    if (announcementsLoading) {
      return (
        <div className="space-y-4">
          <Skeleton variant="text" width="60%" height={24} {...skeletonProps} />
          <Skeleton variant="rectangular" width="100%" height={60} {...skeletonProps} />
          <Skeleton variant="rectangular" width="100%" height={60} {...skeletonProps} />
        </div>
      );
    }

    if (announcementsError) {
      return (
        <div className="text-red-500 text-center mt-4">
          {announcementsError}
        </div>
      );
    }

    if (!announcements?.length) {
      return (
        <div className="flex justify-center mt-20 h-full text-gray-500">
          No announcements available for today
        </div>
      );
    }

    return announcements.map((announcement) => (
      <div
        key={announcement.id}
        className="border-b border-gray-200 py-4 last:border-0 cursor-pointer hover:bg-gray-50"
        onClick={() => handleViewAnnouncement(announcement)}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{announcement.title}</h3>
            <span className="text-sm text-gray-500">
              {announcement.department} • {announcement.urgency}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(announcement.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-gray-600 line-clamp-2">{announcement.description}</p>
      </div>
    ));
  };

  return (
    <section className=" h-screen p-2 mr-2 sm:mr-4 font-Montserrat">
      <h1 className="text-[#252941] text-3xl mt-6 mb-4  pl-16 font-semibold">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 xl:grid-cols-[70%,30%] gap-5 p-3">

        {/* First Column */}
        <div className="space-y-5">

          <div className="bg-white w-full  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">

            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Hotel Status</h2>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-1">
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
                  <div className="flex flex-col lg:flex-row overflow-hidden flex-1">
                    <div className="flex-1 min-w-[250px] ">
                      <h3 className="font-medium mb-2 text-center">
                        Occupancy Rate
                      </h3>
                      {!occupancyData.some((item) => item.value > 0) ? (
                        <div className="flex items-center justify-center h-[180px] text-gray-500">
                          No Data Available
                        </div>
                      ) : (
                        <div>
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
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-[250px]">
                      <h3 className="font-medium mb-2 text-center">
                        Staff Status
                      </h3>
                      {!staffStatus.some((item) => item.value > 0) ? (
                        <div className="flex items-center justify-center h-[180px] text-gray-500">
                          No Data Available
                        </div>
                      ) : (
                        <div>
                          <PieChart
                            series={[
                              {
                                data: staffStatus,
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
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-[250px]">
                      <h3 className="font-medium mb-2 text-center">
                        Staff Attendance
                      </h3>

                      {statLoading ? (
                        <></>
                      ) : statError ? (
                        <p className="text-red-500 text-center">
                          No Data Available
                        </p>
                      ) : !staffAttendanceData.some(
                          (item) => item.value > 0
                        ) ? (
                        <div className="flex items-center justify-center h-[180px] text-gray-500">
                          No Data Available
                        </div>
                      ) : (
                        <div>
                          <PieChart
                            series={[
                              {
                                data: staffAttendanceData,
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
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  Guest Flow Overview
                </h2>
                {weekRange && !revenueLoading && (
                  <p className="text-sm text-gray-600">Week of: {weekRange}</p>
                )}
              </div>
              <Select
                value={selectedDataType}
                onChange={(e) => setSelectedDataType(e.target.value)}
                size="small"
                sx={{minWidth: 120}}
                disabled={revenueLoading}
              >
                <MenuItem value="checkins">Check-ins</MenuItem>
                <MenuItem value="checkouts">Check-outs</MenuItem>
              </Select>
            </div>

            <Box sx={{width: "100%"}}>
              {revenueLoading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={250}
                  {...skeletonProps}
                />
              ) : (
                <LineChart
                  height={300}
                  margin={{top: 5, right: 20, bottom: 40, left: 40}}
                  series={[
                    {
                      data:
                        selectedDataType === "checkins"
                          ? daily_checkins
                          : daily_checkouts,
                      color:
                        selectedDataType === "checkins" ? "#3331D1" : "#0B8FD9",
                      area: true,
                      curve: "linear",
                    },
                  ]}
                  xAxis={[
                    {
                      data: dates.map((date) => formatDates(date)),
                      scaleType: "band",
                      tickLabelStyle: {
                        angle: 0,
                        textAnchor: "middle",
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
            </Box>
          </div>

          <RevenueDashboard
            revenueLoading={revenueLoading}
            dailyRevenues={dailyRevenues} // Make sure this is not undefined
            dates={dates}
            latestRevenue={latestRevenue}
            skeletonProps={skeletonProps}
          />
        </div>
        {/* Second Column */}
        <div className="space-y-5">
          <div className="w-full ">
              <form
                className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow-lg"
                onSubmit={handleAssign}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Task Assignment
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
                  open={fieldErrors.title}
                  title="Task title is required"
                  arrow
                  placement="top"
                >
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={taskTitle}
                    onChange={(e) => {
                      setTaskTitle(e.target.value);
                      setFieldErrors((prev) => ({...prev, title: false}));
                    }}
                    className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full focus:border-gray-300 focus:outline-none"
                  />
                </Tooltip>

                <div className="flex justify-between gap-4">
                  <Tooltip
                    open={fieldErrors.department}
                    title="Department is required"
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
                        {selected.label || "Department"}
                        {isDropdownOpen ? (
                          <FaChevronUp className="text-gray-600" />
                        ) : (
                          <FaChevronDown className="text-gray-600" />
                        )}
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                          {staffLoading ? (
                            <div className="px-4 py-2 text-gray-500">
                              Loading departments...
                            </div>
                          ) : departments ? (
                            Object.entries(departments).map(
                              ([dept, count], index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    handleSelect({
                                      label: dept,
                                      value: dept.toLowerCase(),
                                    });
                                    setFieldErrors((prev) => ({
                                      ...prev,
                                      department: false,
                                    }));
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                  {`${dept} (${count})`}
                                </button>
                              )
                            )
                          ) : (
                            <div className="px-4 py-2 text-gray-500">
                              No departments available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Tooltip>
                </div>

                <div className="relative w-full mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                    <div className="flex space-x-2">
                      <select
                        value={selectedHour}
                        onChange={(e) => {
                          setSelectedHour(e.target.value);
                          setFieldErrors((prev) => ({
                            ...prev,
                            deadline: false,
                          }));
                        }}
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
                        onChange={(e) => {
                          setSelectedMinute(e.target.value);
                          setFieldErrors((prev) => ({
                            ...prev,
                            deadline: false,
                          }));
                        }}
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

                <Tooltip
                  open={fieldErrors.description}
                  title="Description is required"
                  arrow
                  placement="top"
                >
                  <textarea
                    value={taskDescription}
                    onChange={(e) => {
                      setTaskDescription(e.target.value);
                      setFieldErrors((prev) => ({...prev, description: false}));
                    }}
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
          </Dialog>
          <div className="bg-white rounded-lg flex flex-col shadow xl:min-h-[515px] w-full p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Announcements</h2>
              <IconButton
                onClick={handleShowAllAnnouncements}
                size="small"
              >
                <MoreVertical className="h-5 w-5 text-gray-600"  />
              </IconButton >
            </div>

            <AllAnnouncementsDialog
              open={showAllAnnouncements}
              onClose={() => setShowAllAnnouncements(false)}
            />
            <div 
              ref={announcementContainerRef}
              className="overflow-auto h-[400px]"
              onScroll={handleAnnouncementScroll}
            >
              {renderAnnouncements()}
            </div>

            <div className="mt-auto ">
              <Button
                variant="contained"
                fullWidth
                onClick={() => setShowAnnouncementBox(true)}
                sx={{
                  backgroundColor: "#3A426F",
                  "&:hover": {backgroundColor: "#3A426F"},
                  borderRadius: "12px",
                  fontFamily: "'Montserrat'", // Add Montserrat font
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "16px",
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
                    departments={Object.entries(departments || {}).map(([dept]) => ({
                      label: dept,
                      value: dept.toLowerCase()
                    }))}
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
    {Array.from(new Set( // Remove duplicates
      selectedAnnouncement?.assigned_to?.map(person => extractDepartment(person))
    )).map((department, index) => (
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
          <div className="bg-white rounded-lg shadow h-auto w-full p-4">
            <h2 className="text-lg  font-semibold mb-1">Leave Management</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded p-4">
                <h3 className="font-medium">Pending Requests</h3>
                <p className="text-2xl font-bold mt-2">{pendingLeavesCount}</p>
              </div>
              <div className="border rounded p-4">
                <h3 className="font-medium">Approved Leaves</h3>
                <p className="text-2xl font-bold mt-2">{leaveCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
      <DeleteConfirmationDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </section>
  );
};

// Add DeleteConfirmationDialog component at the top of the file
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, loading }) => (
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
        Are you sure you want to delete this announcement? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <Button 
          variant="outlined" 
          onClick={onClose}
          disabled={loading}
        >
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

export default MDashboard;
