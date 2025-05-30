import { useState, useEffect, React,useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, Typography, Paper, Container, Box, Skeleton,Snackbar,Alert ,Slider } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { getStaffLeaveHistory,selectLeaveHistory,selectFetchHistoryError,selectFetchHistoryLoading } from '../../../redux/slices/StaffLeaveSlice';
import { getAttendanceStats,selectAttendanceStats,selectStatsLoading,selectStatsError } from '../../../redux/slices/StaffOnlyAttendanceSlice';
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
  const leaveHistory=useSelector(selectLeaveHistory);
const fetchHistoryError=useSelector(selectFetchHistoryError);
const fetchHistoryLoading=useSelector(selectFetchHistoryLoading);
  
  const attendanceStats = useSelector(selectAttendanceStats);
  const statsLoading = useSelector(selectStatsLoading);
  const statsError = useSelector(selectStatsError);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchAnnouncements());
      dispatch(fetchStaffPerformance());
      dispatch(getStaffLeaveHistory());
      dispatch(getAttendanceStats());
    };

    fetchData();
    const interval = setInterval(fetchData, 120000);

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
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState('https://hotelcrew-1.onrender.com/api/taskassignment/announcements/?page=1');
  const [previousUrl, setPreviousUrl] = useState(null); 
  const [reachedEnd, setReachedEnd] = useState(false); 


  const loadMoreAnnouncements = (url) => {
    if (!AnnLoading && url) {
      dispatch(fetchAnnouncements(url))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            
            setNextUrl(response.payload.next); 
            setPreviousUrl(response.payload.previous);

            
            if (!response.payload.next) {
              setReachedEnd(true); 
            }
             dispatch(appendAnnouncements(results));

          
          dispatch(setPagination({ next, previous, count }));
        
          }
        });
       }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    
    if (scrollHeight === scrollTop + clientHeight && !reachedEnd) {
      loadMoreAnnouncements(nextUrl);
      setPage(2);
    }

    
    if (scrollTop === 0 && previousUrl) {
      loadMoreAnnouncements(previousUrl);
    }
  };




  const [AttendanceData, setAttendanceData] = useState([]);
  const [presentPercentage, setPresentPercentage] = useState("0.00");
  const totalDays = attendanceStats?.total_days_up_to_today || 0;


  // useEffect(() => {
  //   if (attendanceStats) {
  //     const presentDays = attendanceStats?.days_present || 0;
  //     const leaveDays = attendanceStats?.leaves || 0;
  //     const absentDays = totalDays - presentDays - leaveDays;

  //     const presentPercent = totalDays > 0
  //       ? ((presentDays / totalDays) * 100).toFixed(2)
  //       : "0.00";

  //     const data = [
  //       { name: "Present", value: presentDays, label: "Present", color: "#2A2AA9" },
  //       { name: "Absent", value: absentDays, label: "Absent", color: "#A1B7FF" },
  //       { name: "Leave", value: leaveDays, label: "Leave", color: "#FFB700" },
  //     ];

  //     setPresentPercentage(presentPercent);
  //     setAttendanceData(data);
  //   }
  // }, [attendanceStats, totalDays]);
  // Update the useEffect for attendance data

useEffect(() => {
  if (attendanceStats) {
    console.log('Attendance Statsjhjhj:', attendanceStats);
    const presentDays = attendanceStats.days_present;
    const leaveDays = attendanceStats.leaves ;
    const absentDays = attendanceStats.total_days_up_to_today 
      ? attendanceStats.total_days_up_to_today - presentDays - leaveDays 
      : 0;
      console.log('Present Days:', presentDays);
    console.log('Leave Days:', leaveDays);  
    console.log('Absent Days:', absentDays);

    const presentPercent = attendanceStats?.total_days_up_to_today > 0
      ? ((presentDays / attendanceStats.total_days_up_to_today) * 100).toFixed(2)
      : "0.00";

    const data = [
      { name: "Present", value: presentDays, label: "Present", color: "#2A2AA9" },
      { name: "Absent", value: absentDays, label: "Absent", color: "#A1B7FF" },
      { name: "Leave", value: leaveDays, label: "Leave", color: "#FFB700" },
    ];

    setPresentPercentage(presentPercent);
    setAttendanceData(data);
  }
  else{
    console.log('Attendance Stats is null or undefined');
  }
}, [attendanceStats]);1



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
   ('Performance Data:', performance);
   ('Dates:', formattedDates);
   ('Performance Percentages:', performanceValues);

  return (
    <section className=" h-screen py-2 mx-4 px-0 font-Montserrat ">
      <h2 className="text-[#252941] text-3xl  my-3 pl-8 ml-5 font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 h-[96%] xl:grid-cols-[70%,30%] gap-5 p-3 ">

       
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
                    height="230px"
                    {...skeletonProps}
                  />
                </div>
              ) : (
                <div className='h-[80%] my-2 overflow-y-auto flex flex-col scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
                  {leaveHistory.map((leave) => {
                     return (
                      <div key={leave.id} className='bg-[#e6eef9] font-sans my-4 p-3 rounded-lg flex flex-col '>
                        
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
                    <div key={announcement.id} className='bg-[#e6eef9] my-4 p-3 rounded-lg flex flex-col '>
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
