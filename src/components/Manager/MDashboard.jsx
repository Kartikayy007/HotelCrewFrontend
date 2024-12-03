import { useState, useEffect,useMemo } from "react";
import * as React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from '@mui/x-charts/BarChart';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStaffData,
  selectStaffPerDepartment,
  selectStaffLoading,
  selectDepartments,
} from "../../redux/slices/AdminStaffSlice";
import { fetchAttendanceStats, selectError, selectStats, selectLoading } from '../../redux/slices/AttendanceSlice';
import { Dialog, TextField, Button, Snackbar, Alert, IconButton } from "@mui/material";
import { CreateAnnouncementBox } from "../common/CreateAnnouncementBox";
import {
  createAnnouncement,
  fetchAnnouncements,
  selectAllAnnouncements,
  selectAnnouncementsLoading,
  selectAnnouncementsError,
  deleteAnnouncement
} from '../../redux/slices/AnnouncementSlice';
import { AllAnnouncementsDialog } from "../common/AllAnnouncementsDialog";
// import { createTask, selectTasksLoading, selectTasksError } from '../../redux/slices/TaskSlice';
import Slider from "@mui/material/Slider";
import { fetchGuestData, selectCheckins, selectCheckouts, selectDates, selectGuestError, selectGuestLoading } from '../../redux/slices/GuestSlice';
import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import MTaskAssignment from "./MTaskAssignment";
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
  from "../../redux/slices/LeaveSlice";
import {
  selectLatestRevenue,
  fetchRevenueStats,
  selectRoomStats,
} from "../../redux/slices/revenueSlice";
import {
  fetchRoomStats,
  selectOccupiedRooms,
  selectAvailableRooms,
} from "../../redux/slices/OcupancyRateSlice";
import {
  createTask,
  selectTasksLoading,
  selectTasksError,
  selectAllTasks,
  fetchTasks,
} from "../../redux/slices/TaskSlice";
import { MoreVertical } from "lucide-react";


