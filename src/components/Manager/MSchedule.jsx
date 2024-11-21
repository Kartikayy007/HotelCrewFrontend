import { useState,useEffect,useMemo,useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const MSchedule = () => {
  const [daySearchQuery, setDaySearchQuery] = useState("");
  const [nightSearchQuery, setNightSearchQuery] = useState("");
  const departments = ["Reception", "Kitchen", "Maintainence", "Security", "Housekeeping","Parking"];
  const [selectedStaff, setSelectedStaff] = useState(null);
  const initialDayShiftStaff = [
    { id:1, name: "Alice ", department: "Reception",email: "alice@example.com",shift:"day" },
    { id:2, name: "Anu", department: "Reception",email: "alice@example.com" ,shift:"day"},
    {id:3,  name: "Ani", department: "Reception",email: "alice@example.com",shift:"day" },
    { id:4, name: "Mani", department: "Reception",email: "alice@example.com",shift:"day" },
    { id:5, name: "Shivam", department: "Kitchen",email: "alice@example.com",shift:"day" },
    { id:6, name: "Charlie", department: "Housekeeping",email: "alice@example.com",shift:"day" },
    { id:7, name: "Chiku", department: "Maintainence",email: "alice@example.com",shift:"day" },
    { id:8, name: "David", department: "Security" ,email: "alice@example.com",shift:"day"},
    { id:9, name: "Roger", department: "Security",email: "alice@example.com",shift:"day" },
    { id:10, name: "Kaur", department: "Parking",email: "alice@example.com" ,shift:"day"},
    { id:11, name: "Dope", department: "Parking",email: "alice@example.com" ,shift:"day"},
    {id:12,  name: "Dark", department: "Security",email: "alice@example.com" ,shift:"day"},
    { id:13, name: "Wild", department: "Kitchen",email: "alice@example.com" ,shift:"day"},
    { id:14, name: "Duck", department: "Security",email: "alice@example.com",shift:"day" },
    { id:15, name: "Puck", department: "Security" ,email: "alice@example.com",shift:"day"},
    { id:16, name: "Muck", department: "Security" ,email: "alice@example.com",shift:"day"},
    { id:17, name: "Chuck", department: "Security" ,email: "alice@example.com",shift:"day"},
    { id:18, name: "Diljeet", department: "Security",email: "alice@example.com",shift:"day" },
    { id:19, name: "Hitler", department: "Security",email: "alice@example.com",shift:"day" },
    { id:20, name: "crunchy", department: "Security",email: "alice@example.com",shift:"day" },

  ];
  const initialNightShiftStaff = [
    { id:21, name: "Andy", department: "Reception",email: "alice@example.com",shift:"night" },
    { id:22, name: "Abhi", department: "Reception",email: "alice@example.com",shift:"night" },
    
    { id:25, name: "Bob", department: "Kitchen" ,email: "alice@example.com",shift:"night"},
    { id:26, name: "Marle", department: "Housekeeping",email: "alice@example.com",shift:"night" },
    { id:27, name: "Piu", department: "Maintainence" ,email: "alice@example.com",shift:"night"},
    { id:28, name: "Mavid", department: "Kit" ,email: "alice@example.com",shift:"night"},
    { id:29, name: "Ben", department: "Security",email: "alice@example.com" ,shift:"night"},
    { id:30, name: "Ken", department: "Parking" ,email: "alice@example.com",shift:"night"},
    { id:31, name: "Deepti", department: "Parking" ,email: "alice@example.com",shift:"night"},
    { id:32,  name: "Dinesh", department: "Security" ,email: "alice@example.com",shift:"night"},
    { id:33, name: "Verma", department: "Security" ,email: "alice@example.com",shift:"night"},
    { id:40, name: "Shin", department: "Security" ,email: "alice@example.com",shift:"night"},
  ];

  const [daySelectedDepartment, setDaySelectedDepartment] = useState("All");
  const [nightSelectedDepartment, setNightSelectedDepartment] = useState("All");
  const [dayShiftStaff, setDayShiftStaff] = useState(initialDayShiftStaff);
  const [nightShiftStaff, setNightShiftStaff] = useState(initialNightShiftStaff);
  const [infoBoxPosition, setInfoBoxPosition] = useState({ x: 0, y: 0 });
  const [clickedElement, setClickedElement] = useState(null);


  const handleNameClick = (e, staff) => {
    const { left, top, height, width } = e.target.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const infoBoxHeight = 150; 
    const infoBoxWidth = 200;

    let xPosition = left;
    let yPosition;

    
    const spaceBelow = viewportHeight - (top + height);
    if (spaceBelow < infoBoxHeight) {
      
      yPosition = top - infoBoxHeight + window.scrollY;
    } else {
     
      yPosition = top + height + window.scrollY;
    }

   
    if (left + infoBoxWidth > window.innerWidth) {
      xPosition = window.innerWidth - infoBoxWidth - 16; 
    }

    setSelectedStaff(staff);
    setInfoBoxPosition({ x: xPosition, y: yPosition });
    setClickedElement(e.target); 
  };
  const infoBoxRef = useRef(null);  
  const shiftBoxRef = useRef(null);
  useEffect(() => {
    const handleScroll = (e) => {
      console.log("Scroll event detected");  
      console.log("Scroll target:", e.target);
      setSelectedStaff(null);
    };

    
    const shiftBoxElement = shiftBoxRef.current;
    if (shiftBoxElement) {
      shiftBoxElement.addEventListener("scroll", handleScroll);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (shiftBoxElement) {
        shiftBoxElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [selectedStaff]);// Effect depends on the selectedStaff state

  
  const handleDragStart = (e, staff, shift) => {
    e.dataTransfer.setData("staff", JSON.stringify(staff));
    e.dataTransfer.setData("shift", shift);
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
     
      if (!selectedStaff) {
        return;
      }
      console.log("Outside click detected");
      // console.log(selectedStaff);
      if (
        selectedStaff &&
        !e.target.closest(".info-box") &&
        !e.target.classList.contains("switch-shift-button")
      ) {
        setSelectedStaff(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [selectedStaff]);

  const handleSwitchShift = () => {
    if (!selectedStaff) {
      console.log("No staff selected");
      return;
    }
    console.log("staff selected");
    const isDayShift = dayShiftStaff.some((staff) => staff.id === selectedStaff.id);
    const updatedStaff = { ...selectedStaff, shift: isDayShift ? "night" : "day" };
  
   
    if (isDayShift) {
     
      setDayShiftStaff((prev) => prev.filter((staff) => staff.id !== selectedStaff.id));
      setNightShiftStaff((prev) => [...prev, updatedStaff]);
    } else {
      
      setNightShiftStaff((prev) => prev.filter((staff) => staff.id !== selectedStaff.id));
      setDayShiftStaff((prev) => [...prev, updatedStaff]);
    }
  
  
    setSelectedStaff(null);
  };
  const handleDrop = (e, targetShift) => {
    const staff = JSON.parse(e.dataTransfer.getData("staff"));
    const sourceShift = e.dataTransfer.getData("shift");

    const updatedStaff = { ...staff, shift: targetShift };

    if (sourceShift === targetShift) return;

    if (sourceShift === "day") {
      setDayShiftStaff((prev) => prev.filter((s) => s.id !== staff.id));
      setNightShiftStaff((prev) => [...prev, updatedStaff]);
    } else {
      setNightShiftStaff((prev) => prev.filter((s) => s.id !== staff.id));
      setDayShiftStaff((prev) => [...prev, updatedStaff]);
    }
  };

  const handleDepartmentSelection = (dept, setSelectedDepartment) => {
    setSelectedDepartment(dept);
  };
  const renderShiftSection = (shift,
    selectedDepartment,
    setSelectedDepartment,
    staff,
    searchQuery,
    setSearchQuery) => {

    const filteredStaff = useMemo(()=>{
      return staff.filter(
      (member) =>
        (selectedDepartment === "All" || member.department === selectedDepartment) &&
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },[staff, selectedDepartment, searchQuery]);
    return (
        <div
        ref={shiftBoxRef}
        className=" shift-box bg-white max-h-[330px]  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent w-full pt-4 pb-1 pr-6 pl-6 rounded-lg shadow"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, shift)}
      >
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
        <div className="hidden sm:flex-wrap sm:flex mb-2 pl-2 pb-2 rounded-3xl pr-2">
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
                className="bg-[#E6EEF9] px-4 py-1 rounded-2xl shadow text-center cursor-pointer "
                onClick={(e) => handleNameClick(e, member)}
                draggable
                onDragStart={(e) => handleDragStart(e, member, shift)}
              >
                {member.name}
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
      {selectedStaff && (
         <div
         ref={infoBoxRef}
         className="info-box fixed  bg-white p-4 rounded-lg shadow-xl"
         style={{ top: infoBoxPosition.y, left: infoBoxPosition.x, zIndex: 10 }}
       >
          <p><span className='font-semibold'>Name :</span> {selectedStaff.name}</p>
          <p><span className='font-semibold'>E-mail :</span> {selectedStaff.email}</p>
          <p><span className='font-semibold'>Department :</span> {selectedStaff.department}</p>
          <p><span className='font-semibold'>Shift :</span> {selectedStaff.shift}</p>
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            onClick={() => setSelectedStaff(null)}
          >
            ✕
          </button>
          <button
            className="switch-shift-button mt-3 px-4 py-1 items-center cursor-pointer bg-[#252941] text-white rounded-lg"
            onClick={handleSwitchShift}
          >
            Switch Shift
          </button>
        </div>
      )}
    </section>
  );
};

export default MSchedule;
