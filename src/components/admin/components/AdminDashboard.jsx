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
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import {useDispatch, useSelector} from "react-redux";
import {fetchAttendanceStats} from "../../../redux/slices/AdminAttendanceSlice";
import {FaChevronUp, FaChevronDown} from "react-icons/fa";
import {BsThreeDots} from "react-icons/bs";
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
} from "../../../redux/slices/StaffSlice";
import StaffMetrics from "../../common/StaffMetrics";
import RevenueChart from "../../common/RevenueChart";
import LoadingAnimation from "../../common/LoadingAnimation";

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
  const [revenueRange, setRevenueRange] = useState([0, currentHour || 1]);
  const [timeData, setTimeData] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selected, setSelected] = useState({
    label: "Department",
    value: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const departments = useSelector(selectDepartments);

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

    setTimeData(generateTimeData(currentHour));
    setLoading(false);

    return () => clearInterval(interval);
  }, [currentHour]);

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

  const occupancyData = [
    {id: 0, value: 65, label: "Occupied", color: "#252941"},
    {id: 1, value: 135, label: "Vacant", color: "#8094D4"},
    {id: 2, value: 110, label: "On Break", color: "#6B46C1"},
  ];

  const tasks = useSelector(selectAllTasks);
  const staffPerDepartment = useSelector(selectStaffPerDepartment);

  console.log("Staff per department:", staffPerDepartment);
  console.log("All tasks:", tasks);

  const totalStaff = Object.values(staffPerDepartment).reduce(
    (sum, count) => sum + count,
    0
  );
  console.log("Total staff count:", totalStaff);

  const busyStaffCount = tasks.filter(
    (task) => task.status === "pending" || task.status === "in-progress"
  ).length;
  console.log("Busy staff count:", busyStaffCount);

  const vacantStaffCount = Math.max(0, totalStaff - busyStaffCount);
  console.log("Vacant staff count:", vacantStaffCount);

  const staffStatus = [
    {id: 0, value: busyStaffCount, label: "Busy", color: "#252941"},
    {id: 1, value: vacantStaffCount, label: "Vacant", color: "#8094D4"},
  ];
  console.log("Pie chart data:", staffStatus);

  useEffect(() => {
    dispatch(fetchAttendanceStats());
    dispatch(fetchAttendanceStats());
  }, [dispatch]);

  const staffAttendance = [
    {
      id: 0,
      value: attendanceStats.total_present,
      label: "Present",
      color: "#252941",
    },
    {
      id: 1,
      value: attendanceStats.total_crew - attendanceStats.total_present,
      label: "Absent",
      color: "#8094D4",
    },
  ];

  const staffLoading = useSelector(selectStaffLoading);

  useEffect(() => {
    dispatch(fetchStaffData());
  }, [dispatch]);

  const departmentData = {
    xAxis: [
      {
        id: "departments",
        data: Object.keys(staffPerDepartment).map(
          (dept) => dept.charAt(0).toUpperCase() + dept.slice(1)
        ),
        scaleType: "band",
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

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const handleCreateAnnouncement = async (announcementData) => {
    try {
      setLoading(true);
      await dispatch(createAnnouncement(announcementData)).unwrap();
      setShowAnnouncementBox(false);
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
      await dispatch(
        createTask({
          title: taskTitle.trim(),
          description: taskDescription.trim(),
          department: selected.value,
          priority: selectedPriority,
        })
      ).unwrap();

      setTaskTitle("");
      setTaskDescription("");
      setSelected({label: "Department", label: "select Priority"});
      setSelectedPriority("");

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

  const [isPriorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("");

  const [showAnnouncementBox, setShowAnnouncementBox] = useState(false);

  const sortedAnnouncements = useMemo(() => {
    if (!announcements?.length) return [];

    return [...announcements].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [announcements]);

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        {greeting}
      </h1>

      <div className="flex flex-col xl:flex-row  justify-around">
        <div className="flex flex-col space-y-6 w-full xl:w-4/6">
          <div className="bg-white rounded-xl shadow-lg min-h-[320px] w-full p-4">
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
                            highlightScope: {fade: "global", highlight: "item"},
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
                                fontSize: 15,
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

          <RevenueChart />

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
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Announcements
            </h2>
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
                <div className="overflow-scroll">
                  {sortedAnnouncements.map((announcement) => (
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
                          {new Date(announcement.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-gray-600">{announcement.content}</p>
                    </div>
                  ))}
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
                        {selectedAnnouncement?.assigned_to.map(
                          (person, index) => (
                            <li key={index}>{person}</li>
                          )
                        )}
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
              <h2 className="text-lg sm:text-xl font-semibold">Assign Task</h2>
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
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() =>
                    setPriorityDropdownOpen(!isPriorityDropdownOpen)
                  }
                  className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${
                    selectedPriority ? "text-black" : "text-gray-400"
                  } focus:outline-none flex justify-between  items-center`}
                >
                  {selectedPriority || "Select Priority"}
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
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            priority === "High"
                              ? "bg-red-500"
                              : priority === "Medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        ></span>
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
      >
        <AdminTaskAssignment onClose={() => setShowTaskAssignment(false)} />
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
    </section>
  );
}

export default AdminDashboard;
