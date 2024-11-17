import React from 'react'
import { useState, useEffect } from 'react';
import { Maximize2, X } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchAttendance, updateAttendance } from '../../redux/slices/AttendanceSlice';


const AttendanceDashboard = () => {
  const [department, setDepartment] = useState([]);// State for department filter
  const [selectedDepartments, setSelectedDepartments] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState([]); // State for email search
  const [staffList, setStaffList] = useState([
    // Example staff data
    { id: 1, name: "John Doe", email: "john@example.com", department: "Reception" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", department: "Kitchen" },
    { id: 3, name: "Alice Brown", email: "alice@example.com", department: "Security" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", department: "Housekeeping" },
    { id: 5, name: "Alice Brown", email: "alice@example.com", department: "Housekeeping" },
  ]);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "John Doe", department: "Reception", duration: "2 days", date: "2024-11-20 to 2024-11-21", type: "Sick Leave", status: null },
    { id: 2, name: "Jane Smith", department: "Kitchen", duration: "5 days", date: "2024-11-20 to 2024-11-24", type: "Vacation Leave", status: null },
    { id: 3, name: "Alice Brown", department: "Security", duration: "2 days", date: "2024-11-20 to 2024-11-22", type: "Personal Leave", status: null },
  ]);

  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const { staff, loading, error } = useSelector((state) => state.attendance);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  useEffect(() => {
    const fetchDepartments = async () => {
      // Example API response
      const departmentData = ["Reception", "Kitchen", "Security", "Housekeeping"];
      setDepartment(departmentData);
      setSelectedDepartments(['All']); // Select all by default
    };
    fetchDepartments();
  }, []);

  const handleToggleAttendance = (id) => {
    dispatch(updateAttendance(id));
  };

  if (loading) {
    return <p>Loading attendance...</p>;
  }

  if (error) {
    return <p>Error loading attendance: {error}</p>;
  }

  localStorage.setItem('accessToken', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0MjY3NzY0LCJpYXQiOjE3MzE2NzU3NjQsImp0aSI6ImQ3NWVmNTUxMmE0NzQ1NWFiYmE3MmVhY2M2NzM0Mzk4IiwidXNlcl9pZCI6NDF9.pX8v_JU3baX_Vq-vavtHdqDgBDZ1tpOJQDgEMjClMRg")
  // Handle approve/reject
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

  // const handleToggleAttendance = (id) => {
  //   setStaffList((prevList) =>
  //     prevList.map((staff) =>
  //       staff.id === id ? { ...staff, present: !staff.present } : staff
  //     )
  //   );
  // };
  const handleDepartmentToggle = (department) => {
    if (department === "All") {
      setSelectedDepartments(["All"]);
    } else {
      setSelectedDepartments((prev) =>
        prev.includes("All")
          ? [department]
          : prev.includes(department)
            ? prev.filter((d) => d !== department)
            : [department]
      );
    }
  };

  const filteredStaffList = staffList.filter(
    (staff) =>
      (selectedDepartments.includes('All') || selectedDepartments.includes(staff.department)) &&
      staff.name.toLowerCase().includes(searchTerm)
  );
  return (
    <section className=" h-screen p-2 mr-1 font-Montserrat">
      <h2 className="text-[#252941] text-2xl pl-4 mt-5 font-semibold">Staff Attendance</h2>
      {/* <div> */}
      <div className='flex justify-center mb-1 mt-6 pb-5 px-3'>
        {/* <div className="bg-white w-full h-[392px] pb-7  py-2  rounded-lg shadow"> */}
        <div className={`bg-white w-full rounded-xl shadow ${isTableExpanded ? "h-screen" : "h-[370px]"}`}>
          <div className="flex justify-between items-center p-4">
            <h2 className="text-[#252941] text-lg pl-3 mt-2 md:mt-4 mb-0 font-semibold">Select Department:</h2>
            {/* Expand/Collapse Icons */}
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
              onChange={(e) => handleDepartmentToggle(e.target.value)}
              value={selectedDepartments[0]} // Show the first selected option
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
            {/* "All" Button */}
            <button
              key="all"
              onClick={() => handleDepartmentToggle('All')}
              className={`px-4 py-1 w-[150px] rounded-3xl font-semibold  border-none ${selectedDepartments.includes('All') ? "bg-[#6675C5] text-white" : "bg-[#E6EEF9] text-[#252941] font-semibold border border-gray-700"
                }`}
            >
              All
            </button>
            {department.map((dept) => (
              <button
                key={dept}
                onClick={() => handleDepartmentToggle(dept)}
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

            <table className="w-[96%] px-1 mx-auto border border-[#dcdcdc] rounded-2xl shadow  ">
              {/* Table Headers */}
              <thead>
                <tr className="bg-[#3F4870] text-[#E6EEF9] rounded-xl">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-center">Attendance</th>
                  {/* <th className="px-4 py-2 text-center">Date</th> */}
                </tr>
              </thead>


              <tbody>
                {staff.map((member, index) => (
                  <tr
                    key={member.id}
                    className={`px-4 py-2 ${index % 2 === 0 ? 'bg-[#F1F6FC]' : 'bg-[#DEE8FF]'
                      }`}
                  >
                    <td className="px-4 py-2">Navya</td>
                    <td className="px-4 py-2">{member.email}</td>
                    <td className="px-4 py-2">{member.role}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='flex flex-col lg:flex-row gap-5 mb-1 mt-3 pb-5 px-3'>
        {/* <div className="p-6 space-y-6"> */}
        {/* Leave Requests */}
        <div className="bg-white w-full h-auto pb-7 py-2 rounded-xl shadow">
          <h2 className="text-[#252941] text-lg pl-6 mt-4 mb-0 font-semibold">Leave Requests</h2>
          <div className="px-6 mt-4 space-y-4">
            {leaveRequests
              .filter((request) => request.status === null)
              .map((request) => (
                <div
                  key={request.id}
                  className="flex justify-between items-center p-4 bg-[#E6EEF9] rounded-xl shadow-sm"
                >
                  <div className='w-max'>
                    <p className="font-semibold text-[#252941]">{request.name}</p>
                    <p className="text-sm text-gray-600">{request.department}</p>
                    <p className="text-sm text-gray-600">Type: {request.type}</p>
                    <p className="text-sm text-gray-600">Duration: {request.duration}</p>
                    <p className="text-sm text-gray-600">Date: {request.date}</p>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <button
                      className="px-4 w-full  py-1 text-white bg-[#252941] rounded-full hover:bg-[#202338]"
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
              ))}
            {leaveRequests.filter((request) => request.status === null).length === 0 && (
              <p className="text-gray-500">No leave requests pending.</p>
            )}
          </div>
        </div>

        {/* Approved Leaves */}
        <div className="bg-white w-full h-auto pb-7 py-2 rounded-xl shadow">
          <h2 className="text-[#252941] text-lg pl-6 mt-4 mb-0 font-semibold">Approved Leaves</h2>
          <div className=" m-6 h-[88%] rounded-xl bg-white mt-4 space-y-4">
            {approvedLeaves.length > 0 ? (
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
              
             
              <p className="text-gray-500 ">No approved leaves yet.</p>
              
            )}
          </div>
        </div>
        {/* </div> */}
      </div>
    </section>
  )
}

export default AttendanceDashboard