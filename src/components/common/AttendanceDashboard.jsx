import React, { useState, useEffect } from 'react';
import { Maximize2, X } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchAttendance, updateAttendance, checkAttendance } from '../../redux/slices/AttendanceSlice';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Skeleton from '@mui/material/Skeleton';

const AttendanceDashboard = () => {
  const [department, setDepartment] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState(['All']);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "John Doe", department: "Reception", duration: "2 days", date: "2024-11-20 to 2024-11-21", type: "Sick Leave", status: null },
    { id: 2, name: "Jane Smith", department: "Kitchen", duration: "5 days", date: "2024-11-20 to 2024-11-24", type: "Vacation Leave", status: null },
    { id: 3, name: "Alice Brown", department: "Security", duration: "2 days", date: "2024-11-20 to 2024-11-22", type: "Personal Leave", status: null },
  ]);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const staff = useSelector(state => state.attendance.staff);
  const { error } = useSelector((state) => state.attendance);
  const dispatch = useDispatch();

  const demoStaff = [
    { id: 1, user_name: "John Doe", email: "john.doe@example.com", department: "HR", current_attendance: "Present" },
    { id: 2, user_name: "Jane Smith", email: "jane.smith@example.com", department: "IT", current_attendance: "Absent" },
    { id: 3, user_name: "Alice Johnson", email: "alice.j@example.com", department: "Finance", current_attendance: "Present" },
  ];

  
  const [demoMode, setDemoMode] = useState(false);

  
  const dataToUse = demoMode ? demoStaff : staff;

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  // useEffect(() => {
  //   const fetchData = () => {
  //     dispatch(fetchAttendance());
  //   };
  //   fetchData();
  //   const intervalId = setInterval(fetchData, 900000);
  //   return () => clearInterval(intervalId);
  // }, [dispatch]);


  useEffect(() => {
    if (staff && staff.length > 0) {
      const uniqueDepartments = [
        ...new Set(staff.map((item) => item.department))
      ];
      setDepartment(uniqueDepartments);
      setSelectedDepartments(["All"]);
    }
  }, [staff]);

  useEffect(() => {
    if (staff && staff.length > 0) {
      if (selectedDepartments.includes("All")) {
        setFilteredStaff(staff);
      } else {
        setFilteredStaff(
          staff.filter(member => 
            selectedDepartments.includes(member.department)
          )
        );
      }
      setLoading(false);
    }
  }, [staff, selectedDepartments]);

  const handleToggleAttendance = (id) => {
    dispatch(updateAttendance(id));
  };

  if (error) {
    return (
       ({error}),
      <div className="flex justify-center text-2xl items-center h-full">    
        <p >No data Available</p>
      </div>
    );
  }
  localStorage.setItem('accessToken', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0MjY3NzY0LCJpYXQiOjE3MzE2NzU3NjQsImp0aSI6ImQ3NWVmNTUxMmE0NzQ1NWFiYmE3MmVhY2M2NzM0Mzk4IiwidXNlcl9pZCI6NDF9.pX8v_JU3baX_Vq-vavtHdqDgBDZ1tpOJQDgEMjClMRg");

  const handleLeaveAction = (id, action) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: action } : request
      )
    );

    if (action === "approved") {
      const approvedLeave = leaveRequests.find((request) => request.id === id);
      setApprovedLeaves((prevApprovedLeaves) => [...prevApprovedLeaves, approvedLeave]);
    }
  };

  const toggleDepartmentSelection = (department) => {
    setSelectedDepartments([department]);
  };

  return (
    <section className=" h-screen p-2 mr-1 font-Montserrat">
      <h2 className="text-[#252941] text-2xl pl-4 mt-5 font-semibold">Staff Attendance</h2>
      <div className='flex justify-center mb-1 mt-6 pb-5 px-3'>
        <div className={`bg-white w-full rounded-xl shadow ${isTableExpanded ? "h-screen" : "h-[370px]"}`}>
          <div className="flex justify-between items-center p-4">
            <h2 className="text-[#252941] text-lg pl-3 mt-2 md:mt-4 mb-0 font-semibold">Select Department:</h2>
            {isTableExpanded ? (
              <X
                size={24}
                className="cursor-pointer text-gray-600 hover:text-gray-900"
                onClick={() => setIsTableExpanded(false)}
              />
            ) : (
              <Maximize2
                size={24}
                className="cursor-pointer text-gray-600 hover:text-gray-900"
                onClick={() => setIsTableExpanded(true)}
              />
            )}
          </div>
          <div className="md:hidden p-4 flex items-center justify-center">
            <select
              className="py-2 px-4 w-full  border border-gray-300 rounded-3xl"
              onChange={(e) => toggleDepartmentSelection(e.target.value)}
              value={selectedDepartments[0]}
            >
              <option value="All">All</option>
              {department.map((dept) => (
                <option key={dept} value={dept} className='bg-[#efefef] rounded-xl'>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className=" hidden md:flex mb-2 pl-7 pb-2 gap-4 rounded-3xl pr-9">
            <button
              key="all"
              onClick={() => toggleDepartmentSelection('All')}
              className={`px-4 py-1 w-[150px] rounded-3xl font-semibold  border-none ${selectedDepartments.includes('All') ? "bg-[#6675C5] text-white" : "bg-[#E6EEF9] text-[#252941] font-semibold border border-gray-700"
                }`}
            >
              All
            </button>
            {department.map((dept) => (
              <button
                key={dept}
                onClick={() => toggleDepartmentSelection(dept)}
                className={`px-4 py-1 w-[150px]  rounded-3xl border-none font-semibold ${selectedDepartments.includes(dept)
                  ? "bg-[#6675C5] text-white"
                  : "bg-[#E6EEF9] text-[#252941] "
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <div
            className={` ${isTableExpanded ? "max-h-[calc(100%-200px)]" : "max-h-[200px]"
              } md:ml-2 ml-4 mr-5 overflow-y-auto rounded-xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200`}
          >
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">Loading...</td>
              </tr>
            ) : filteredStaff && filteredStaff.length > 0 ? (
              filteredStaff.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{member.user_name}</td>
                  <td className="px-4 py-2">{member.email}</td>
                  <td className="px-4 py-2">{member.department}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className={`px-4 py-1 rounded-full ${member.current_attendance === 'Present'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                        }`}
                      onClick={() => handleToggleAttendance(member.id)}
                    >
                      {member.current_attendance}
                    </button>
                  </td>
                  <td className="px-4 py-2"></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No staff members found
                </td>
              </tr>
            )}
          </div>
        </div>
      </div>
      <div className='flex flex-col lg:flex-row gap-5 mb-1 mt-3 pb-5 px-3'>
        <div className="bg-white w-full max-h-[375px] overflow-y-auto pb-7 py-2 rounded-xl shadow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200">
          <h2 className="text-[#252941] text-lg pl-6 mt-4 mb-0 font-semibold">Leave Requests</h2>
          <div className="px-6 mt-4 space-y-4">
            {loading ? (
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
              leaveRequests
                .filter((request) => request.status === null)
                .map((request) => (
                  <div
                    key={request.id}
                    className="flex justify-between items-center p-4 bg-[#E6EEF9] rounded-xl shadow-sm"
                  >
                    <div className="w-max">
                      <p className="font-semibold text-[#252941]">{request.name}</p>
                      <p className="text-sm text-gray-600">{request.department}</p>
                      <p className="text-sm text-gray-600">Type: {request.type}</p>
                      <p className="text-sm text-gray-600">Duration: {request.duration}</p>
                      <p className="text-sm text-gray-600">Date: {request.date}</p>
                    </div>
                    <div className="flex flex-col gap-2 ">
                      <button
                        className="px-4 w-full py-1 text-white bg-[#252941] rounded-full hover:bg-[#202338]"
                        onClick={() => handleLeaveAction(request.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="md:px-4 px-2 ml-0 w-full py-1 text-gray-800 bg-[#fdfdfd] font-semibold border border-[#dcdcdc] rounded-full hover:bg-gray-300"
                        onClick={() => handleLeaveAction(request.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
            )}
            {leaveRequests.filter((request) => request.status === null).length === 0 && !loading && (
              <p className="text-gray-900">No leave requests pending.</p>
            )}
          </div>
        </div>
        <div className="bg-white w-full max-h-[375px] overflow-y-auto pb-7 py-2 rounded-xl shadow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200">
          <h2 className="text-[#252941] text-lg pl-6 mt-4 mb-0 font-semibold">Approved Leaves</h2>
          <div className="m-6 h-[88%] rounded-xl bg-white mt-4 space-y-4">
            {loading ? (
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
                  <p className="font-semibold text-[#252941]">{leave.name}</p>
                  <p className="text-sm text-gray-600">{leave.department}</p>
                  <p className="text-sm text-gray-600">Type: {leave.type}</p>
                  <p className="text-sm text-gray-600">Duration: {leave.duration}</p>
                  <p className="text-sm text-gray-600">Date: {leave.date}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No approved leaves yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AttendanceDashboard;