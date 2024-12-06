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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { from_date, to_date,leave_type, reason} = leaveDetails;
    if (!from_date) {
      setSnackbar({
        open: true,
        message: "From Date is required.",
        severity: "error"
      });
      return;
    }
    if (!to_date) {
      setSnackbar({
        open: true,
        message: "End Date is required.",
        severity: "error"
      });
      return;
    }
    if (!leave_type) {
      setSnackbar({
        open: true,
        message: "Leave Type is required.",
        severity: "error"
      });
      
      return;
    }
    if (!reason) {
      setSnackbar({
        open: true,
        message: "Description is required.",
        severity: "error"
      });
      
      return;
    }
    dispatch(staffLeaveApply(leaveDetails));
     (appliedLeave);
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
    // setLeaveDetails((prev) => ({
    //   ...prev,
    //   to_date: date ? date.toLocaleDateString() : "", // Set the formatted date
    // }));
    setLeaveDetails((prev) => ({
      ...prev,
      to_date: date ? formatDate(date) : "", // Set the formatted date
    }));
    setIsEndDropdownOpen(false); // Close the dropdown
    // setIsCalendarOpen(null);
  };

  // const handleFileButtonClick = () => {
  //   fileInputRef.current.click(); // Trigger the hidden file input click
  // };
  // const handleRemoveFile = () => {
  //   setFileName(''); // Clear the file name when "X" is clicked
  // };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Validate file type
  //     const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  //     if (allowedTypes.includes(file.type)) {
  //       setSelectedFile(file);
  //       setSnackbar({ open: true, message: "File uploaded successfully.", severity: "success" });
  //       setFileName(file.name);
  //       setTimeout(() => {
  //         handleCloseSnackbar(); // Close snackbar after 3 seconds
  //       }, 3000);
  //     } else {
  //       setSnackbar({ open: true, message: "Invalid file type. Please upload a PDF, JPG, or PNG file.", severity: "error" });
  //       event.target.value = ""; // Clear the input
  //       setTimeout(() => {
  //         handleCloseSnackbar(); // Close snackbar after 3 seconds
  //       }, 3000);
  //     }
  //   }
  // };

 

  useEffect(() => {
    if (appliedLeave) {
      setSnackbar({
        open: true,
        message: 'Leave Request Submitted Successfully!',
        severity: 'success',
      });
      setLeaveDetails({
        from_date: '',
        to_date: '',
        leave_type: '',
        reason:'' // Reset any other form fields as needed
      });
      setStartDate(null);
      setEndDate(null);
      dispatch(resetLeaveStatus()); 
    }

    if (applyLeaveError) {
       (applyLeaveError);
      setSnackbar({
        open: true,
        message: 'Error submitting leave request. Please try again.',
        severity: 'error',
      });
      dispatch(resetApplyLeaveError());
    }
  }, [appliedLeave, applyLeaveError]);


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const shifts = ["morning", "day", "night"];
  const shiftTime = (shift) => {
    if (shift === "Morning"|| shift==="morning") {
      return "05:00 AM to 01:00 PM";
    } else if (shift === "Evening"|| shift==="Evening") {
      return "01:00 PM to 09:00 PM";
    } else if (shift === "Night" || shift==="night") {
      return "09:00 PM to 05:00 AM";
    } else {
      return "Invalid shift";
    }
  };
  return (
    <section className=" h-screen bg-[]  font-Montserrat  overflow-y-auto ">
      <h2 className="text-[#252941] text-3xl mt-5 lg:text-center  my-3 pl-11 ml-5 font-semibold">Schedule Status</h2>
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
              <div className='text-lg text-[#47518C] font-semibold mb-2'>
                <p className='capitalize'>{profile?.shift||"Invalid"} Shift</p>
                <p className=''>Time: {shiftTime(profile?.shift||'shifts[0]')}</p>
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
          <div className="bg-white w-full h-[700px]  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow ">
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
                          {/* <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            inline
                            selectsEnd
                            dateFormat="dd/MM/yyyy"
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate || today} // Prevent selection of dates before the start date
                          /> */}
                          <Dialog
                            // open={!!isCalendarOpen && isCalendarOpen === "endDate"}
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
                      //onclick()=>{handleRequestSubmit}
                      className="h-9  w-full  bg-[#3A426F] font-Montserrat font-bold rounded-xl text-white  shadow-xl"
                    >
                      {/* Request */}
                      {leaveLoading ? "Submiting..." : "Submit"}
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
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success"
          variant="filled"
          sx={{ 
            width: '100%',
            '& .MuiAlert-filledSuccess': {
              backgroundColor: '#4CAF50'
            }
          }}
        >{snackbar.message}
          {/* {draggedStaff && targetShift ? 
            `Shift updated successfully` : 
            'Shift updated successfully'
          } */}
        </Alert>
      </Snackbar>
       

        </div>
      </div>
    </section>
  )
}

export default SSchedule