import { useState } from 'react';


const MSchedule = () => {
  const [daySearchQuery, setDaySearchQuery] = useState("");
  const [nightSearchQuery, setNightSearchQuery] = useState("");
  const departments = ["Reception", "Kitchen", "Maintainence", "Security", "Housekeeping","Parking"];
  const dayShiftStaff = [
    { name: "Alice bilu", department: "Reception" },
    { name: "Anu", department: "Reception" },
    { name: "Andy", department: "Reception" },
    { name: "Abhi", department: "Reception" },
    { name: "Bob", department: "Kitchen" },
    { name: "Charlie", department: "Housekeeping"},
    { name: "Chiku", department: "Maintainence" },
    { name: "David", department: "Security"},
    { name: "Roger", department: "Security"},
    { name: "Kaur", department: "Parking"},
    { name: "Dope", department: "Parking"},
    { name: "Dark", department: "Security"},
    { name: "Wild", department: "Security"},
    { name: "Duck", department: "Security"},
    { name: "Puck", department: "Security"},
    { name: "Muck", department: "Security"},
    { name: "Chuck", department: "Security"},
    { name: "Diljeet", department: "Security"},
    { name: "Hitler", department: "Security"},
    { name: "crunchy", department: "Security"},
  ];
  const nightShiftStaff = [
    { name: "Eve", department: "Reception", role: "Night Manager" },
    { name: "Frank", department: "Kitchen", role: "Cook" },
    { name: "Grace", department: "Housekeeping", role: "Room Service" },
    { name: "Heidi", department: "Security", role: "Night Guard" },
    { name: "Charlie", department: "Housekeeping"},
    { name: "Chiku", department: "Maintainence" },
    { name: "David", department: "Security"},
    { name: "Roger", department: "Security"},
    { name: "Kaur", department: "Parking"},
    { name: "Dope", department: "Parking"},
    { name: "Dark", department: "Security"},
    { name: "Wild", department: "Security"},
    { name: "Duck", department: "Security"},
    { name: "Puck", department: "Security"},
    { name: "Muck", department: "Security"},
    { name: "Chuck", department: "Security"},
    { name: "Diljeet", department: "Security"},
    { name: "Hitler", department: "Security"},
    { name: "crunchy", department: "Security"},
  ];

  const [daySelectedDepartment, setDaySelectedDepartment] = useState("All");
  const [nightSelectedDepartment, setNightSelectedDepartment] = useState("All");

  const handleDepartmentSelection = (dept, setSelectedDepartment) => {
    setSelectedDepartment(dept);
  };
  const renderShiftSection = (shift,
    selectedDepartment,
    setSelectedDepartment,
    staff,
    searchQuery,
    setSearchQuery) => {
    const filteredStaff = staff.filter(
      (member) =>
        (selectedDepartment === "All" || member.department === selectedDepartment) &&
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
      <div className="bg-white min-h-[330px] overflow-y-auto  w-full pt-4 pb-1 pr-6 pl-6 rounded-lg shadow">
        <div className='flex flex-col sm:flex-row gap-10 justify-between'>
        <h2 className="text-[#252941] text-2xl pl-3 mt-2 md:mt-4 mb-2 font-semibold">
          {shift === "day" ? "Day Shift" : "Night Shift"}
          </h2>
          <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Staff"
          className="border  w-[300px] rounded-3xl   px-3 py-0 mt-3 focus:outline-none"
        />
        </div>
        <div className="hidden md:flex-wrap md:flex mb-2 pl-2 pb-2 rounded-3xl pr-2">
          <button
            key="all"
            onClick={() => handleDepartmentSelection("All", setSelectedDepartment)}
            className={`px-4 py-1 w-[100px] rounded-3xl mx-2 font-semibold mt-2 border-none ${
              selectedDepartment === "All"
                ? "bg-[#6675C5] text-white"
                : "bg-[#E6EEF9] text-[#252941] font-semibold border border-gray-700"
            }`}
          >
            All
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => handleDepartmentSelection(dept, setSelectedDepartment)}
              className={`px-2 py-1 w-[140px] mx-2 rounded-3xl border-none mt-2 font-semibold ${
                selectedDepartment === dept
                  ? "bg-[#6675C5] text-white"
                  : "bg-[#E6EEF9] text-[#252941]"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
        
        <p className="px-3 mt-3 font-semibold text-lg text-[#252941]">Staff Members:</p>
        
        
      
        <div className="flex flex-wrap gap-3 mt-5 mb-10 rounded-xl mx-4">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((member) => (
              <div
                key={`${member.name}-${member.department}`}
                className="bg-[#E6EEF9] px-4 py-1 rounded-2xl shadow text-center font-semibold"
              >
                <span>{member.name}</span>
              </div>
            ))
          ) : (
            <p className="text-red-500 font-semibold">Match not found</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="h-screen p-2 mr-1 font-Montserrat">
      <h2 className="text-[#252941] text-2xl pl-4 mt-5 font-semibold">Shift Schedule</h2>
      <div className="flex flex-col justify-center mb-1 mt-6 pb-5 gap-5 px-3">
        {renderShiftSection(
          "day",
          daySelectedDepartment,
          setDaySelectedDepartment,
          dayShiftStaff,
          daySearchQuery,
          setDaySearchQuery
        )}
        {renderShiftSection(
          "night",
          nightSelectedDepartment,
          setNightSelectedDepartment,
          nightShiftStaff,
          nightSearchQuery,
          setNightSearchQuery
        )}
      </div>
    </section>
  );
};

export default MSchedule;
