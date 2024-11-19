
import { useState } from 'react';

const MSchedule = () => {
  
  const dayDepartment = [
    "Reception",
    "Kitchen",
    "Wait Staff",
    "Security",
    "Housekeeping",
    // "Management"
  ];
  const nightDepartment = [
    "Reception",
    "Kitchen",
    "Wait Staff",
    "Security",
    "Housekeeping",
    // "Management"
  ];
  const dayShiftStaff = [
    { name: "Alice", department: "Reception", role: "Manager" },
    { name: "Bob", department: "Kitchen", role: "Chef" },
    { name: "Charlie", department: "Wait Staff", role: "Server" },
    { name: "David", department: "Security", role: "Guard" },
  ];
  
  const nightShiftStaff = [
    { name: "Eve", department: "Reception", role: "Night Manager" },
    { name: "Frank", department: "Kitchen", role: "Cook" },
    { name: "Grace", department: "Wait Staff", role: "Room Service" },
    { name: "Heidi", department: "Security", role: "Night Guard" },
  ];
  const [daySelectedDepartments, setDaySelectedDepartments] = useState(['All']);
  const [nightSelectedDepartments, setNightSelectedDepartments] = useState(['All']);
  // const toggleDepartmentSelection = (department) => {
  //   setSelectedDepartments([department]);
  // }
  const dayToggleDepartmentSelection = (dept) => {
    if (dept === "All") {
      setDaySelectedDepartments(daySelectedDepartments.includes("All") ? [] : ["All"]);
    } else {
      setDaySelectedDepartments((prev) =>
        prev.includes(dept)
          ? prev.filter((d) => d !== dept)
          : [prev.filter((d) => d !== "All"), dept]
      );
    }
  };
  const nightToggleDepartmentSelection = (dept) => {
    if (dept === "All") {
      setNightSelectedDepartments(nightSelectedDepartments.includes("All") ? [] : ["All"]);
    } else {
      setNightSelectedDepartments((prev) =>
        prev.includes(dept)
          ? prev.filter((d) => d !== dept)
          : [prev.filter((d) => d !== "All"), dept]
      );
    }
  };

  return (
    <section className=" h-screen p-2 mr-1 font-Montserrat">
      <h2 className="text-[#252941] text-2xl pl-4 mt-5 font-semibold">Shift Schedule</h2>
      <div className='flex flex-col justify-center mb-1 mt-6 pb-5 gap-5 px-3'>
      <div className="bg-white w-full  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
      <h2 className="text-[#252941]  text-lg pl-3 mt-2 md:mt-4 mb-2 font-semibold">Day Shift</h2>
      <div className=" hidden md:flex mb-2 pl-4 pb-2 gap-4 rounded-3xl pr-7">
            {/* "All" Button */}
            <button
              key="all"
              onClick={() => dayToggleDepartmentSelection('All')}
              className={`px-4 py-1 w-[100px] rounded-3xl font-semibold mt-2  border-none ${daySelectedDepartments.includes('All') ? "bg-[#6675C5] text-white" : "bg-[#E6EEF9] text-[#252941] font-semibold border border-gray-700"
                }`}
            >
              All
            </button>
            {dayDepartment.map((dept) => (
              <button
                key={dept}
                onClick={() => dayToggleDepartmentSelection(dept)}
                className={`px-2 py-1 w-[150px]  rounded-3xl border-none mt-2 font-semibold ${daySelectedDepartments.includes(dept)
                  ? "bg-[#6675C5] text-white"
                  : "bg-[#E6EEF9] text-[#252941] "
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <p className='px-3 mt-3 font-semibold text-[#252941]'>All Staff Members :</p>
        </div>
        <div className="bg-white w-full  pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
      <h2 className="text-[#252941]  text-lg pl-3 mt-2 md:mt-4 mb-2 font-semibold">
        Night Shift</h2>
        <div className=" hidden md:flex mb-2 pl-4 pb-2  gap-4 rounded-3xl pr-7">
            {/* "All" Button */}
            <button
              key="all"
              onClick={() => nightToggleDepartmentSelection('All')}
              className={`px-4 py-1 w-[100px] rounded-3xl font-semibold mt-2  border-none ${nightSelectedDepartments.includes('All') ? "bg-[#6675C5] text-white" : "bg-[#E6EEF9] text-[#252941] font-semibold border border-gray-700"
                }`}
            >
              All
            </button>
            {nightDepartment.map((dept) => (
              <button
                key={dept}
                onClick={() => nightToggleDepartmentSelection(dept)}
                className={`px-2 py-1 w-[150px]  rounded-3xl border-none mt-2 font-semibold ${nightSelectedDepartments.includes(dept)
                  ? "bg-[#6675C5] text-white"
                  : "bg-[#E6EEF9] text-[#252941] "
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <p className='px-3 mt-3 font-semibold text-[#252941]'>All Staff Members :</p>
        </div>
        </div>
      </section>
  )
}

export default MSchedule