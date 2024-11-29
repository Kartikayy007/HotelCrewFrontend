import { useState, useEffect } from "react";
import * as React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from '@mui/x-charts/BarChart';
import { FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { BsThreeDots } from "react-icons/bs";
import { fetchAttendanceStats } from '../../redux/slices/AttendanceSlice';
import { Dialog, TextField, Button, Snackbar, Alert, IconButton } from "@mui/material";
import { CreateAnnouncementBox } from "../reusable components/CreateAnnouncementBox";
import { createAnnouncement, fetchAnnouncements, selectAllAnnouncements, selectAnnouncementsLoading, selectAnnouncementsError, deleteAnnouncement } from '../../redux/slices/AnnouncementSlice';
import { createTask, selectTasksLoading, selectTasksError } from '../../redux/slices/TaskSlice';
import Slider from "@mui/material/Slider";
import { fetchGuestData,selectCheckins,selectCheckouts,selectDates,selectGuestError,selectGuestLoading } from '../../redux/slices/GuestSlice';
import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import MTaskAssignment from "./MTaskAssignment";
import { fetchLeaveRequests,fetchLeaveCount ,selectLeaveCount,selectLeaveError,selectLeaveLoading,selectLeaveRequests,selectUpdateStatus} from "../../redux/slices/LeaveSlice";
 
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
  const leaveCount=useSelector(selectLeaveCount);
  const updateLeaveStatus=useSelector(selectUpdateStatus);
  // const { leaveRequests,leaveLoading, leaveError,leaveCount} = useSelector((state) => state.leave);
  // const [taskData, setTaskData] = useState({
  //   title: '',
  //   description: '',
  //   department: '',
  //   // priority: false, // For priority status
  // });
  // const { dates, checkins, checkouts, guestloading, guesterror } = useSelector((state) => state.attendance);
  const dates=useSelector(selectDates);
  const checkins=useSelector(selectCheckins);
  const checkouts=useSelector(selectCheckouts);
  const guestloading=useSelector(selectGuestLoading);
  const guesterror=useSelector(selectGuestError);
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

  useEffect(() => {
    dispatch(fetchGuestData());
  }, [dispatch]);

  useEffect(() => {
    // Ensure dates, checkins, and checkouts are arrays (default to empty arrays)
    if (Array.isArray(dates) && dates.length > 0) {
      setInOutData({
        xAxis: [
          {
            data: dates, // Use actual dates here
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
      dispatch(fetchLeaveRequests());
      dispatch(fetchLeaveCount(currentDate));
      dispatch(fetchAttendanceStats());
    };

    // Fetch immediately on mount
    fetchData();

    // Set up interval to fetch every 4 minutes (240,000 ms)
    const intervalId = setInterval(fetchData, 240000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const skeletonProps = {
    animation: "wave",
    sx: {
      animationDuration: "0.8s",
    },
  };

  // const togglePriority = () => {
  //   setIsPriority((prev) => !prev);
  //   setTaskData((prevData) => ({
  //     ...prevData,
  //     priority: !prevData.priority,
  //   }));
  // };


  const departments = [
    // { value: '', label: 'Select Department', disabled: true },
    { value: 'security', label: 'Security' },
    { value: 'housekeeping', label: 'HouseKeeping' },
    { value: 'maintainence', label: 'Maintainence' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'reception', label: 'Reception' },
  ];

  const [selected, setSelected] = useState({ label: 'Department', value: '' });

  const { stats, error } = useSelector((state) => state.attendance);
  // useEffect(() => {
  //   dispatch(fetchAttendanceStats());

  //   const interval = setInterval(() => {
  //     dispatch(fetchAttendanceStats());
  //   }, 300000);

  //   return () => clearInterval(interval);
  // }, [dispatch]);

  const occupancyData = [
    { id: 0, value: 60, label: "Occupied", color: "#252941" },
    { id: 1, value: 30, label: "Vacant", color: "#8094D4" },
    { id: 2, value: 10, label: "Maintainence", color: "#6B46C1" },
  ];

  const staffStatus = [
    { id: 0, value: 45, label: "Busy", color: "#252941" },
    { id: 1, value: 35, label: "Vacant", color: "#8094D4" },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);

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
      value: stats.totalPresent || 0,
      label: 'Present',
      color: '#252941',
    },
    {
      id: 1,
      value: stats.totalCrew - stats.totalPresent || 0,
      label: 'Absent',
      color: '#8094D4',
    },
  ];


  // const sampleInOutData = {
  //   xAxis: [
  //     {
  //       data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  //       scaleType: "band",
  //       categoryGapRatio: 0.5,
  //     },
  //   ],
  //   series: [
  //     {
  //       id: "checkin",
  //       type: "bar",
  //       data: [40, 92, 85, 60, 58, 60, 90],
  //       color: "#8094D4",
  //       label: "Check-in",

  //     },
  //     {
  //       id: "checkout",
  //       type: "bar",
  //       data: [70, 40, 49, 25, 89, 50, 70],
  //       color: "#2A2AA9",
  //       label: "Check-out",

  //     },
  //   ],
  // };
  // const [inOutData, setInOutData] = useState(sampleInOutData);

  // const [sliderValue, setSliderValue] = useState([0, 6]);



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


  // useEffect(() => {
  //   const currentDayIndex = getCurrentDayIndex();
  //   const rotatedData = rotateWeeklyData(sampleInOutData, currentDayIndex);
  //   setInOutData(rotatedData);


  //   setSliderValue([0, 6]);
  // }, []);




  // const handleSliderChange = (e, newValue) => {
  //   setSliderValue(newValue); // Dynamically update slider range
  // };
  // const filteredData = {
  //   xAxis: [inOutData.xAxis[0].data.slice(sliderValue[0], sliderValue[1] + 1)],
  //   series: inOutData.series.map((s) => ({
  //     ...s,
  //     data: s.data.slice(sliderValue[0], sliderValue[1] + 1),
  //   })),
  // };



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
    // console.log(taskData);
    setSelected(dept);
    setTaskData((prevData) => ({
      ...prevData,
      department: dept.value,
    }));
    setIsDropdownOpen(false);
  };
  // useEffect(() => {
  //   console.log("Updated taskData:", taskData);
  // }, [taskData]);

  // localStorage.setItem('accessToken',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NTc4MzMzLCJpYXQiOjE3MzE5ODYzMzMsImp0aSI6IjMxNjk0NTQzNWIzYTQ0MDBhM2MxOGE5M2UzZTk5NTQ0IiwidXNlcl9pZCI6NzF9.Dyl7m7KmXCrMvqbPo31t9q7wWcYgLHCNi9SNO6SPfrY")

  // const dataToSend = {
  //   title,
  //   description,
  //   department,
  //   // priority,
  // };

  //   try {
  //     const response = await dispatch(createTask(taskData));
  //     // console.log(response.data);
  //     if (response.data.status === 'success') {
  //       alert('Task created successfully');
  //     } else {
  //       alert('Failed to create task: ' + response.data.message);
  //     }
  //   } catch (error) {
  //     alert('An error occurred: ' + error.message);
  //   }
  // };
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
      await dispatch(
        createTask({
          title: taskTitle.trim(),
          description: taskDescription.trim(),
          department: selected.value,
          priority: selectedPriority
        })
      ).unwrap();

      setTaskTitle("");
      setTaskDescription("");
      setSelected({ label: "Select Department", value: "" });

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
    setSnackbar({ ...snackbar, open: false });
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
      await dispatch(createAnnouncement(announcementData)).unwrap();
      setShowAnnouncementBox(false);
      setSnackbar({
        open: true,
        message: "Announcement created successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error || "Failed to create announcement",
        severity: "error",
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
        severity: "success"
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
                    </div>

                    <div className="flex-1 min-w-[250px]">
                      <h3 className="font-medium mb-2 text-center">
                        Staff Attendance
                      </h3>

                      {/* {staffAttendanceData.total_present === 0 ? (
                        <div className="flex items-center justify-center h-[180px] text-gray-500">
                          No Data Available
                        </div> */}
                      {loading ? (
                        <p>Loading...</p>
                      ) : error ? (
                        <p className="text-red-500 text-center">No Data Available</p>
                      ) : (
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

                            }
                          }}
                        />
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
              {loading ? (
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
          <div className="bg-white rounded-xl shadow-lg min-h-[384px] w-full p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Revenue (Hours {revenueRange[0]} - {revenueRange[1]})
            </h2>
            <Box sx={{ width: "100%", mb: 4 }}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={250}
                  {...skeletonProps}
                />
              ) : (
                <LineChart
                  xAxis={revenueData.xAxis}
                  series={revenueData.series}
                  height={250}
                  margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
                  sx={{
                    ".MuiLineElement-root": {
                      strokeWidth: 2,
                    },
                  }}
                />
              )}
            </Box>
            <Box sx={{ width: "100%", px: 2 }}>
              <Slider
                value={revenueRange}
                onChange={handleRevenueRangeChange}
                valueLabelDisplay="auto"
                step={1}
                marks={marks}
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
        </div>
        {/* Second Column */}
        <div className="space-y-5">

          <div className="w-full ">
            <div className="bg-white  h-[50%] p-4 pr-6 pl-6 shadow rounded-lg">
              <form className="flex flex-col gap-4" onSubmit={handleAssign}>
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Task Assignment</h2>
                  {/* <div
                  className={`cursor-pointer ${isPriority ? 'text-gold' : 'text-gray-200'}`}
                  onClick={togglePriority}
                >
                  {isPriority ? (
                    <FaStar size={25} color="gold" />
                  ) : (
                    // <FaRegStar size={25} color="gray" />
                    <p className="text-gray-400">Mark Priority</p>
                  )}

                </div> */}
                  <IconButton
                    onClick={handleShowTaskAssignment}
                    size="small"
                    className="text-gray-600"
                  >
                    <BsThreeDots />
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
                  <div className="relative lg:w-48 w-full">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${selected.value ? "text-black" : "text-gray-400"
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
                        {departments.map((dept, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSelect(dept)}
                            disabled={dept.disabled}
                            className={`w-full text-left px-4 py-2 ${dept.disabled
                              ? "text-gray-400 cursor-default"
                              : "text-black hover:bg-gray-100"
                              }`}
                          >
                            {dept.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative w-full lg:w-40">
                    <button
                      type="button"
                      onClick={() => setPriorityDropdownOpen(!isPriorityDropdownOpen)}
                      className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${selectedPriority ? "text-black" : "text-gray-400"
                        } focus:outline-none flex justify-between items-center`}
                    >
                      {selectedPriority || " Priority"}
                      {isPriorityDropdownOpen ? (
                        <FaChevronUp className="text-gray-600" />
                      ) : (
                        <FaChevronDown className="text-gray-600" />
                      )}
                    </button>

                    {isPriorityDropdownOpen && (
                      <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                        {["High", "Medium", "Low"].map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => {
                              setSelectedPriority(priority);
                              setPriorityDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${priority === "High" ? "bg-red-500" :
                              priority === "Medium" ? "bg-yellow-500" :
                                "bg-green-500"
                              }`}></span>
                            {priority}
                          </button>
                        ))}
                      </div>
                    )}
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
                    className="h-9  w-full  bg-[#3A426F] font-Montserrat font-bold rounded-xl text-white  shadow-xl"
                  >
                    {Taskloading ? "Assigning..." : "Assign"}
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
          >
            <MTaskAssignment onClose={() => setShowTaskAssignment(false)} />
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
    </section>
  )
}

export default MDashboard;