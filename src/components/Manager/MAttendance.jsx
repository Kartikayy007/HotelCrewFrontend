import React from 'react'
import { useState,useEffect } from 'react';

const MAttendance = () => {
  const [department, setDepartment] = useState([]);// State for department filter
  const [selectedDepartments, setSelectedDepartments] = useState(['All']); 
  const [searchTerm, setSearchTerm] = useState([]); // State for email search
  const [staffList, setStaffList] = useState([
    // Example staff data
    { id: 1, name: "John Doe", email: "john@example.com", department: "Reception" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", department: "Kitchen" },
    { id: 3, name: "Alice Brown", email: "alice@example.com", department: "Security" },
  ]);

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      // Example API response
      const departmentData = ["Reception", "Kitchen", "Security","Housekeeping"];
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
    // If 'All' is selected, reset everything and show all staff
    if (department === "All") {
      // When "All" is clicked, select all departments
      setSelectedDepartments(["All"]);
    } else {
      // When any specific department is clicked, deselect "All" and add the department
      setSelectedDepartments((prev) =>
        prev.includes("All")
          ? [department] // Select the clicked department if "All" was selected
          : prev.includes(department)
          ? prev.filter((d) => d !== department) // Deselect the department if already selected
          : [ department] // Add department to selection
      );
    }
  };


  // const handleDepartmentToggle = (department) => {
  //   setSelectedDepartments((prev) =>
  //     prev.includes(department)
  //       ? prev.filter((d) => d !== department) // Remove if already selected
  //       : [...prev, department] // Add if not selected
  //   );
  // };
  
  // const filteredStaffList = staffList.filter(
  //   (staff) =>
  //     selectedDepartments.includes(staff.department) &&
  //     staff.name.toLowerCase().includes(searchTerm)
  // );
  const filteredStaffList = staffList.filter(
    (staff) =>
      (selectedDepartments.includes('All') || selectedDepartments.includes(staff.department)) &&
      staff.name.toLowerCase().includes(searchTerm)
  );
  return (
    <section className=" h-screen p-2 mr-4 font-Montserrat">
      <h2 className="text-[#252941] text-2xl pl-3 mt-4 font-semibold">Staff Attendance</h2>
      {/* <div> */}
      <h2 className="text-[#252941] text-lg pl-3 mt-4 mb-0 font-semibold">Select Department:</h2>
      <div className="flex mb-4 p-2 flex-wrap gap-4">
         {/* "All" Button */}
         <button
          key="all"
          onClick={() => handleDepartmentToggle('All')}
          className={`px-4 py-1 w-[150px] rounded-xl border-none ${
            selectedDepartments.includes('All') ? "bg-[#8094D4] text-white" : "bg-gray-100 text-gray-700 font-semibold border border-gray-700"
          }`}
        >
          All
        </button>
        {department.map((dept) => (
          <button
            key={dept}
            onClick={() => handleDepartmentToggle(dept)}
            className={`px-4 py-1 w-[150px]  rounded-xl border-none ${
              selectedDepartments.includes(dept)
                ? "bg-[#8094D4] text-white"
                : "bg-white text-gray-700 font-semibold border border-gray-800"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>
      <table className="w-full mx-2 overflow-x-scroll px-3 table-auto border border-gray-200 rounded-xl shadow">
        {/* Table Headers */}
        <thead>
          <tr className="bg-[#252941] text-white">
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
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={staff.present}
                      onChange={() => handleToggleAttendance(staff.id)}
                    />
                    <div
                      className={`w-11 h-6 rounded-full peer-focus:ring-4 ${
                        staff.present
                          ? "bg-green-500 peer-focus:ring-green-300"
                          : "bg-red-500 peer-focus:ring-red-300"
                      }`}
                    ></div>
                    <span
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        staff.present ? "transform translate-x-5" : ""
                      }`}
                    ></span>
                  </label>
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
    </section>
  )
}

export default MAttendance