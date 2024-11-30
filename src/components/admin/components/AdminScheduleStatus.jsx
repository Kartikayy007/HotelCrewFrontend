import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { 
  Snackbar, 
  Alert
} from '@mui/material';
import { 
  fetchShifts,
  selectScheduleList,
  selectShiftsLoading,
  selectShiftsError
} from '../../../redux/slices/ShiftSlice';

// Constants for filters
const SHIFT_FILTERS = {
  ALL: 'all',
  MORNING: 'morning',
  EVENING: 'evening',
  NIGHT: 'night'
};

function AdminScheduleStatus() {
  const dispatch = useDispatch();
  const scheduleList = useSelector(selectScheduleList);
  const loading = useSelector(selectShiftsLoading);
  const error = useSelector(selectShiftsError);

  // Single declaration of all state variables
  const [draggedStaff, setDraggedStaff] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [targetShift, setTargetShift] = useState(null);
  const [activeFilter, setActiveFilter] = useState(SHIFT_FILTERS.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState(SHIFT_FILTERS.ALL);
  const [filteredStaff, setFilteredStaff] = useState([]); // Single declaration
  const [dayShiftStaff, setDayShiftStaff] = useState([]);
  const [eveningShiftStaff, setEveningShiftStaff] = useState([]);
  const [nightShiftStaff, setNightShiftStaff] = useState([]);
  const [isShiftChangeMode, setIsShiftChangeMode] = useState(false);

  // Fetch shifts on mount
  useEffect(() => {
    dispatch(fetchShifts());
    const interval = setInterval(() => {
      dispatch(fetchShifts());
    }, 300000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Update filtered lists when scheduleList changes
  useEffect(() => {
    if (scheduleList) {
      setFilteredStaff(scheduleList);
      setDayShiftStaff(scheduleList.filter(staff => staff.shift?.toLowerCase() === SHIFT_FILTERS.MORNING));
      setEveningShiftStaff(scheduleList.filter(staff => staff.shift?.toLowerCase() === SHIFT_FILTERS.EVENING));
      setNightShiftStaff(scheduleList.filter(staff => staff.shift?.toLowerCase() === SHIFT_FILTERS.NIGHT));
    }
  }, [scheduleList]);

  const handleDragStart = (e, staff) => {
    setDraggedStaff(staff);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newShift) => {
    e.preventDefault();
  
    if (draggedStaff && isShiftChangeMode) {
      setTargetShift(newShift);
      const updatedFilteredStaff = scheduleList.map(staff =>
        staff.id === draggedStaff.id ? { ...staff, shift: newShift } : staff
      );
  
      setFilteredStaff(updatedFilteredStaff);
      setDayShiftStaff(updatedFilteredStaff.filter(staff => staff.shift?.toLowerCase() === "morning"));
      setEveningShiftStaff(updatedFilteredStaff.filter(staff => staff.shift?.toLowerCase() === "evening"));
      setNightShiftStaff(updatedFilteredStaff.filter(staff => staff.shift?.toLowerCase() === "night"));
  
  
      dispatch(updateShift({ userId: draggedStaff.id, shift: newShift }))
        .then(() => {
          // Fetch the updated schedule list after backend update
          dispatch(fetchShifts());
        })
        .catch((error) => {
          console.error("Failed to update shift:", error);
          // Revert the optimistic update if the backend call fails
        setFilteredStaff(scheduleList);
        setDayShiftStaff(scheduleList.filter(staff => staff.shift?.toLowerCase() === "morning"));
        setEveningShiftStaff(scheduleList.filter(staff => staff.shift?.toLowerCase() === "evening"));
        setNightShiftStaff(scheduleList.filter(staff => staff.shift?.toLowerCase() === "night"));
      
        });
  
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
  console.log("activeFilter:", activeFilter);
  console.log("searchTerm:", searchTerm);
  console.log("selectedShift:", selectedShift);
  console.log("M",dayShiftStaff);
  console.log("E",eveningShiftStaff);
  console.log("N",nightShiftStaff);
  
useEffect(() => {
  if (Array.isArray(scheduleList)) {
    const updatedFilteredStaff = scheduleList.filter((staff) => {
      // Case-insensitive matching for department
      const departmentMatch =
        activeFilter === "All" || 
        staff.department?.toLowerCase() === activeFilter.toLowerCase();

      // Case-insensitive matching for search term
      const searchMatch = staff.user_name
        ? staff.user_name.toLowerCase().includes(searchTerm.toLowerCase())
        : false;

      // Case-insensitive matching for shift
      const shiftMatch =
        selectedShift === "All Shifts" || 
        staff.shift?.toLowerCase() === selectedShift.toLowerCase();

      return departmentMatch && searchMatch && shiftMatch;
    });

    setFilteredStaff(updatedFilteredStaff);

    // Update shift-specific lists
    setDayShiftStaff(
      updatedFilteredStaff.filter((staff) => staff.shift?.toLowerCase() === "morning")
    );
    setEveningShiftStaff(
      updatedFilteredStaff.filter((staff) => staff.shift?.toLowerCase() === "evening")
    );
    setNightShiftStaff(
      updatedFilteredStaff.filter((staff) => staff.shift?.toLowerCase() === "night")
    );
  }
}, [scheduleList, activeFilter, searchTerm, selectedShift]);
const [selectedDepartments, setSelectedDepartments] = useState(['All']);
useEffect(() => {
  if (scheduleList && scheduleList.length > 0) {
    // Extract unique departments, ignoring case
    const uniqueDepartments = [
      ...new Set(scheduleList.map((item) => item.department.toLowerCase()))
    ];

    setDepartment(uniqueDepartments);
    if (selectedDepartments.length === 0) {
      setSelectedDepartments(["All"]); // Select 'All' by default
    }
  }
}, [scheduleList]);

  const ShiftSection = ({ title, staff, shiftType }) => (
    <div className="h-auto sm:h-80">
      <div className="px-2 xs:px-4 sm:px-8">
        <div 
          className={`bg-white ${shiftType !== "morning" ? "mt-6 sm:mt-11" : ""}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, shiftType)}
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
              {staff.map((staff) => (
                <div
                  // key={`${shift}-${index}`}
                  key={staff.id}
                  draggable={isShiftChangeMode}
                  onDragStart={(e) => handleDragStart(e, staff)}
                  className={`rounded-3xl text-sm xs:text-base sm:text-xl 
                    ${isShiftChangeMode 
                      ? 'cursor-move hover:bg-blue-100 transition-colors' 
                      : ''} 
                    bg-[#E6EEF9] min-w-[100px] xs:min-w-[120px] sm:min-w-32 
                    text-center p-1.5 xs:p-2 sm:p-3`}
                >
                  <p>{staff.user_name}</p>
                  <p className="text-xs text-gray-500">{staff.department}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const [department, setDepartment] = useState([]);
  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-auto scrollbar-thin p-1 xs:p-2 sm:p-4">
      <h1 className="text-[#252941] text-3xl my-4 pl-12 font-semibold">
        Schedule status
      </h1>

      <div>
        <div className="bg-white rounded-lg shadow-lg mx-6 min-h-[calc(118vh-120px)] lg:h-[80rem]">
          <div className="z-10 pb-2 xs:pb-4 sm:pb-6">
            <div className="flex justify-between items-start sm:items-center p-2 xs:p-4 sm:p-6">
              <h1 className="font-semibold text-lg xs:text-xl sm:text-2xl mb-2 xs:mb-4 sm:mb-0">
                Filters
              </h1>
              <button 
                onClick={toggleShiftChangeMode} 
                className={`text-xs xs:text-base sm:text-base md:text-base lg:text-base font-semibold text-white rounded-full p-1.5 xs:p-2 px-3 xs:px-4 lg:mr-9 sm:px-6 transition-colors
                  ${isShiftChangeMode 
                    ? 'bg-red-500 hover:bg-red-600 ease-in-out' 
                    : 'bg-[#5663AC] hover:bg-[#6675C5] ease-in-out'}`}
              >
                {isShiftChangeMode ? 'Cancel' : 'Change Shift'}
              </button>
            </div>

            <div className="flex flex-col lg:justify-between lg:flex-row px-2 xs:px-4 sm:px-6 space-y-2 xs:space-y-4 lg:space-y-0">
              <div className="flex gap-2 xs:gap-3 sm:gap-5 text-black font-medium w-full lg:w-2/3 overflow-x-auto scrollbar-none scrollbar-thumb-[#E6EEF9] scrollbar-track-transparent pb-2">
              <button
              key="all"
              onClick={() => setActiveFilter("All")}
              className={`px-4 py-1 w-auto rounded-3xl font-semibold  border-none ${activeFilter.includes('All') ? "bg-[#6675C5] text-white" : "bg-[#E6EEF9] text-[#252941] font-semibold border border-gray-700"
                }`}
            >
              All
            </button>
                {department.map((department) => (
                  <button
                    key={department}
                    onClick={() => setActiveFilter(department)}
                    className={`p-1.5 xs:p-2 sm:p-2
                      min-w-30 text-[14px] xs:text-lg sm:text-sm md:text-base lg:text-lg 
                      rounded-3xl capitalize
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

          <ShiftSection title="Morning Shift" staff={dayShiftStaff} shiftType="morning" />
          <ShiftSection title="Evening Shift" staff={eveningShiftStaff} shiftType="evening" />
          <ShiftSection title="Night Shift" staff={nightShiftStaff} shiftType="night" />
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
