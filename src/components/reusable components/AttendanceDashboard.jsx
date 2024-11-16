import React from 'react'
import { useState, useEffect } from 'react';
import { Maximize2, X } from "lucide-react";

const MAttendance = () => {
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

  const [approvedLeaves, setApprovedLeaves] = useState([]);

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

  const [isTableExpanded, setIsTableExpanded] = useState(false);
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
    setStaffList((prevList) =>
      prevList.map((staff) =>
        staff.id === id ? { ...staff, present: !staff.present } : staff
      )
    );
  };
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
    <section className=" h-screen p-2 mr-4 font-Montserrat">
      <h2 className="text-[#252941] text-2xl pl-3 mt-4 font-semibold">Staff Attendance</h2>
      {/* <div> */}
      <div className='flex justify-center mb-1 mt-3 pb-5 px-3'>
        {/* <div className="bg-white w-full h-[392px] pb-7  py-2  rounded-lg shadow"> */}
        <div className={`bg-white w-full rounded-lg shadow ${isTableExpanded ? "h-screen" : "h-[392px]"}`}>
          <div className="flex justify-between items-center p-4">
            <h2 className="text-[#252941] text-lg pl-6 mt-4 mb-0 font-semibold">Select Department:</h2>
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
          <div className="flex mb-4 pl-6 p-2 flex-wrap gap-4">
            {/* "All" Button */}
            <button
              key="all"
              onClick={() => handleDepartmentToggle('All')}
              className={`px-4 py-1 w-[150px] rounded-xl border-none ${selectedDepartments.includes('All') ? "bg-[#8094D4] text-white" : "bg-gray-100 text-gray-700 font-semibold border border-gray-700"
                }`}
            >
              All
            </button>
            {department.map((dept) => (
              <button
                key={dept}
                onClick={() => handleDepartmentToggle(dept)}
                className={`px-4 py-1 w-[150px]  rounded-xl border-none ${selectedDepartments.includes(dept)
                    ? "bg-[#8094D4] text-white"
                    : "bg-gray-100 text-gray-700 font-semibold border border-gray-800"
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <div
            className={`overflow-y-auto ${isTableExpanded ? "max-h-[calc(100%-200px)]" : "max-h-[200px]"
              } mx-2 px-3`}
          >
            {/* <div className="overflow-y-auto lg:overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 max-h-[200px] mx-2 px-3"> */}
            <table className="w-[96%] px-3 mx-auto  border border-gray-200 rounded-xl shadow ">
              {/* Table Headers */}
              <thead>
                <tr className="bg-white text-[#252941]">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-center">Attendance</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredStaffList.length > 0 ? (
                  filteredStaffList.map((staff, index) => (
                    <tr
                      key={staff.id}
                      className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="px-4 py-2">{staff.name}</td>
                      <td className="px-4 py-2">{staff.email}</td>
                      <td className="px-4 py-2">{staff.department}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          className={`px-4 py-1 rounded-full ${staff.present ? "bg-green-500 text-white" : "bg-red-500 text-white"
                            }`}
                          onClick={() => handleToggleAttendance(staff.id)}
                        >
                          {staff.present ? "P" : "A"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                      No staff found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='flex flex-col lg:flex-row gap-5 mb-1 mt-3 pb-5 px-3'>
        {/* <div className="p-6 space-y-6"> */}
        {/* Leave Requests */}
        <div className="bg-white w-full h-auto pb-7 py-2 rounded-lg shadow">
          <h2 className="text-[#252941] text-lg pl-6 mt-4 mb-0 font-semibold">Leave Requests</h2>
          <div className="px-6 mt-4 space-y-4">
            {leaveRequests
              .filter((request) => request.status === null)
              .map((request) => (
                <div
                  key={request.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
                >
                  <div className='w-max'>
                    <p className="font-semibold text-[#252941]">{request.name}</p>
                    <p className="text-sm text-gray-600">{request.department}</p>
                    <p className="text-sm text-gray-600">Type: {request.type}</p>
                    <p className="text-sm text-gray-600">Duration: {request.duration}</p>
                    <p className="text-sm text-gray-600">Date: {request.date}</p>
                  </div>
                  <div className="space-x-2 w-[100px] md:w-auto flex flex-col gap-5 md:gap-2 lg:flex-row">
                    <button
                      className="px-4 w-full  py-1 text-white bg-[#8094D4] rounded-full hover:bg-[#252941]"
                      onClick={() => handleLeaveAction(request.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="md:px-4 px-2 ml-0 w-full py-1 text-gray-800 bg-gray-200 rounded-full hover:bg-gray-300"
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
        <div className="bg-white w-full h-auto pb-7 py-2 rounded-lg shadow">
          <h2 className="text-[#252941] text-lg pl-6 mt-4 mb-0 font-semibold">Approved Leaves</h2>
          <div className="px-6 mt-4 space-y-4">
            {approvedLeaves.length > 0 ? (
              approvedLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm"
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
        {/* </div> */}
      </div>
    </section>
  )
}

export default MAttendance