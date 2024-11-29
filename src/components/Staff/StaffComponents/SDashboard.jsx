import { useState, useEffect, React,useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, Typography, Paper, Container, Box, Skeleton,Snackbar,Alert ,Slider } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { getStaffLeaveHistory,selectLeaveHistory,selectFetchHistoryError,selectFetchHistoryLoading } from '../../../redux/slices/StaffLeaveSlice';
import { getAttendanceStats,selectAttendanceStats,selectStatsLoading,selectStatsError } from '../../../redux/slices/StaffAttendanceSlice';
import { fetchAnnouncements, selectAllAnnouncements, selectAnnouncementsError, selectAnnouncementsLoading,selectPagination,appendAnnouncements,setPagination } from '../../../redux/slices/AnnouncementSlice';
import { selectDailyStats,selectLoading,selectError,fetchStaffPerformance,selectStaffPerformance } from '../../../redux/slices/StaffPerformanceSlice';



const SDashboard = () => {
  const dispatch = useDispatch();
  const performance = useSelector(selectDailyStats);
  const performanceloading = useSelector(selectLoading);
  const performanceError = useSelector(selectError);
  // Select announcements, loading, and error states from the store
  const announcements = useSelector(selectAllAnnouncements);
  const AnnLoading = useSelector(selectAnnouncementsLoading);
  const AnnError = useSelector(selectAnnouncementsError);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); 
  const today = new Date();
  const [loading, setLoading] = useState(true);
  // const {
  //   fetchHistoryLoading,
  //   fetchHistoryError,
  //   leaveHistory,
  // } = useSelector((state) => state.leave);
  // const {
  //   attendanceStats,
  //   statsLoading,
  //   statsError
  // } = useSelector((state) => state.attendance)
  // const leaveStatus = useSelector((state) => state.leave.leaveStatus);