const MDashboard = () => {
  const dispatch = useDispatch();
  // const [loading,setloading]=useState(false);
  // const [isPriority, setIsPriority] = useState(false);
  const [isPriorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
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
  // const { leaveRequests,leaveLoading, leaveError,leaveCount} = useSelector((state) => state.leave);
  // const [taskData, setTaskData] = useState({
  //   title: '',
  //   description: '',
  //   department: '',
  //   // priority: false, // For priority status
  // });
  // const { dates, checkins, checkouts, guestloading, guesterror } = useSelector((state) => state.attendance);
  const dates = useSelector(selectDates);
  const checkins = useSelector(selectCheckins);
  const checkouts = useSelector(selectCheckouts);
  const guestloading = useSelector(selectGuestLoading);
  const guesterror = useSelector(selectGuestError);
  const [sliderValue, setSliderValue] = useState([0, 6]);
  const [inOutData, setInOutData] = useState({
    xAxis: [
      {
        data: [],
        scaleType: 'band',
        categoryGapRatio: 0.5,
      },
    ],
    series: [
      {
        id: 'checkin',
        type: 'bar',
        data: [],
        color: '#8094D4',
        label: 'Check-in',
      },
      {
        id: 'checkout',
        type: 'bar',
        data: [],
        color: '#2A2AA9',
        label: 'Check-out',
      },
    ],
  });

  const latestRevenue = useSelector(selectLatestRevenue);
  const revenueLoading = useSelector((state) => state.revenue.loading);
  // const departments = useSelector(selectDepartments);
  const availableRooms = useSelector(selectAvailableRooms);
  const occupiedRooms = useSelector(selectOccupiedRooms);

  useEffect(() => {
    dispatch(fetchRevenueStats());

    const interval = setInterval(() => {
      dispatch(fetchRevenueStats());
    }, 3600000);

    return () => clearInterval(interval);
  }, [dispatch]);


  useEffect(() => {
    dispatch(fetchGuestData());
    dispatch(fetchRoomStats());
    dispatch(fetchRevenueStats());
    dispatch(fetchStaffData());
    // dispatch(fetchTasks());
    const interval = setInterval(() => {
      dispatch(fetchRoomStats());
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const [cumulativeRevenue, setCumulativeRevenue] = useState(0);

  const STORAGE_KEY = 'hourlyRevenueData';
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
      setHourlyRevenues(prev => {
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
        cumulative: i === 0 ? hourlyRevenues[0] :
          timeData[i - 1].cumulative + hourlyRevenues[i]
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


  useEffect(() => {
    if (Array.isArray(dates) && dates.length > 0) {
      setInOutData({
        xAxis: [
          {
            data: dates,
            scaleType: 'band',
            categoryGapRatio: 0.5,
          },
        ],
        series: [
          {
            id: 'checkin',
            type: 'bar',
            data: checkins,
            color: '#8094D4',
            label: 'Check-in',
          },
          {
            id: 'checkout',
            type: 'bar',
            data: checkouts,
            color: '#2A2AA9',
            label: 'Check-out',
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
    const intervalId = setInterval(() => {
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
      dispatch(fetchAttendanceStats());
      dispatch(fetchLeaveRequests());
      dispatch(fetchLeaveCount(currentDate));
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


  const departments = [
    // { value: '', label: 'Select Department', disabled: true },
    { value: 'security', label: 'Security' },
    { value: 'housekeeping', label: 'HouseKeeping' },
    { value: 'maintainence', label: 'Maintainence' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'reception', label: 'Reception' },
  ];

  const [selected, setSelected] = useState({ label: 'Department', value: '' });

  // const {  error } = useSelector((state) => state.attendance);
  const stats = useSelector(selectStats);
  const statError = useSelector(selectError);
  const statLoading = useSelector(selectLoading);
  // const staffStatus = [
  //   { id: 0, value: 45, label: "Busy", color: "#252941" },
  //   { id: 1, value: 35, label: "Vacant", color: "#8094D4" },
  // ];
  // const { totalCrew, totalPresent } = useSelector(selectStats);
  const staffAttendanceData = [
    {
      id: 0,
      value: stats.totalPresent,
      label: 'Present',
      color: '#252941',
    },
    {
      id: 1,
      value: stats.totalCrew- stats.totalPresent,
      label: 'Absent',
      color: '#8094D4',
    },
  ];


  const tasks = useSelector(selectAllTasks);
  const staffPerDepartment = useSelector(selectStaffPerDepartment);

  "Staff per department:", staffPerDepartment;
  "All tasks:", tasks;

  const totalStaff = Object.values(staffPerDepartment).reduce(
    (sum, count) => sum + count,
    0
  );
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
    { id: 0, value: busyStaffCount, label: "Busy", color: "#252941" },
    { id: 1, value: vacantStaffCount, label: "Vacant", color: "#8094D4" },
  ];


  const rotateWeeklyData = (data, todayIndex) => {
    // Rotate the xAxis and series data to make todayIndex the last element
    const { xAxis, series } = data;

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

    return { xAxis: [{ ...xAxis[0], data: rotatedXAxis }], series: rotatedSeries };
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
    setNewAnnouncement({ title: "", description: "" });
  };

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

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
        severity: "error"
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
      console.error('Delete error:', error);
      setSnackbar({
        open: true,
        message: error?.message || "Failed to delete announcement",
        severity: "error"
      });
    }
  };

  const pendingLeavesCount = leaveRequests.filter(
    (leave) => leave.status === "Pending"
  ).length;


  const [deadline, setDeadline] = useState("");
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
      setSelected({ value: "", label: "Department" });
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

  // const [showAnnouncementBox, setShowAnnouncementBox] = useState(false);
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





  return (
    <section className=" h-screen p-2 mr-2 sm:mr-4 font-Montserrat">
      <h1 className="text-[#252941] text-3xl mt-6 mb-4  pl-16 font-semibold">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-[70%,30%] gap-5 p-3">

        {/* First Column */}
        <div className="space-y-5">

          <div className="bg-white w-full  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">

            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Hotel Status</h2>
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
                      <PieChart
                        series={[
                          {
                            data: occupancyData,
                            highlightScope: { fade: "global", highlight: "item" },
                            innerRadius: 45,
                            paddingAngle: 1,
                            cornerRadius: 1,
                          },
                        ]}
                        height={220}
                        margin={{ top: 0, bottom: 40, left: 0, right: 0 }}
                        slotProps={{
                          legend: {
                            hidden: true,

                          }
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-[250px]">
                      <h3 className="font-medium mb-2 text-center">
                        Staff Status
                      </h3>
                      {totalStaff === 0 ? (
                        <div className="flex items-center justify-center h-[180px] text-gray-500">
                          No Staff Data Available
                        </div>
                      ) : (
                      <PieChart
                        series={[
                          {
                            data: staffStatus,
                            highlightScope: { fade: "global", highlight: "item" },
                            innerRadius: 45,
                            paddingAngle: 1,
                            cornerRadius: 1,
                          },
                        ]}
                        height={220}
                        margin={{ top: 0, bottom: 40, left: 0, right: 0 }}
                        slotProps={{
                          legend: {
                            hidden: true,

                          }
                        }}
                      />
                      )}
                    </div>

                    <div className="flex-1 min-w-[250px]">
                      <h3 className="font-medium mb-2 text-center">
                        Staff Attendance
                      </h3>

                      {/* {staffAttendanceData.total_present === 0 ? (
                        <div className="flex items-center justify-center h-[180px] text-gray-500">
                          No Data Available
                        </div> */}
                        
                      {statLoading ? (
                        <p>Loading...</p>
                      ) : statError ? (
                        <p className="text-red-500 text-center">No Data Available</p>
                      ) : (
                        <>
                        { ('Staff Attendance Data:', staffAttendanceData)}
                        <PieChart
                          series={[
                            {
                              data: staffAttendanceData,
                              highlightScope: { fade: 'global', highlight: 'item' },
                              innerRadius: 45,
                              paddingAngle: 1,
                              cornerRadius: 1,
                            },
                          ]}
                          height={220}
                          margin={{ top: 0, bottom: 40, left: 0, right: 0 }}
                          slotProps={{
                            legend: {
                              hidden: true,

                            },
                          }}//line-837
                        />
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>


          </div>
          <div className="bg-white rounded-lg shadow  w-full p-4">
            <h2 className="text-lg sm:text-xl font-semibold">Guest Flow Overview</h2>
            <Box sx={{ width: "100%" }}>
              {/* Bar Chart with Weekly Data */}
              {guestloading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={250}
                  {...skeletonProps}
                />
              ) : (
                <>
                  <BarChart
                    xAxis={[
                      {
                        data: filteredData.xAxis[0], // Dynamically updated xAxis
                        scaleType: "band",
                        categoryGapRatio: 0.5,
                      },
                    ]}
                    series={filteredData.series}
                    margin={{ top: 20, right: 5, bottom: 28, left: 47 }}
                    height={250}

                    slotProps={{
                      legend: { hidden: true },
                      bar: {
                        sx: {
                          borderRadius: "15px", // Round the top corners of the bars
                        },
                      },
                    }}
                  />
                  {/* Slider Component */}
                  <Box sx={{ width: "100%", px: 2, mt: 2 }}>
                    <Slider
                      value={sliderValue}
                      onChange={handleSliderChange}
                      min={0}
                      max={6}
                      step={1}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => {
                        const days = inOutData.xAxis[0].data; // Rotated xAxis labels
                        return days[value];
                      }}
                      valueLabelPosition="top"
                      disableSwap
                      sx={{

                        bottom: 20,
                        height: 3,
                        "& .MuiSlider-thumb": {
                          height: 12,
                          width: 12,
                        },
                      }}
                    // marks={inOutData.xAxis[0].data.map((day, idx) => ({
                    //   value: idx,
                    //   label: day,
                    // }))}
                    />
                  </Box>
                </>
              )}
            </Box>

          </div>
          <div className="bg-white rounded-xl shadow-lg min-h-[384px] w-full p-4 pb-0">
            <h2 className="text-lg sm:text-xl font-semibold ">
              Revenue (Hours {revenueRange[0]} - {revenueRange[1]})
            </h2>
            <div className="text-right pr-3">
              <p className="text-sm text-gray-500">Today's Total Revenue</p>
              <p className="text-xl font-bold">₹{latestRevenue || "0.00"}</p>
            </div>
            {/* <Box sx={{ width: "100%", mb: 4 }}> */}
            {revenueLoading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={250}
                {...skeletonProps}
              />
            ) : (
              <>
                <LineChart
                  height={373}
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
                      data: getFilteredRevenueData().map((data) => data.hour),
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
                <div className="mt-0 px-4">
                  <Slider
                    value={revenueRange}
                    onChange={(_, newValue) => setRevenueRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={currentHour}
                    marks={[
                      { value: 0, label: "00:00" },
                      { value: currentHour, label: `${currentHour}:00` },
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
            {/* </Box> */}

          </div>
        </div>
        {/* Second Column */}
        <div className="space-y-5">

          <div className="w-full ">
            <div className="bg-white  h-[50%] p-4 pr-6 pl-6 shadow rounded-lg">
              <form className="flex flex-col gap-4" onSubmit={handleAssign}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Assign Task</h2>

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
                <div className="flex lg:justify-between gap-2">
                  <div className="relative  w-full">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${selected.value ? "text-black" : "text-gray-400"
                        } focus:outline-none flex justify-between items-center`}>

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
                  className="border border-gray-200 w-full rounded-xl bg-[#e6eef9] p-2 h-[120px] resize-none mb-2 overflow-y-auto focus:border-gray-300 focus:outline-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={Taskloading}
                    className="h-9  w-full  bg-[#3A426F] font-Montserrat font-bold rounded-xl text-white disabled:opacity-50 shadow-xl flex items-center justify-center"
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
          </Dialog>
          <div className="bg-white rounded-lg flex flex-col shadow xl:min-h-[515px] w-full p-4">
            <h2 className="text-lg font-semibold">Announcements</h2>
            <div className="flex-1 overflow-y-auto mb-4">
              {announcementsLoading ? (
                <div className="space-y-4">
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={24}
                    {...skeletonProps}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={60}
                    {...skeletonProps}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={60}
                    {...skeletonProps}
                  />
                </div>
              ) : announcementsError ? (
                <div className="text-red-500 text-center mt-4">
                  {announcementsError}
                </div>
              ) : (
                <div className="overflow-auto h-[400px]">
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
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
                            {new Date(announcement.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {announcement.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center mt-20 h-full text-gray-500">
                      No announcements available
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-auto ">
              <Button
                variant="contained"
                fullWidth
                onClick={() => setShowAnnouncementBox(true)}
                sx={{
                  backgroundColor: "#3A426F",
                  "&:hover": { backgroundColor: "#3A426F" },
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
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={selectedAnnouncement?.description || ""}
                    InputProps={{ readOnly: true }}
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Department:</span> {selectedAnnouncement?.department}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Urgency:</span> {selectedAnnouncement?.urgency}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Created By:</span> {selectedAnnouncement?.assigned_by}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Created At:</span> {' '}
                      {selectedAnnouncement?.created_at &&
                        new Date(selectedAnnouncement.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      }
                    </p>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Assigned To:</span>
                      <ul className="list-disc pl-5 mt-1">
                        {selectedAnnouncement?.assigned_to.map((person, index) => (
                          <li key={index}>{person}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      onClick={handleDelete}
                      variant="contained"
                      sx={{
                        backgroundColor: "#dc2626",
                        "&:hover": { backgroundColor: "#b91c1c" },
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={handleViewClose}
                      variant="contained"
                      sx={{
                        backgroundColor: "#3A426F",
                        "&:hover": { backgroundColor: "#3A426F" },
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
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <AllAnnouncementsDialog
        open={showAllAnnouncements}
        onClose={() => setShowAllAnnouncements(false)}
      />
    </section>
  )
}

export default MDashboard;