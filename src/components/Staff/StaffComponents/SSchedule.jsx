import { useState, React, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown, FaChevronUp, FaPaperclip, FaCalendarAlt } from "react-icons/fa";
import { Snackbar, Skeleton, Alert } from "@mui/material";
import { staffLeaveApply,resetLeaveStatus, resetApplyLeaveError } from '../../../redux/slices/StaffLeaveSlice'
import { getMonthlyAttendance } from '../../../redux/slices/StaffAttendanceSlice';
import MuiAlert from "@mui/material/Alert";
// import InfoIcon from "@mui/icons-material/Info";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Dialog, Box } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import { getStaffProfile, selectStaffProfile, selectStaffProfileLoading, selectStaffProfileError, } from '../../../redux/slices/StaffProfileSlice';

const SSchedule = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectStaffProfile);
  const profileLoading = useSelector(selectStaffProfileLoading);
  const profileError = useSelector(selectStaffProfileError);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isStartDropdownOpen, setIsStartDropdownOpen] = useState(false);
  const [isEndDropdownOpen, setIsEndDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const [selectedFile, setSelectedFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  // const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);

 
  const appliedLeave = useSelector((state) => state.leave.leaveStatus);
  const applyLeaveError = useSelector((state) => state.leave.applyLeaveError);
  const leaveLoading = useSelector((state) => state.leave.applyLeaveLoading);
  useEffect(() => {
    // Auto-close Snackbar after a delay if needed
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open, setSnackbar]);

  useEffect(() => {
    setTimeout(() => {

      setLoading(false);
    }, 1500);

  }, []);

  // Add useEffect to fetch profile data
  useEffect(() => {
    dispatch(getStaffProfile());
  }, [dispatch]);

  const skeletonProps = {
    animation: "wave",
    sx: {
      animationDuration: "0.8s",
    },
  };

  const [leaveDetails, setLeaveDetails] = useState({
    from_date: "",
    to_date: "",
    reason:"",
    leave_type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (applyLeaveError) {
      if (!navigator.onLine) {
        setSnackbar({
          open: true,
          message: "No internet connection. Please check your network.",
          severity: "error"
        });
      }  if (error?.status === 429) {
        setSnackbar({
          open: true,
          message: "Too Many Requests. Please try again later.",
          severity: "error"
        });
      }
      // } else {
      //   setSnackbar({
      //     open: true,
      //     message: "From Date is required.",
      //     severity: "error"
      //   });
      // }
      dispatch(resetApplyLeaveError());
    }
    }, [applyLeaveError])

const handleSubmit = async (e) => {
  e.preventDefault();
  const { from_date, to_date, leave_type, reason } = leaveDetails;

  // Validation checks
  if (!from_date || !to_date || !leave_type || !reason) {
    setSnackbar({
      open: true,
      message: `Please fill in all required fields`,
      severity: "error"
    });
    return;
  }

  // Dispatch the leave application
  await dispatch(staffLeaveApply(leaveDetails));
};

  const monthlyAttendance = useSelector((state) => state.staffAttendance.monthlyAttendance);
  const {

    monthlyLoading,
    monthlyError,
  } = useSelector((state) => state.staffAttendance);

  useEffect(() => {
    dispatch(getMonthlyAttendance());

  }, [dispatch]);

  const [isCalendarOpen, setIsCalendarOpen] = useState(null);


  const toggleStartDropdown = () => {
    setIsStartDropdownOpen((prev) => !prev);
    if (!isStartDropdownOpen) {
      setIsEndDropdownOpen(false); // Close end date if start is opened
    }
    // if (isCalendarOpen === "endDate") {
    //   setIsCalendarOpen(null); // Close end date calendar
    //   setIsEndDropdownOpen(false); // Close end date dropdown
    // }
    // // Toggle start date calendar
    // setIsStartDropdownOpen((prev) => !prev);
    // if (!isStartDropdownOpen) {
    //   setIsCalendarOpen("startDate"); // Open the start date calendar
    // } else {
    //   setIsCalendarOpen(null); // Close the start date calendar
    // }
  };

  // const toggleStartDropdown = () => {
  //   setIsStartDropdownOpen(!isStartDropdownOpen);
  // };



  const toggleEndDropdown = () => {
    setIsEndDropdownOpen((prev) => !prev);
    if (!isEndDropdownOpen) {
      setIsStartDropdownOpen(false); // Close start date if end is opened
    }
  };

  const formatDate = (date) => date.format("YYYY-MM-DD");

  const handleStartDateChange = (date) => {
    if (!date) {
      setStartDate(null);
      return;
    }
    setStartDate(date);
    if (endDate && dayjs(date).isAfter(endDate)) {
      setEndDate(null); // Reset the end date if start date is after end date
    }
    // if (endDate && date > endDate) {
    //   setEndDate(null); // Reset the end date if it's before the new start date
    // }
    // setLeaveDetails((prev) => ({
    //   ...prev,
    //   from_date: date ? date.toLocaleDateString() : "", // Set the formatted date
    // }));
    setLeaveDetails((prev) => ({
      ...prev,
      from_date: date ? formatDate(date) : "", // Set the formatted date
    }));
    setIsStartDropdownOpen(false); // Close the dropdown
  };

  const handleEndDateChange = (date) => {
    if (!date) {
      setEndDate(null);
      return;
    }
    setEndDate(date);
   
    setLeaveDetails((prev) => ({
      ...prev,
      to_date: date ? formatDate(date) : "",
    }));
    setIsEndDropdownOpen(false); 
   
  };

 

useEffect(() => {
  if (appliedLeave) {
    setSnackbar({
      open: true,
      message: appliedLeave,
      severity: 'success'
    });
    // Reset form
    setLeaveDetails({
      from_date: '',
      to_date: '',
      leave_type: '',
      reason: ''
    });
    setStartDate(null);
    setEndDate(null);
    dispatch(resetLeaveStatus());
  }

  if (applyLeaveError) {
    setSnackbar({
      open: true,
      message: applyLeaveError || 'Failed to submit leave request',
      severity: 'error'
    });
    dispatch(resetApplyLeaveError());
  }
}, [appliedLeave, applyLeaveError, dispatch]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  // Update shiftTime function for correct shift mapping
  const shiftTime = (shift) => {
    const shiftLower = shift?.toLowerCase();
    
    switch(shiftLower) {
      case "morning":
        return "06:00 AM to 02:00 PM";
      case "evening":
      case "day": // Handle both "evening" and "day" cases
        return "02:00 PM to 10:00 PM"; 
      case "night":
        return "10:00 PM to 06:00 AM";
      default:
        return "Invalid shift";
    }
  };
  return (
    <section className=" h-screen bg-[#E6EEF9]  font-Montserrat  overflow-y-auto ">
      <h2 className="text-[#252941] text-3xl mt-5  my-3 pl-11 ml-5 font-semibold">Schedule Status</h2>
      <div className="flex flex-col justify-center xl:flex-row xl:gap-5 gap-14 p-3 ">
        <div className="space-y-5 xl:w-[40%] ">
          <div className="bg-white w-full pt-4 pb-1 pr-6 pl-6 rounded-lg shadow ">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-left">Shift Schedule</h2>
            {loading ? (
              <div className='ml-4 mb-2'>
                <Skeleton variant="rectangular"
                  width="95%"
                  height={100}
                  {...skeletonProps}
                />
              </div>
            ) : (
              // Update shift display section
              <div className='text-lg text-[#47518C] font-semibold mb-2'>
                {profileLoading ? (
                  <Skeleton variant="text" width="60%" height={30} />
                ) : profileError ? (
                  <p>Error loading shift details</p>
                ) : (
                  <>
                    <p className='capitalize'>
                      {profile?.shift ? `${profile.shift} Shift` : "No shift assigned"}
                    </p>
                    <p className=''>
                      Time: {profile?.shift ? shiftTime(profile.shift) : "Not available"}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="bg-white w-full h-[550px] pt-4 pb-1 pr-6 pl-6 rounded-lg shadow ">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-left">Attendance</h2>
            <div className='h-[90%] mb-4 overflow-y-auto rounded-lg'>
              {loading ? (
                <div className='ml-4 mb-2'>
                  <Skeleton variant="rectangular"
                    width="95%"
                    height={400}
                    {...skeletonProps}
                  />
                </div>
              ) : (
                <table className="w-[96%]  px-1 mx-auto border border-[#dcdcdc] rounded-2xl shadow  ">
                  
                  <thead>
                    <tr className="bg-[#3F4870] text-[#E6EEF9] rounded-xl">

                      <th className="px-4 py-2 text-center">Date</th>
                      <th className="px-4 py-2 text-center">Attendance</th>

                    </tr>
                  </thead>


                  <tbody>
                    {monthlyAttendance && monthlyAttendance.length > 0 ? (
                      monthlyAttendance.map((member, index) => (
                        <tr
                          // key={member.date}
                          key={index}
                          className={`px-4 py-2 ${index % 2 === 0 ? 'bg-[#F1F6FC]' : 'bg-[#DEE8FF]'
                            }`}
                        >
                          <td className="px-4 py-2 text-center">{member.date}</td>

                          <td className="px-4 py-2 text-center">
                            <button
                              className={`px-4 py-1 cursor-default rounded-full ${member.attendance ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}

                            >
                              {member.attendance ? 'Present' : 'Absent'}
                            </button>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center py-4">
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <div className='space-y-5 xl:w-[35%] gap-5 '>
          <div className="bg-white w-full lg:h-[700px] h-auto pt-4 pb-1 pr-6 pl-6 rounded-lg shadow ">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-left">Leave Request</h2>
            {loading ? (
              <div className='ml-4 mb-2'>
                <Skeleton variant="rectangular"
                  width="95%"
                  height={400}
                  {...skeletonProps}
                />
              </div>
            ) : (
              <div >

                <form className='mt-8 h-full flex flex-col gap-3' onSubmit={handleSubmit}>

                  <input
                    type="text"
                    placeholder="Specify leave type"
                    maxLength={30}
                    value={leaveDetails.leave_type}
                    name="leave_type"
                    onChange={handleChange}
                    // value={taskTitle}
                    // onChange={(e) => setTaskTitle(e.target.value)}
                    className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full focus:border-gray-300 focus:outline-none"
                  />

                  <div className="flex lg:justify-between mt-3 gap-3">


                    <div className="relative lg:w-50 w-full">

                      <button
                        type="button"

                        onClick={toggleStartDropdown}
                        className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${startDate ? "text-black" : "text-gray-400"
                          } focus:outline-none flex justify-between items-center`}
                      >
                        {startDate
                          ? `Start: ${dayjs(startDate).format("MM/DD/YYYY")}` // Format as per your needs
                          : "Start date"}
                        {isStartDropdownOpen ? (
                          <FaChevronUp className="text-gray-600" />
                        ) : (
                          <FaChevronDown className="text-gray-600" />
                        )}
                        {/* <FaCalendarAlt className="text-gray-500 h-6" /> */}
                      </button>

                      {isStartDropdownOpen && (
                        // <div className="absolute  z-50 ">
                        //   <DatePicker
                        //     selected={startDate}

                        //     onChange={handleStartDateChange}
                        //     inline
                        //     selectsStart
                        //     dateFormat="dd/MM/yyyy"
                        //     minDate={today}
                        //     startDate={startDate}
                        //     endDate={endDate}
                        //   />
                        // </div>
                        <Dialog
                          // open={!!isCalendarOpen && isCalendarOpen === "startDate"}
                          open={isStartDropdownOpen}
                          // onClose={closeCalendar} // Close the calendar if clicked outside
                          onClose={toggleStartDropdown}
                          maxWidth="xs"
                          fullWidth
                        >
                          <Box p={2} >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DateCalendar
                                value={startDate}
                                onChange={handleStartDateChange}
                                // minDate={new Date()} // Prevent selecting dates before today
                                minDate={dayjs()}
                              />
                            </LocalizationProvider>
                          </Box>
                        </Dialog>
                      )}
                    </div>


                    <div className="relative w-full lg:w-50">
                      <button
                        type="button"
                        onClick={toggleEndDropdown}
                        className={`border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full text-left ${endDate ? "text-black" : "text-gray-400"
                          } focus:outline-none flex justify-between items-center`}
                      >
                        {endDate
                          ? `End: ${dayjs(endDate).format("MM/DD/YYYY")}` // Format as per your needs
                          : "End date"}
                        {isEndDropdownOpen ? (
                          <FaChevronUp className="text-gray-600" />
                        ) : (
                          <FaChevronDown className="text-gray-600" />
                        )}
                      </button>

                      {isEndDropdownOpen && (
                        <div className="absolute  z-50 pr-4 mr-5">
                          
                          <Dialog
                            
                            open={isEndDropdownOpen}
                            // onClose={closeCalendar} // Close the calendar if clicked outside
                            onClose={toggleEndDropdown}
                            maxWidth="xs"
                            fullWidth
                          >
                            <Box p={2}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                  value={endDate}
                                  onChange={handleEndDateChange}
                                  minDate={startDate || dayjs()} // Prevent selecting dates before the start date
                                />
                              </LocalizationProvider>
                            </Box>
                          </Dialog>
                        </div>
                      )}
                    </div>

                  </div>
                  {/* <div className="flex flex-col gap-4 mt-3">
                  <button
                    type="button"
                    onClick={handleFileButtonClick}
                    className="border border-gray-200 rounded-xl bg-[#e6eef9] p-2 w-full  text-black focus:outline-none flex justify-between items-center gap-4"
                  >
                    <span className="text-gray-500">{fileName|| 'Attach File'}
                      {/* {fileName ? (
                        <>
                          {fileName} {/* Display the file name */}
                  {/* <button
                            type="button"
                            onClick={handleRemoveFile} // Remove the file when clicked
                            className="text-red-500 ml-2"
                          >
                            X
                          </button> */}
                  {/* </> */}
                  {/* ) : ( */}
                  {/* 'Attach File' */}
                  {/* )} */}
                  {/* </span>
                    {fileName? (<button
                            type="button"
                            onClick={handleRemoveFile} // Remove the file when clicked
                            className="text-gray-500 ml-2 pr-2" >
                              X
                          </button>
                    ):(<FaPaperclip className="text-gray-500 h-6" />)
                    }
                    
                  </button> */}
                  {/* <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" // Hidden input field
                    accept=".pdf,.jpg,.jpeg,.png"
                  /> */}
                  {/* </div> */}
                  <div className='relative h-full'>
                    <textarea
                      value={leaveDetails.reason}
                      name='reason'
                      onChange={handleChange}
                      // onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="State reason for leave  ..."
                      maxLength={400}
                      className="border border-gray-200 w-full my-3 rounded-xl bg-[#e6eef9] p-2 xl:h-[400px] h-[150px]  resize-none mb-2 overflow-y-auto focus:border-gray-300 focus:outline-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
                    />
                  </div>
                  <div className="flex justify-end mb-2">
                    <button
                      type="submit"
                      disabled={leaveLoading}
                      className={`h-9 w-full font-Montserrat font-bold rounded-xl text-white shadow-xl
    ${leaveLoading ? 'bg-gray-400' : 'bg-[#3A426F]'}`}
                    >
  {leaveLoading ? 
    <div className="flex items-center justify-center gap-2">
      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
      Submitting...
    </div> : 
    'Submit'
  }
</button>
                  </div>
                </form>
              </div>
            )}
          </div>
          {/* {snackbar.open && (
        <div
          className={`snackbar ${snackbar.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-3 rounded-md fixed bottom-4 right-4`}
        >
          <p>{snackbar.message}</p>
          <button onClick={handleCloseSnackbar} className="absolute top-1 right-2 text-xl">×</button>
        </div>
      )} */}
<Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <MuiAlert 
    elevation={6}
    variant="filled"
    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
    severity={snackbar.severity}
  >
    {snackbar.message}
  </MuiAlert>
</Snackbar>
       

        </div>
      </div>
    </section>
  )
}

export default SSchedule