const leaveHistory=useSelector(selectLeaveHistory);
const fetchHistoryError=useSelector(selectFetchHistoryError);
const fetchHistoryLoading=useSelector(selectFetchHistoryLoading);
  // Fetch leave history on initial mount
  const attendanceStats = useSelector(selectAttendanceStats);
  const statsLoading = useSelector(selectStatsLoading);
  const statsError = useSelector(selectStatsError);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // const isOffline = useRef(false);
  // useEffect(() => {
  
  // //   if (navigator.onLine==='false') {
  // //     setSnackbarMessage('No internet connection. Please check your network.');
  // //    setSnackbarSeverity('error');
  // //   setSnackbarOpen(true);
  // //      // Mark as offline
  // //     return;
  // //   }
  // // else{
    
  
  //   if (((AnnError || statsError))?.status === 429) {
  //     setSnackbarMessage('Too many requests. Please try again later.');
  //   }  if (AnnError) {
  //     setSnackbarMessage(AnnError.message || 'Announcements failed to load.');
  //   }  if (statsError ) {
  //     setSnackbarMessage(statsError.message || 'Attendance Statistics failed to load.');
  //   }
  //   // else {
  //   //   setSnackbarMessage('An unexpected error occurred.');
  //   // }
  
  //   setSnackbarSeverity('error');
  //   setSnackbarOpen(true);
  // // }
  // }, [AnnError, statsError]);

  useEffect(() => {
    // Function to fetch announcements
    const fetchData = () => {
      dispatch(fetchAnnouncements());
      dispatch(fetchStaffPerformance());
      dispatch(getStaffLeaveHistory());
      dispatch(getAttendanceStats());
    };

    // Initial fetch on render
    fetchData();

    // Fetch every 2 minutes (120,000 ms)
    const interval = setInterval(fetchData, 120000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {

      setLoading(false);
    }, 1500);

  }, []);


  const skeletonProps = {
    animation: "wave",
    sx: {
      animationDuration: "0.8s",
    },
  };

  // const announcements = [
  //   {
  //     id: 2,
  //     title: "Fire Drill Reminder",
  //     description: "A fire drill is scheduled for all staff next Monday at 10 AM.",
  //     created_at: "2024-11-19T09:45:00.456789Z",
  //     assigned_by: "manager@hotelxyz.com (Manager)",
  //     department: "All",
  //     urgency: "urgent",
  //   },
  //   {
  //     id: 1,
  //     title: "System Maintenance",
  //     description: "The system will be under maintenance tomorrow.",
  //     created_at: "2024-11-18T21:14:23.162456Z",
  //     // "assigned_to": [
  //     //     "kfbwidfciwen544@jncnsd.com (Staff) (kitchen) (night)",
  //     //     "bjkhjbbjb@gmail.com (Staff) (maintenance) (evening)"
  //     // ],
  //     assigned_by: "cawifon795@cpaurl.com (Admin)",
  //     department: "All",
  //     urgency: "normal",
  //     // "hotel": "Hotel raj",
  //   },
  //   {
  //     id: 3,
  //     title: "Kitchen Staff Meeting",
  //     description: "Kitchen staff meeting at 4 PM in the main conference room.",
  //     created_at: "2024-11-20T14:30:12.897654Z",
  //     assigned_by: "chef@hotelxyz.com (Manager)",
  //     department: "Kitchen",
  //     urgency: "normal",
  //   },
  //   {
  //     id: 4,
  //     title: "Guest Complaint Follow-Up",
  //     description: "A guest complaint requires immediate attention by the reception staff.",
  //     created_at: "2024-11-21T11:00:32.456123Z",
  //     assigned_by: "reception@hotelxyz.com ( Reception)",
  //     department: "Reception",
  //     urgency: "urgent",
  //   },
  //   {
  //     id: 5,
  //     title: "Inventory Check",
  //     description: "Please ensure all inventory lists are updated by end of day.",
  //     created_at: "2024-11-22T17:10:45.123789Z",
  //     assigned_by: "stockmanager@hotelxyz.com (Manager)",
  //     department: "Maintenance",
  //     urgency: "urgent",
  //   },
  //   {
  //     id: 6,
  //     title: "New Policy Update",
  //     description: "A new policy regarding overtime has been published. Please review.",
  //     created_at: "2024-11-23T10:05:15.654321Z",
  //     assigned_by: "hr@hotelxyz.com (Manager)",
  //     department: "All",
  //     urgency: "normal",
  //   }
  // ];
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState('https://hotelcrew-1.onrender.com/api/taskassignment/announcements/?page=1'); // Initial URL (page 1)
  const [previousUrl, setPreviousUrl] = useState(null); // URL for previous page
  const [reachedEnd, setReachedEnd] = useState(false); // Flag to check if we have reached the end


  const loadMoreAnnouncements = (url) => {
    if (!AnnLoading && url) {
      dispatch(fetchAnnouncements(url))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            // Update the URLs based on the response
            setNextUrl(response.payload.next); // URL for next set of announcements
            setPreviousUrl(response.payload.previous); // URL for previous set of announcements

            // If there is no 'next' URL, it means we've reached the end of the list
            if (!response.payload.next) {
              setReachedEnd(true); // Mark that the end is reached
            }
             dispatch(appendAnnouncements(results));

          // Update the pagination state
          dispatch(setPagination({ next, previous, count }));
        
          }
        });
        // dispatch(appendAnnouncements(response.payload.announcements));
        // dispatch(setNextUrl(response.payload.next)); // Update next URL
        // dispatch(setPreviousUrl(response.payload.previous));
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // If user scrolls to the bottom, load more announcements
    if (scrollHeight === scrollTop + clientHeight && !reachedEnd) {
      loadMoreAnnouncements(nextUrl);
      setPage(2);
    }

    // If user scrolls to the top, load previous announcements
    if (scrollTop === 0 && previousUrl) {
      loadMoreAnnouncements(previousUrl);
    }
  };


  // const demoLeave = [
  //   {
  //     id: 1,
  //     leave_type: 'Sick',
  //     description: 'Annual Leave Request for vacation plannig',
  //     from_date: "2024-11-20",
  //     to_date: "2024-11-24",
  //     created_at: "2024-11-15",
  //     status: "Pending"

  //   },
  //   {
  //     id: 2,
  //     leave_type: 'Sick',
  //     description: 'Annual Leave Request for vacation plannig',
  //     from_date: "2024-11-20",
  //     to_date: "2024-11-23",
  //     created_at: "2024-11-15",
  //     status: "Pending"
  //   },
  //   {
  //     id: 3,
  //     leave_type: 'Sick',
  //     description: 'Annual Leave Request for vacation plannig',
  //     from_date: "2024-11-25",
  //     to_date: "2024-11-30",
  //     created_at: "2024-11-15",
  //     status: "Pending"
  //   }
  // ]


  // const averageDurations = demoTasks.map(task => task.averageDuration);

  // const totalDays = 300;
  // const presentDays = 280;
  // const absentDays = totalDays - presentDays;
  // const presentPercentage = ((presentDays / totalDays) * 100).toFixed(2);
  // const AttendanceData = [
  //   { name: "Present", value: presentDays, label: "Present", color: "#2A2AA9" },
  //   { name: "Absent", value: absentDays, label: "Absent", color: " #A1B7FF" },

  // ];

  const [AttendanceData, setAttendanceData] = useState([]);
  const [presentPercentage, setPresentPercentage] = useState("0.00");
  const totalDays = attendanceStats?.total_days_up_to_today || 0;


  useEffect(() => {
    if (attendanceStats) {
      const presentDays = attendanceStats?.days_present || 0;
      const leaveDays = attendanceStats?.leaves || 0;
      const absentDays = totalDays - presentDays - leaveDays;

      const presentPercent = totalDays > 0
        ? ((presentDays / totalDays) * 100).toFixed(2)
        : "0.00";

      const data = [
        { name: "Present", value: presentDays, label: "Present", color: "#2A2AA9" },
        { name: "Absent", value: absentDays, label: "Absent", color: "#A1B7FF" },
        { name: "Leave", value: leaveDays, label: "Leave", color: "#FFB700" },
      ];

      setPresentPercentage(presentPercent);
      setAttendanceData(data);
    }
  }, [attendanceStats, totalDays]);


  // const totalDays = attendanceStats?.total_days_up_to_today || 0;
  // console.log("tot",totalDays)
  // const presentDays = attendanceStats?.days_present || 0;
  // const leaveDays = attendanceStats?.leaves || 0;
  // console.log("ll",leaveDays)
  // const absentDays = totalDays - presentDays - leaveDays; // Remaining days are absences

  // const presentPercentage = ((presentDays / totalDays) * 100).toFixed(2);
  // const AttendanceData = [
  //   { name: 'Present', value: presentDays, label: 'Present', color: '#2A2AA9' },
  //   { name: 'Absent', value: absentDays, label: 'Absent', color: '#A1B7FF' },
  //   { name: 'Leave', value: leaveDays, label: 'Leave', color: '#FFB700' },
  // ];
  // console.log("Attendance Stats:", attendanceStats);
  // console.log("Attendance Data:", AttendanceData);


  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case "Urgent":
        return "text-red-500 uppercase font-semibold";
      case "Normal":
        return "hidden";

    }
  };
  const formattedDates = performance.map(stat => {
    const date = new Date(stat.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // Example: "Nov 26"
  });
  const dates = performance.map(stat => new Date(stat.date));
  const performanceValues = performance.map(stat => stat.performance_percentage);
  console.log('Performance Data:', performance);
  console.log('Dates:', formattedDates);
  console.log('Performance Percentages:', performanceValues);

  return (
    <section className=" h-screen py-2 mx-4 px-0 font-Montserrat ">
      <h2 className="text-[#252941] text-3xl  my-3 pl-8 ml-5 font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 h-[96%] xl:grid-cols-[70%,30%] gap-5 p-3 ">

        {/* First Column */}
        <div className="space-y-5 h-full">

          <div className="bg-white w-full pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
            <h2 className="text-lg sm:text-xl font-semibold text-left">Your Performance</h2>
            {performanceloading ? (
              <div className='ml-4 mb-2'>
                <Skeleton variant="rectangular"
                  width="95%"
                  height={380}
                  {...skeletonProps}
                />
              </div>
            ) : (

              // <Card>
      // <CardContent>
       
        <div style={{ width: '100%', height: 410 }}>
          <LineChart
            xAxis={[{
              data: dates,
              scaleType: 'time',
              tickLabelStyle: {
                angle: 45,
                textAnchor: 'start',
                fontSize: 12
              },
              // tickFormatter: (value) => {
              //   const date = new Date(value);
              //   return date.toLocaleDateString('en-US', { 
              //     month: 'short', 
              //     day: 'numeric'
              //   });
              // }
            }]}
            yAxis={[{
              min: 0,
              max: 100,
              label: 'Performance (%)'
            }]}
            series={[
              {
                data: performanceValues,
                label: 'Performance',
                color: '#2196f3',
                showInLegend: false
                
              }
            ]}
            height={400}
            margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
            slotProps={{
              legend: {
                hidden: true
              }}
            }
          />
        </div>
      // </CardContent>
    // </Card>
            )}
          </div>
          <div className="flex lg:flex-row flex-col gap-4">
            <div className="bg-white w-full  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
              <h2 className="text-lg sm:text-xl font-semibold text-left">Your Attendance</h2>
              {statsLoading ? (
                <div className='ml-4 mb-2'>
                  <Skeleton
                    variant="rectangular"
                    width="95%"
                    height="280px"
                    {...skeletonProps}
                  />
                </div>
              ) : (
                <>
                  {AttendanceData && AttendanceData.length > 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        position: 'relative',
                      }}
                    >

                      <ResponsiveContainer width="100%" height={230}>
                        <PieChart>
                          <Pie
                            data={AttendanceData}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            innerRadius="55%"
                            paddingAngle={5}
                            labelLine={false}
                          >
                            {AttendanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip className="z-20 relative."/>
                        </PieChart>
                      </ResponsiveContainer>

                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '51%',
                          transform: 'translate(-50%, -50%)',
                          // Ensure it's on top of the Pie chart
                        }}
                      >
                        <h2 className="text-[20px] mt-0 z-10  font-semibold">
                          {`${presentPercentage}%`}
                        </h2>

                      </Box>
                    </Box>
                  ) : (
                    <div>Data not available{AttendanceData.total_days_up_to_today}</div>
                  )}

                  {AttendanceData && AttendanceData.length > 0 && (
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 text-center">
                      Attendance: {AttendanceData[0]?.value || 0}/{totalDays}
                    </h2>
                  )}
                </>
              )}

            </div>
            <div className="bg-white w-full h-[315px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
              <h2 className="text-lg sm:text-xl font-semibold mb-3">Leave Request Status</h2>
              {fetchHistoryLoading ? (
                <div className='ml-4 mb-2'>
                  <Skeleton
                    variant="rectangular"
                    width="95%"
                    height="280px"
                    {...skeletonProps}
                  />
                </div>
              ) : (
                <div className='h-[80%] my-2 overflow-y-auto flex flex-col scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
                  {leaveHistory.map((leave) => {
                    // const fromDate = new Date(leave.from_date);
                    // const toDate = new Date(leave.to_date);
                    // const durationInMillis = toDate - fromDate;
                    // const durationInDays = durationInMillis / (1000 * 3600 * 24) + 1;
                    return (
                      <div key={leave.id} className='bg-[#e6efe9] font-sans my-4 p-3 rounded-lg flex flex-col '>
                        {/* <p className="text-md text-gray-500">{leave.created_at}</p> */}
                        <p className="text-md ">{leave.description}</p>

                        <p className="text-md text-gray-700">Type: {leave.leave_type}</p>
                        <p className="text-md text-gray-700">Date: {leave.from_date} to {leave.to_date}</p>
                        <p className="text-md text-gray-700">Duration: {leave.duration} days</p>
                        <p className=' mt-2 text-md font-semibold'>Status: <span className={`text-white  px-2 py-1 rounded ${leave.status === "Approved"
                            ? "bg-green-500"
                            : leave.status === "Rejected"
                              ? "bg-red-500"
                              : "bg-gray-300"
                          }`}
                        >{leave.status}</span> </p>
                      </div>
                    )
                  })}

                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-5 h-[790px]  ">
          <div className='bg-white    w-full mb-4 h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pt-4 pb-1 pr-6 pl-6 rounded-lg shadow'>
            
            {AnnLoading && page === 1? (
              <div className='ml-4 mb-2'>
                <Skeleton
                  variant="rectangular"
                  width="95%"
                  height="700px"
                  {...skeletonProps}
                />
              </div>
            ) : announcements.length === 0 ? (
              <>
              <h2 className="text-lg sm:text-xl font-semibold text-left mt-3 mb-4">Announcements {announcements.count}</h2>
              <div className="text-center mt-10 text-gray-500">
                <p>No announcements available.</p>
              </div>
              </>
              ) : (
                <>
                <h2 className="text-lg sm:text-xl font-semibold text-left mt-3 mb-4">Announcements {announcements.count}</h2>
              <div onScroll={handleScroll} className='h-[90%] my-4 overflow-y-auto flex flex-col scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent transition-opacity duration-300 '>
                {announcements.map((announcement) => {
                  // Format the created_at date
                  const createdDate = new Date(announcement.created_at);
                  const formattedDate = createdDate.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                  const formattedTime = createdDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                  return (
                    <div key={announcement.id} className='bg-[#e6efe9] my-4 p-3 rounded-lg flex flex-col '>
                      <h2 className="text-lg font-semibold text-gray-800">{announcement.title}</h2>
                      <p className="text-gray-600 mt-2">{announcement.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        <strong>Created At:</strong> {formattedDate} , {formattedTime}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Assigned By:</strong> {announcement.assigned_by}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Department:</strong> {announcement.department}
                      </p>
                      <p className={`text-sm mt-3 ${getUrgencyClass(announcement.urgency)}`}>
                        {announcement.urgency}
                      </p>
                    </div>
                  )
                })}
              </div>
            </>
            )}
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success"
          variant="filled"
          sx={{ 
            width: '100%',
            '& .MuiAlert-filledSuccess': {
              backgroundColor: '#4CAF50'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
    </section>
  )
}

export default SDashboard;
//announcement pagination
//error handling
//staff performance
//task testing