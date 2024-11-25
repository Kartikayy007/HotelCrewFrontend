import React, { useState, useEffect } from "react";
import { Search, Move } from "lucide-react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedules } from '../../../redux/slices/scheduleSlice';

// Draggable Staff Card Component
const StaffCard = ({ staff, isShiftChangeMode }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'STAFF',
    item: () => ({ staff }),
    canDrag: isShiftChangeMode,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [staff, isShiftChangeMode]);

  return (
    <div
      ref={drag}
      className={`rounded-3xl text-sm xs:text-base sm:text-xl 
        ${isShiftChangeMode ? 'cursor-move hover:bg-blue-100 transition-colors' : ''} 
        bg-[#E6EEF9] min-w-[100px] xs:min-w-[120px] sm:min-w-32 
        text-center p-1.5 xs:p-2 sm:p-3`}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: isShiftChangeMode ? 'move' : 'default'
      }}
    >
      <p>{staff.name}</p>
      <p className="text-xs text-gray-500">{staff.department}</p>
    </div>
  );
};

// Droppable Shift Section
const ShiftSection = ({ title, staff, shiftType, isShiftChangeMode, onStaffDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'STAFF',
    drop: (item) => {
      if (item.staff.shift !== shiftType) {
        onStaffDrop(item.staff, shiftType);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), [shiftType, onStaffDrop]);

  return (
    <div className="h-auto sm:h-80">
      <div className="px-2 xs:px-4 sm:px-8">
        <div 
          ref={drop}
          className={`bg-white ${shiftType !== "Day Shift" ? "mt-6 sm:mt-11" : ""} 
            ${isOver && isShiftChangeMode ? 'bg-blue-50 transition-colors duration-200' : ''}`}
        >
          <div className="sticky z-20 bg-white py-2 xs:py-4 flex items-center justify-between">
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold">
              {title} ({staff.length})
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
              {staff.map((staffMember) => (
                <StaffCard 
                  key={staffMember.name}
                  staff={staffMember}
                  isShiftChangeMode={isShiftChangeMode}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function AdminScheduleStatus() {
  const dispatch = useDispatch();
  const { schedules, status, error } = useSelector((state) => state.schedule);

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isShiftChangeMode, setIsShiftChangeMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [targetShift, setTargetShift] = useState('');

  const handleStaffDrop = (staff, newShift) => {
    const updatedStaffData = schedules.map(s => 
      s.user_name === staff.name ? { ...s, shift: newShift } : s
    );
    
    setStaffData(updatedStaffData);
    setTargetShift(newShift);
    setSnackbarOpen(true);
  };

  const filteredStaff = schedules.filter((staff) => {
    const departmentMatch =
      activeFilter === "All" ||
      staff.department.toLowerCase() === activeFilter.toLowerCase();
    const searchMatch = staff.user_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return departmentMatch && searchMatch;
  });

  const dayShiftStaff = filteredStaff.filter(
    (staff) => staff.shift === "Day Shift"
  );
  const eveningShiftStaff = filteredStaff.filter(
    (staff) => staff.shift === "Evening Shift"
  );
  const nightShiftStaff = filteredStaff.filter(
    (staff) => staff.shift === "Night Shift"
  );

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-1 xs:p-2 sm:p-4">
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Staff moved to {targetShift} successfully
          </Alert>
        </Snackbar>
        
        <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
          Schedule status
        </h1>

        <div className="bg-white rounded-lg shadow-lg mx-6 min-h-[calc(118vh-120px)] lg:h-[80rem]">
          <div className="z-10 pb-2 xs:pb-4 sm:pb-6">
            {/* Filters header */}
            <div className="flex justify-between items-start sm:items-center p-2 xs:p-4 sm:p-6">
              <h1 className="font-semibold text-lg xs:text-xl sm:text-2xl mb-2 xs:mb-4 sm:mb-0">
                Filters
              </h1>
              <button 
                onClick={() => setIsShiftChangeMode(!isShiftChangeMode)} 
                className={`text-xs xs:text-sm sm:text-base md:text-base lg:text-base font-semibold text-white rounded-full p-1.5 xs:p-2 px-3 xs:px-4 lg:mr-9 sm:px-6 transition-colors
                  ${isShiftChangeMode 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-[#5663AC] hover:bg-[#6675C5]'}`}
              >
                {isShiftChangeMode ? 'Cancel' : 'Change Shift'}
              </button>
            </div>

            {/* Filter buttons and search */}
            <div className="flex flex-col lg:justify-between lg:flex-row px-2 xs:px-4 sm:px-6 space-y-2 xs:space-y-4 lg:space-y-0">
              <div className="flex gap-2 xs:gap-3 sm:gap-5 text-black font-medium w-full lg:w-2/3 overflow-x-auto pb-2">
                {["All", "Kitchen", "Housekeeping", "Reception", "Security"].map((department) => (
                  <button
                    key={department}
                    onClick={() => setActiveFilter(department)}
                    className={`p-1.5 xs:p-2 sm:p-3 
                      min-w-16 xs:min-w-20 
                      text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg 
                      rounded-3xl whitespace-nowrap transition-colors 
                      ${activeFilter === department
                        ? "bg-[#6675C5] text-white"
                        : "bg-[#E6EEF9] hover:bg-[#D1DFEF]"}`}
                  >
                    {department}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center w-full lg:w-auto lg:m-9">
                <input
                  className="p-1.5 xs:p-2 sm:p-3 pl-10 xs:pl-12 sm:pl-14 bg-[#E6EEF9] rounded-3xl w-full lg:w-auto text-xs xs:text-sm sm:text-base"
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

          <ShiftSection 
            title="Day Shift" 
            staff={dayShiftStaff} 
            shiftType="Day Shift"
            isShiftChangeMode={isShiftChangeMode}
            onStaffDrop={handleStaffDrop}
          />
          <ShiftSection 
            title="Evening Shift" 
            staff={eveningShiftStaff} 
            shiftType="Evening Shift"
            isShiftChangeMode={isShiftChangeMode}
            onStaffDrop={handleStaffDrop}
          />
          <ShiftSection 
            title="Night Shift" 
            staff={nightShiftStaff} 
            shiftType="Night Shift"
            isShiftChangeMode={isShiftChangeMode}
            onStaffDrop={handleStaffDrop}
          />
        </div>
      </section>
    </DndProvider>
  );
}

export default AdminScheduleStatus;