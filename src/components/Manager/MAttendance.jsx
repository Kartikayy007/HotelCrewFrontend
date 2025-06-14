import React from 'react'
import { useState, useEffect } from 'react';
import { Ban, CircleCheck, CircleX, ClockAlert, Maximize2, X } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAttendance,
  updateAttendance,
  selectManagerAttendanceStaff,
  selectManagerAttendanceLoading,
  selectManagerAttendanceError,
  selectManagerAttendanceUpdateLoading,
  selectManagerAttendanceUpdateError
} from '../../redux/slices/AttendanceSlice';
import {
  fetchLeaveRequests,
  updateLeaveStatus,
  clearUpdateStatus,
  clearError,
  selectLeaveRequests,
  selectLeaveLoading,
  selectLeaveError,
  selectUpdateStatus,
} from "../../redux/slices/LeaveSlice";
import { useMediaQuery } from "@mui/material";
import Skeleton from '@mui/material/Skeleton';
import {
  Modal,
  Box,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { Calendar, Check, Clock, CircleAlert, BadgeCheck, BadgeX } from "lucide-react";
import LoadingAnimation from '../common/LoadingAnimation';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';


// Add this helper function at the top of your component
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const MAttendance = () => {
  const [department, setDepartment] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [filteredStaffList, setFilteredStaffList] = useState([]);
  const dispatch = useDispatch();
  const [selectedDepartments, setSelectedDepartments] = useState(['All']);
  // const { leaveRequests,leaveLoading, leaveError, updateStatus } = useSelector((state) => state.leave);
  const leaveRequests = useSelector(selectLeaveRequests) || [];
  const leaveLoading = useSelector(selectLeaveLoading);
  const leaveError = useSelector(selectLeaveError);
  const updateStatus = useSelector(selectUpdateStatus);

  // const leaveRequests = useSelector((state) => state.leave.leaveRequests || []);

  // const [leaveRequests, setLeaveRequests] = useState([
  //   { id: 1, name: "John Doe", department: "Reception", duration: "2 days", date: "2024-11-20 to 2024-11-21", type: "Sick Leave", status: null, description: "Planned time off for personal matters.", },
  //   { id: 2, name: "Jane Smith", department: "Kitchen", duration: "5 days", date: "2024-11-20 to 2024-11-24", type: "Vacation Leave", status: null, description: "Planned time off for personal matters.", },
  //   { id: 3, name: "Alice Brown", department: "Security", duration: "2 days", date: "2024-11-20 to 2024-11-22", type: "Personal Leave", status: null, description: "Planned time off for personal matters.", },
  // ]);

  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedShift, setSelectedShift] = useState('All');
  const handleOpenModal = (staff) => {
    setSelectedStaff(staff);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStaff(null);
  };

  const modalStyle = () => {
    const isSmallScreen = useMediaQuery("(max-width: 430px)");
    return {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: isSmallScreen ? 340 : 420,
      maxHeight: "auto",
      overflowY: "auto",
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
    }
  };
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [rejectedLeaves, setRejectedLeaves] = useState([]);
  const staff = useSelector(selectManagerAttendanceStaff);
  // console.log('staff:', staff);


  const loading = useSelector(selectManagerAttendanceLoading);
  const error = useSelector(selectManagerAttendanceError);
  const updateLoading = useSelector(selectManagerAttendanceUpdateLoading);
  useEffect(() => {
    console.log('Staff:', staff);
  }, [staff]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchAttendance()).unwrap();
        console.log('Fetched data:', result);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 900000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (staff && staff.length > 0) {
      const uniqueDepartments = [...new Set(staff.map(item =>
        capitalizeFirstLetter(item.department)
      ))];
      setDepartment(['All', ...uniqueDepartments]);
      if (selectedDepartments.length === 0) {
        setSelectedDepartments(['All']);
      }
    }
  }, [staff]);


  const [updatingMemberId, setUpdatingMemberId] = useState(null);

  const handleToggleAttendance = async (id) => {
    try {
      setUpdatingMemberId(id);
      await dispatch(updateAttendance(id)).unwrap();
    } catch (error) {
      console.error('Failed to update attendance:', error);
    } finally {
      setUpdatingMemberId(null);
    }
  };

  useEffect(() => {
    ("Fetching leave requests on mount");
    dispatch(fetchLeaveRequests());


    const interval = setInterval(() => {
      dispatch(fetchLeaveRequests());
    }, 10 * 60 * 1000);


    return () => clearInterval(interval);
  }, [dispatch]);

  // Update the handleLeaveAction function
  const handleLeaveAction = (id, action) => {
    if (!id) {
      setSnackbar({
        open: true,
        message: "Invalid leave request ID",
        severity: "error",
      });
      return;
    }

    dispatch(updateLeaveStatus({
      id: id,  // Make sure we're passing the correct ID
      status: action
    }))
      .unwrap()
      .then(() => {
        // Update the local state based on action
        if (action === "Approved") {
          const approvedLeave = leaveRequests.find((request) => request.id === id);
          if (approvedLeave) {
            setApprovedLeaves((prev) => [...prev, approvedLeave]);
          }

          setSnackbar({
            open: true,
            message: "Leave request approved successfully",
            severity: "success",
          });
        } else if (action === "Rejected") {
          const rejectedLeave = leaveRequests.find((request) => request.id === id);
          if (rejectedLeave) {
            setRejectedLeaves((prev) => [...prev, rejectedLeave]);
          }

          setSnackbar({
            open: true,
            message: "Leave request rejected",
            severity: "error",
          });
        }

        // Refresh the leave requests
        dispatch(fetchLeaveRequests());
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: `Failed to ${action.toLowerCase()} leave request: ${error}`,
          severity: "error",
        });
      });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const filteredStaff = React.useMemo(() => {
    if (!staff || !Array.isArray(staff)) return [];

    return staff.filter((member) => {

      const departmentMatch =
        selectedDepartments.includes('All') ||
        selectedDepartments.includes(capitalizeFirstLetter(member.department));


      const shiftMatch =
        selectedShift === 'All' ||
        member.shift === selectedShift;

      return departmentMatch && shiftMatch;
    });
  }, [staff, selectedDepartments, selectedShift]);


  const toggleDepartmentSelection = (department) => {
    if (department === 'All') {
      setSelectedDepartments(['All']);
    } else {
      setSelectedDepartments([department]);
    }
  };


  const calculateDuration = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);

    const differenceInMilliseconds = end - start;

    const durationInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return durationInDays + 1;
  };


  return (
    <section className=" h-screen p-2 mr-1 font-Montserrat">
      <h1 className="text-[#252941] text-3xl mt-6 mb-4 pl-16 font-semibold">
        Staff Attendance & Leave
      </h1>
      <div className='flex justify-center mb-1 mt-6 pb-5 px-3'>
        <div className={`bg-white w-full rounded-xl shadow ${isTableExpanded ? "h-screen" : "h-[460px]"}`}>
          <div className="flex justify-between items-center p-4 pb-2">
            <h2 className="text-[#252941] text-lg sm:text-xl pl-1 mt-2  mb-2 font-semibold ml-3">Select Shift:</h2>
            {isTableExpanded ? (
              <X
                size={24}
                className="cursor-pointer pr-1  text-gray-600 hover:text-gray-900"
                onClick={() => setIsTableExpanded(false)}
              />
            ) : (
              <Maximize2
                size={24}
                className="cursor-pointer pr-1 text-gray-600 hover:text-gray-900"
                onClick={() => setIsTableExpanded(true)}
              />
            )}
          </div>

          <div className="flex mb-2 pl-2 mx-4 gap-4 rounded-xl pr-9 overflow-x-auto scrollbar-none scrollbar-track-transparent scrollbar-thumb-neutral-50">
            {['All', 'Morning', 'Evening', 'Night'].map((shift) => (
              <button
                key={shift}
                onClick={() => setSelectedShift(shift)}
                className={`px-4 py-2 w-auto rounded-3xl border-none font-semibold ${selectedShift === shift
                  ? 'bg-[#6675C5] text-white'
                  : 'bg-[#E6EEF9] text-[#252941]'
                  }`}
              >
                {shift}
              </button>
            ))}
          </div>
          <h2 className="text-[#252941] text-lg sm:text-xl  pl-8 my-2 md:mt-4 mb-2 font-semibold">Select Department:</h2>
          <div className=" flex mb-2 pl-4 mx-3 pb-4 mt-4  gap-4 rounded-3xl pr-9 overflow-x-auto no-scrollbar">


            {department.map((dept) => (
              <button
                key={dept}
                onClick={() => toggleDepartmentSelection(dept)}
                className={`px-4 py-2 w-auto capitalize rounded-3xl border-none font-semibold ${selectedDepartments.includes(dept)
                  ? "bg-[#6675C5] text-white"
                  : "bg-[#E6EEF9] text-[#252941] "
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div
            className={` ${isTableExpanded ? "max-h-[calc(100%-280px)]" : "max-h-[190px]"
              } md:ml-2 mr-5 ml-5 overflow-y-auto rounded-xl no-scrollbar`}
          >
            {loading ? (
              <>
                <div className='m-auto w-full flex justify-center h-full items-center'>

                  <LoadingAnimation />
                </div>
              </>
            ) : !filteredStaff?.length ? (

              <div className="text-center font-semibold text-gray-400 text-lg gap-4 h-full p-4 flex flex-col items-center justify center">
                <img src="/noStaff.png" className='w-28 m-2' alt="" />
                <p>No staff available</p>
                
                </div>
            ) : (
              <table className="w-[96%] px-3 ml-4 mx-auto border border-[#dcdcdc] rounded-2xl shadow-xl ">

                <thead className='sticky top-0 bg-[#3F4870] text-[#E6EEF9] rounded-xl'>
                  <tr className="bg-[#3F4870] text-[#E6EEF9] rounded-xl">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-center">Attendance</th>

                  </tr>
                </thead>


                <tbody>
                  {filteredStaff.map((member, index) => (
                    <tr
                      key={member.id}
                      className={`px-4 py-2 ${index % 2 === 0 ? 'bg-[#F1F6FC]' : 'bg-[#DEE8FF]'
                        }`}
                    >
                      <td className="px-4 py-2">{member.user_name}</td>
                      <td className="px-4 py-2">{member.email}</td>
                      <td className="px-4 py-2">{member.department}</td>
                      <td className="px-4 py-2 text-center">

                        <button
                          className={`px-5 py-1 rounded-full ${member.current_attendance === 'Present'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                            }`}
                          onClick={() => handleToggleAttendance(member.id)}
                          disabled={updatingMemberId === member.id}
                        >
                          {updatingMemberId === member.id ? (
                            <LoadingAnimation size={21} color="#ffffff" className='px-4' />
                          ) : (
                            member.current_attendance
                          )}
                        </button>

                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <div className='flex flex-col lg:flex-row gap-5 mb-1 mt-3 pb-5 px-3'>


        <div className="bg-white w-full max-h-[375px] overflow-y-auto pb-7 py-2 rounded-xl shadow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200">
          <div className='flex gap-4 sticky top-0 bg-white'>
            <h2 className="text-lg sm:text-xl top-4 pl-6 mt-4 mb-0 font-semibold sticky ">Leave Requests</h2>
            <CircleAlert className='text-yellow-500 mt-4 rounded-full ' size={30} />
          </div>
          <div className="px-6 mt-4 space-y-4">

            {leaveLoading ? (

              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-[#E6EEF9] rounded-xl shadow-sm"
                >
                  <div className="w-max space-y-2">
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="text" width="30%" height={18} />
                    <Skeleton variant="text" width="50%" height={18} />
                    <Skeleton variant="text" width="60%" height={18} />
                    <Skeleton variant="text" width="70%" height={18} />
                  </div>
                  <div className="flex flex-col gap-2 w-32">
                    <Skeleton variant="rectangular" width="100%" height={36} />
                    <Skeleton variant="rectangular" width="100%" height={36} />
                  </div>
                </div>
              ))
            ) : (

              (leaveRequests || [])
                .filter((request) => request?.status === "Pending")
                .map((request) => (
                  <div
                    key={request.id}
                    onClick={() => handleOpenModal(request)}
                    className="flex justify-between items-center p-4 bg-[#E6EEF9] rounded-xl shadow-sm"
                  >

                    <div className="w-max">
                      <p className="font-semibold text-[#252941]">{request.user_name}</p>
                      <p className=" text-gray-600">{request.from_date} to {request.to_date}</p>
                      <p className=" text-gray-600">Type: {request.leave_type}</p>
                      <p className=" text-gray-600">Duration: {calculateDuration(request.from_date, request.to_date)} days</p>
                    </div>

                  </div>
                ))
            )}


            {(leaveRequests || []).filter((request) => request?.status === 'Pending').length === 0 && (
              <p className="text-gray-600 font-semibold">No leave requests pending.</p>
            )}
          </div>
        </div>


        <div className="bg-white w-full max-h-[375px] overflow-y-auto pb-7 py-2 rounded-xl shadow no-scrollbar">


          <div className='flex sticky w-full bg-white top-0 gap-4'>
            <h2 className="text-lg sm:text-xl pl-6 pt-4 font-semibold sticky top-0">Approved Leaves</h2>
            <CircleCheck className='text-green-500 mt-4' size={30} />
          </div>
          <div className="m-6 h-[88%] rounded-xl bg-white mt-4 space-y-4">
            {leaveLoading ? (

              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#E6EEF9] rounded-lg shadow-sm"
                >
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="30%" height={18} />
                  <Skeleton variant="text" width="50%" height={18} />
                  <Skeleton variant="text" width="60%" height={18} />
                  <Skeleton variant="text" width="70%" height={18} />
                </div>
              ))
            ) : approvedLeaves.length > 0 ? (
              approvedLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-4 bg-[#E6EEF9] rounded-lg shadow-sm"
                >
                  <p className="font-semibold text-[#252941]">{leave.user_name}</p>

                  <p className="text-sm text-gray-600">Type: {leave.leave_type}</p>
                  <p className="text-sm text-gray-600">Duration: {leave.duration}</p>
                  <p className="text-sm text-gray-600">Date: {leave.from_date} to {leave.to_date}</p>
                </div>
              ))
            ) : (

              <p className="text-gray-600 font-semibold ">No approved leaves yet.</p>
            )}
          </div>
        </div>
        <div className="bg-white w-full max-h-[375px] overflow-y-auto pb-7 py-2 rounded-xl shadow no-scrollbar">
          <div className='flex bg-white sticky top-0 gap-4'>
            <h2 className="text-lg sm:text-xl pl-6 pt-4 font-semibold sticky top-0">Rejected Leaves</h2>
            <CircleX className='text-red-500 mt-4 ' size={30} />
          </div>
          <div className="m-6 h-[88%] rounded-xl bg-white mt-4 space-y-4">
            {leaveLoading ? (

              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#efefef] rounded-lg shadow-sm"
                >
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="30%" height={18} />
                  <Skeleton variant="text" width="50%" height={18} />
                  <Skeleton variant="text" width="60%" height={18} />
                  <Skeleton variant="text" width="70%" height={18} />
                </div>
              ))
            ) : rejectedLeaves.length > 0 ? (
              rejectedLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-4 bg-[#f5e8e8] rounded-lg shadow-sm"
                >
                  <p className="font-semibold text-[#252941]">{leave.user_name}</p>

                  <p className="text-sm text-gray-600">Type: {leave.leave_type}</p>
                  <p className="text-sm text-gray-600">Date: {leave.from_date} to {leave.to_date}</p>
                  <p className="text-sm text-gray-600">Duration: {leave.duration} days</p>

                </div>
              ))
            ) : (

              <p className="text-gray-600 font-semibold  ">No rejected leaves yet.</p>
            )}
          </div>
        </div>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="staff-profile-modal"
        >
          <Box sx={modalStyle}>
            <div className="flex flex-col">
              <Typography
                variant="h5"
                component="h2"
                className="mb-4 text-center"
              >
                {selectedStaff?.user_name}
              </Typography>
              <Divider className="my-4" />
              <div className="space-y-3">

                <div>

                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      className="px-3 w-full py-1 text-white bg-[#252941] text-lg rounded-full hover:bg-[#202338]"
                      onClick={() => {
                        if (selectedStaff && selectedStaff.id) {
                          handleLeaveAction(selectedStaff.id, "Approved");
                          handleCloseModal();
                        };
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="md:px-3  ml-0 w-full py-1 text-gray-800 bg-[#fdfdfd] text-lg font-semibold border border-[#dcdcdc] rounded-full hover:bg-gray-300"
                      onClick={() => {
                        if (selectedStaff && selectedStaff.id) {
                          handleLeaveAction(selectedStaff.id, "Rejected");
                          handleCloseModal();
                        }
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <div>
                  <Typography variant="subtitle3" color="text.secondary">
                    <p className='text-gray-700 font-bold text-lg '>Reason: </p> <p className='mb-3'>{selectedStaff?.reason}</p>
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    <p className='text-gray-700 text-lg'><span className='font-bold'>Date :</span> {selectedStaff?.from_date} to {selectedStaff?.to_date}
                    </p>
                  </Typography>

                  <Typography variant="subtitle2">
                    <p className='text-gray-700 text-lg'><span className='font-bold'>Duration : </span>{selectedStaff?.duration} days
                    </p>

                  </Typography>

                </div>
              </div>
            </div>
          </Box>
        </Modal>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </section>
  )
}

export default MAttendance