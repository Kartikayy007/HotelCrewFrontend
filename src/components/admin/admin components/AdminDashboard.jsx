import React, {useState, useEffect} from "react";
import {PieChart} from "@mui/x-charts/PieChart";
import {LineChart} from "@mui/x-charts/LineChart";
import {BarChart} from "@mui/x-charts/BarChart";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import {Dialog, TextField, Button} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import {CircularProgress} from "@mui/material";

function AdminDashboard() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [performanceRange, setPerformanceRange] = useState([
    0,
    currentHour || 1,
  ]);
  const [revenueRange, setRevenueRange] = useState([0, currentHour || 1]);
  const [timeData, setTimeData] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // Simulate loading delay
    setTimeout(() => {
      setTimeData(generateTimeData(currentHour));
      setLoading(false);
    }, 1500);

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

  const occupancyData = [
    {id: 0, value: 65, label: "Occupied", color: "#252941"},
    {id: 1, value: 135, label: "Vacant", color: "#8094D4"},
    {id: 2, value: 110, label: "On Break", color: "#6B46C1"},
  ];

  const staffStatus = [
    {id: 0, value: 45, label: "Busy", color: "#252941"},
    {id: 1, value: 35, label: "Vacant", color: "#8094D4"},
  ];

  const staffAttendance = [
    {id: 0, value: 60, label: "Present", color: "#252941"},
    {id: 1, value: 40, label: "Absent", color: "#8094D4"},
    {id: 2, value: 10, label: "On Leave", color: "#6B46C1"},
  ];

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

  const departmentData = {
    xAxis: [
      {
        id: "departments",
        data: [
          "Front Desk",
          "Housekeeping",
          "Kitchen",
          "Maintenance",
          "Security",
        ],
        scaleType: "band",
      },
    ],
    series: [
      {
        type: "bar",
        data: [12, 25, 18, 8, 15],
        color: "#4C51BF",
      },
    ],
  };

  const handlePerformanceRangeChange = (event, newValue) => {
    setPerformanceRange(newValue);
  };

  const handleRevenueRangeChange = (event, newValue) => {
    setRevenueRange(newValue);
  };

  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const [announcements, setAnnouncements] = useState([
    // {
    //   id: 1,
    //   title: "Hotel Maintenance",
    //   description: "Pool maintenance scheduled for tomorrow 10 AM - 2 PM",
    //   date: "2024-03-20 09:00",
    // },
    // {
    //   id: 2,
    //   title: "Staff Meeting",
    //   description: "Monthly staff meeting in Conference Room A",
    //   date: "2024-03-19 14:00",
    // },
  ]);
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

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.description) {
      setAnnouncements([
        {
          id: Date.now(),
          ...newAnnouncement,
          date: new Date().toLocaleString(),
        },
        ...announcements,
      ]);
      handleModalClose();
    }
  };

  const handleViewAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleViewClose = () => {
    setSelectedAnnouncement(null);
  };


  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        {greeting}
      </h1>

      <div className="flex flex-col xl:flex-row justify-around gap-6">
        <div className="flex flex-col space-y-6 w-full xl:w-4/6">
          <div className="bg-white rounded-lg shadow min-h-[320px] w-full p-4">
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
                      <PieChart
                        series={[
                          {
                            data: staffStatus,
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
                              fontSize: 15,
                              fontWeight: 500,
                            },
                          },
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-[250px]">
                      <h3 className="font-medium mb-2 text-center">
                        Staff Attendance
                      </h3>
                      <PieChart
                        series={[
                          {
                            data: staffAttendance,
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
                            itemGap: 10,
                            labelStyle: {
                              fontSize: 13,
                              fontWeight: 500,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow min-h-[384px] w-full p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Revenue (Hours {revenueRange[0]} - {revenueRange[1]})
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

          <div className="bg-white rounded-lg shadow min-h-[416px] w-full p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Staff Metrics (Hours {performanceRange[0]} - {performanceRange[1]}
              )
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
            <Box sx={{width: "100%", px: 2}}>
              <Slider
                value={performanceRange}
                onChange={handlePerformanceRangeChange}
                valueLabelDisplay="auto"
                step={1}
                marks={marks}
                min={0}
                max={currentHour || 1}
              />
            </Box>
          </div>
        </div>

        <div className="flex flex-col space-y-6 w-full xl:w-[30%]">
          <div className="bg-white rounded-lg shadow min-h-[416px] w-full p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Staff Database
            </h2>
            <Box sx={{position: "relative", height: 340}}>
              {loading ? (
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

          <div className="bg-white rounded-lg shadow w-full p-4 flex flex-col h-[calc(66vh)] min-h-[765px]">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Announcements
            </h2>
            <div className="flex-1 overflow-y-auto mb-4">
              {loading ? (
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
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={60}
                    {...skeletonProps}
                  />
                </div>
              ) : (
                <div className="overflow-scroll">
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="border-b border-gray-200 py-4 last:border-0 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleViewAnnouncement(announcement)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">
                            {announcement.title}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {announcement.date}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {announcement.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center mt-72 h-full text-gray-500">
                      No announcements available
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="mt-auto">
              <Button
                variant="contained"
                fullWidth
                onClick={handleModalOpen}
                sx={{
                  backgroundColor: "#3A426F",
                  "&:hover": {backgroundColor: "#3A426F"},
                }}
              >
                Create Announcement
              </Button>
            </div>

            <Dialog
              open={isModalOpen}
              onClose={handleModalClose}
              maxWidth="sm"
              fullWidth
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Create Announcement
                </h2>
                <div className="space-y-4">
                  <TextField
                    label="Title"
                    fullWidth
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        title: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={newAnnouncement.description}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        description: e.target.value,
                      })
                    }
                  />
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outlined"
                      onClick={handleModalClose}
                      sx={{borderColor: "#3A426F", color: "#3A426F"}}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCreateAnnouncement}
                      sx={{
                        backgroundColor: "#3A426F",
                        "&:hover": {backgroundColor: "#3A426F"},
                      }}
                    >
                      Post Announcement
                    </Button>
                  </div>
                </div>
              </div>
            </Dialog>

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
                  <div className="flex justify-end pt-4">
                    <Button
                      variant="contained"
                      onClick={handleViewClose}
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
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
