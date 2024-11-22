import React, { useState } from "react";
import { Search, Move } from "lucide-react";
import { Snackbar, Alert } from '@mui/material';

function AdminScheduleStatus() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShift, setSelectedShift] = useState("All Shifts");
  const [isShiftChangeMode, setIsShiftChangeMode] = useState(false);
  const [staffData, setStaffData] = useState([
    {name: "Ben Smith", department: "Kitchen", shift: "Day Shift"},
    {name: "Sarah Johnson", department: "Housekeeping", shift: "Night Shift"},
    {name: "Mike Chen", department: "Kitchen", shift: "Night Shift"},
    {name: "Maria Garcia", department: "Reception", shift: "Day Shift"},
    {name: "Alex Wong", department: "Security", shift: "Night Shift"},
    {name: "Lisa Parker", department: "Housekeeping", shift: "Day Shift"},
    {name: "James Wilson", department: "Reception", shift: "Night Shift"},
    {name: "Priya Patel", department: "Security", shift: "Day Shift"},
    {name: "Emma Rodriguez", department: "Kitchen", shift: "Day Shift"},
    {name: "David Kim", department: "Security", shift: "Night Shift"},
    {name: "Anna Lee", department: "Housekeeping", shift: "Day Shift"},
    {name: "Carlos Mendes", department: "Reception", shift: "Night Shift"}
  ]);
  
  const [draggedStaff, setDraggedStaff] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [targetShift, setTargetShift] = useState(null);
  
  const handleDragStart = (e, staff) => {
    if (isShiftChangeMode) {
      setDraggedStaff(staff);
      e.dataTransfer.setData('text/plain', ''); 
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault(); 
  };
  
  const handleDrop = (e, newShift) => {
    e.preventDefault();
    if (draggedStaff && isShiftChangeMode) {
      setTargetShift(newShift);
      
      const updatedStaffData = staffData.map(staff => 
        staff.name === draggedStaff.name 
          ? { ...staff, shift: newShift }
          : staff
      );
      
      setStaffData(updatedStaffData);
      setDraggedStaff(null);
      setSnackbarOpen(true); 
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setTargetShift(null); 
  };

  const toggleShiftChangeMode = () => {
    setIsShiftChangeMode(!isShiftChangeMode);
  };

  const filteredStaff = staffData.filter((staff) => {
    const departmentMatch =
      activeFilter === "All" ||
      staff.department.toLowerCase() === activeFilter.toLowerCase();

    const searchMatch = staff.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const shiftMatch =
      selectedShift === "All Shifts" || staff.shift === selectedShift;

    return departmentMatch && searchMatch && shiftMatch;
  });

  const dayShiftStaff = filteredStaff.filter(
    (staff) => staff.shift === "Day Shift"
  );
  const nightShiftStaff = filteredStaff.filter(
    (staff) => staff.shift === "Night Shift"
  );

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-1 xs:p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        Schedule status
      </h1>

      <div>
        <div className="bg-white rounded-lg shadow-lg mx-6 min-h-[calc(100vh-120px)] lg:h-[55rem]">
          <div className="z-10 pb-2 xs:pb-4 sm:pb-6">
            <div className="flex justify-between items-start sm:items-center p-2 xs:p-4 sm:p-6">
              <h1 className="font-semibold text-lg xs:text-xl sm:text-2xl mb-2 xs:mb-4 sm:mb-0">
                Filters
              </h1>
              <button 
                onClick={toggleShiftChangeMode} 
                className={`text-xs xs:text-sm sm:text-base md:text-base lg:text-base font-semibold text-white rounded-full p-1.5 xs:p-2 px-3 xs:px-4 lg:mr-9 sm:px-6 transition-colors
                  ${isShiftChangeMode 
                    ? 'bg-red-500 hover:bg-red-600 ease-in-out' 
                    : 'bg-[#5663AC] hover:bg-[#6675C5] ease-in-out'}`}
              >
                {isShiftChangeMode ? 'Cancel' : 'Change Shift'}
              </button>
            </div>

            <div className="flex flex-col lg:justify-between lg:flex-row px-2 xs:px-4 sm:px-6 space-y-2 xs:space-y-4 lg:space-y-0">
              <div className="flex gap-2 xs:gap-3 sm:gap-5 text-black font-medium w-full lg:w-2/3 overflow-x-auto pb-2">
                {[
                  "All",
                  "Kitchen",
                  "Housekeeping",
                  "Reception",
                  "Security",
                ].map((department) => (
                  <button
                    key={department}
                    onClick={() => setActiveFilter(department)}
                    className={`p-1.5 xs:p-2 sm:p-3 
                      min-w-16 xs:min-w-20 
                      text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg 
                    rounded-3xl 
                    whitespace-nowrap 
                    transition-colors 
                      ${
                        activeFilter === department
                          ? "bg-[#6675C5] text-white"
                          : "bg-[#E6EEF9] hover:bg-[#D1DFEF]"
                      }`}
                  >
                    {department}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center w-full lg:w-auto lg:m-9">
                <input
                  className="p-1.5 xs:p-2 sm:p-3 pl-10 xs:pl-12 sm:pl-14 bg-[#E6EEF9] rounded-3xl w-full lg:w- text-xs xs:text-sm sm:text-base"
                  placeholder="Search staff"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute left-3 xs:left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={18}
                />
              </div>
            </div>
          </div>

          <div className="h-auto sm:h-80">
            <div className="px-2 xs:px-4 sm:px-8">
              <div 
                className="bg-white"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "Day Shift")}
              >
                <div className="sticky z-20 bg-white py-2 xs:py-4 flex items-center justify-between">
                  <h2 className="text-base xs:text-lg sm:text-xl font-semibold">
                    Day Shift ({dayShiftStaff.length})
                  </h2>
                  {isShiftChangeMode && (
                    <div className="text-sm text-gray-500 flex items-center">
                      <Move className="mr-2" size={16} />
                      Drag staff to change shift
                    </div>
                  )}
                </div>
                <div className="h-[180px] xs:h-[200px] sm:h-[280px] overflow-y-auto">
                  <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 pt-2">
                    {dayShiftStaff.map((staff, index) => (
                      <div
                        key={`day-${index}`}
                        draggable={isShiftChangeMode}
                        onDragStart={(e) => handleDragStart(e, staff)}
                        className={`rounded-3xl text-sm xs:text-base sm:text-xl 
                          ${isShiftChangeMode 
                            ? 'cursor-move hover:bg-blue-100 transition-colors' 
                            : ''} 
                          bg-[#E6EEF9] min-w-[100px] xs:min-w-[120px] sm:min-w-32 
                          text-center p-1.5 xs:p-2 sm:p-3`}
                      >
                        <p>{staff.name}</p>
                        <p className="text-xs text-gray-500">{staff.department}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-auto sm:h-80">
            <div className="px-4 sm:px-8">
              <div 
                className="relative bg-white mt-6 sm:mt-11"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "Night Shift")}
              >
                <div className="sticky top-0 z-20 bg-white py-4 flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Night Shift ({nightShiftStaff.length})
                  </h2>
                  {isShiftChangeMode && (
                    <div className="text-sm text-gray-500 flex items-center">
                      <Move className="mr-2" size={16} />
                      Drag staff to change shift
                    </div>
                  )}
                </div>
                <div className="h-[200px] sm:h-[280px] overflow-y-auto">
                  <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                    {nightShiftStaff.map((staff, index) => (
                      <div
                        key={`night-${index}`}
                        draggable={isShiftChangeMode}
                        onDragStart={(e) => handleDragStart(e, staff)}
                        className={`rounded-3xl text-base sm:text-xl 
                          ${isShiftChangeMode 
                            ? 'cursor-move hover:bg-blue-100 transition-colors' 
                            : ''} 
                          bg-[#E6EEF9] min-w-[120px] sm:min-w-32 
                          text-center p-2 sm:p-3`}
                      >
                        
                        <p>{staff.name}</p>
                        <p className="text-xs text-gray-500">{staff.department}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <Alert 
    onClose={handleSnackbarClose} 
    severity="success"
    variant="filled"
    sx={{ 
      width: '100%',
      '& .MuiAlert-filledSuccess': {
        backgroundColor: '#4CAF50'
      }
    }}
  >
    {draggedStaff && targetShift ? 
      `Shift updated successfully` : 
      'Shift updated successfully'
    }
  </Alert>
</Snackbar>
    </section>
  );
}

export default AdminScheduleStatus;