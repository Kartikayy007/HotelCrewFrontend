import React, { useState, useEffect } from "react";
import { Search, Move } from "lucide-react";
import { Snackbar, Alert, Skeleton, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShifts, updateShift } from '../../../redux/slices/ShiftSlice';
import { Info as InfoIcon } from 'lucide-react';



function AdminScheduleStatus() {
  const dispatch = useDispatch();
  const [showHelpSnackbar, setShowHelpSnackbar] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const shouldShow = localStorage.getItem('showDragDropHelp') !== 'false';
    if (shouldShow) {
      // Show message after random delay (3-10 seconds)
      const timeout = setTimeout(() => {
        setShowHelpSnackbar(true);
      }, Math.random() * 7000 + 3000);

      return () => clearTimeout(timeout);
    }
  }, []);

  const handleDontShowAgain = () => {
    localStorage.setItem('showDragDropHelp', 'false');
    setShowHelpSnackbar(false);
  };

  const handleCloseHelp = () => {
    setShowHelpSnackbar(false);
  };

  useEffect(() => {
    dispatch(fetchShifts());
  }, [dispatch]);
  
  
  const { loading, error, updateLoading, updateError, updatedShift } = useSelector((state) => state.shifts?.scheduleList || {});
  const scheduleList = useSelector((state) => state.shifts.scheduleList);


  if (loading) {
    return (
      <div className="bg-[#E6EEF9] h-full w-full p-4">
        <h1 className="text-[#252941] text-3xl my-4 pl-12 font-semibold">
          Schedule status
        </h1>
        <div className="bg-white rounded-lg shadow-lg mx-6 min-h-[calc(118vh-120px)] lg:h-[80rem] p-6">
          <ShiftSectionSkeleton />
          <ShiftSectionSkeleton />
          <ShiftSectionSkeleton />
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;
if(!scheduleList) return <div>no data in scgedulelist</div>;
//   if (!scheduleList || !Array.isArray(scheduleList) || scheduleList.length === 0) {
//   return <div>No data in schedule list</div>;
// }
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShift, setSelectedShift] = useState("All Shifts");
  const [isShiftChangeMode, setIsShiftChangeMode] = useState(false);
  
  const [draggedStaff, setDraggedStaff] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [targetShift, setTargetShift] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isChangingShift, setIsChangingShift] = useState(false);
  
  const handleDragStart = (e, staff) => {
    console.log('Drag Start Data:', staff); // Debug log
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: staff.id || staff.user_id || staff._id,
      name: staff.user_name,
      currentShift: staff.shift
    }));
  };
  
  const handleDragOver = (e) => {
    e.preventDefault(); 
  };
  
  const capitalizeShift = (shift) => {
    const shiftMap = {
      'morning': 'Morning',
      'evening': 'Evening',
      'night': 'Night'
    };
    return shiftMap[shift.toLowerCase()] || shift;
  };

  const handleDrop = async (e, targetShift) => {
    e.preventDefault();
    const staffData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    const currentShift = staffData.currentShift.toLowerCase();
    const newShift = targetShift.toLowerCase();
    
    if (currentShift === newShift) {
      setSnackbar({
        open: true,
        message: 'Staff is already in this shift',
        severity: 'info'
      });
      return;
    }
  
    try {
      setIsChangingShift(true);
      setSnackbar({
        open: true,
        message: 'Changing shift...',
        severity: 'info'
      });
  
      const userId = staffData.id || staffData.user_id || staffData._id;
      
      if (!userId) {
        throw new Error('No valid user ID found');
      }
  
      await dispatch(updateShift({
        userId,
        shift: capitalizeShift(targetShift) // Capitalize shift name
      }));
  
      setSnackbar({
        open: true,
        message: `Successfully moved ${staffData.name} to ${capitalizeShift(targetShift)} shift`,
        severity: 'success'
      });
      
      dispatch(fetchShifts());
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update shift',
        severity: 'error'
      });
    } finally {
      setIsChangingShift(false);
    }
  };
  
 
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setTargetShift(null); 
  };

  const toggleShiftChangeMode = () => {
    setIsShiftChangeMode(!isShiftChangeMode);
  };
   ("activeFilter:", activeFilter);
   ("searchTerm:", searchTerm);
   ("selectedShift:", selectedShift);
  const [filteredStaff, setFilteredStaff] = useState([]);
const [dayShiftStaff, setDayShiftStaff] = useState([]);
const [EveningShiftStaff, setEveningShiftStaff] = useState([]);
const [nightShiftStaff, setNightShiftStaff] = useState([]);
 ("M",dayShiftStaff);
 ("E",EveningShiftStaff);
 ("N",nightShiftStaff);
  
useEffect(() => {
  if (Array.isArray(scheduleList)) {
    const updatedFilteredStaff = scheduleList.filter((staff) => {
      const departmentMatch =
        activeFilter === "All" || 
        staff.department?.toLowerCase() === activeFilter.toLowerCase();

      const searchMatch = staff.user_name
        ? staff.user_name.toLowerCase().includes(searchTerm.toLowerCase())
        : false;

      const shiftMatch =
        selectedShift === "All Shifts" || 
        staff.shift?.toLowerCase() === selectedShift.toLowerCase();

      return departmentMatch && searchMatch && shiftMatch;
    });

    setFilteredStaff(updatedFilteredStaff);

    // Update shift-specific lists with case-insensitive comparison
    setDayShiftStaff(
      updatedFilteredStaff.filter(
        (staff) => staff.shift?.toLowerCase() === "morning"
      )
    );
    setEveningShiftStaff(
      updatedFilteredStaff.filter(
        (staff) => staff.shift?.toLowerCase() === "evening" // Fixed Evening to evening
      )
    );
    setNightShiftStaff(
      updatedFilteredStaff.filter(
        (staff) => staff.shift?.toLowerCase() === "night"
      )
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

const ShiftSectionSkeleton = () => (
  <div className="px-2 xs:px-4 sm:px-8">
    <div className="bg-white mt-6 sm:mt-11">
      <Skeleton variant="text" width={200} height={40} />
      <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 pt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            width={120}
            height={60}
            className="rounded-3xl"
          />
        ))}
      </div>
    </div>
  </div>
);

const EmptyShiftMessage = ({ shiftName }) => (
  <div className="flex flex-col items-center justify-center h-[180px] xs:h-[200px] sm:h-[280px] text-gray-500">
    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    <p className="text-center">No staff assigned to {shiftName} shift</p>
  </div>
);

const ShiftSection = ({ title, staff, shiftType }) => {
  if (loading) {
    return <ShiftSectionSkeleton />;
  }

  return (
    <div className="h-auto sm:h-80">
      <div className="px-2 xs:px-4 sm:px-8">
        <div 
          className={`bg-white ${shiftType !== "Morning" ? "mt-6 sm:mt-11" : ""}`}
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
            {staff.length === 0 ? (
              <EmptyShiftMessage shiftName={title.split(" ")[0]} />
            ) : (
              <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 pt-2">
                {staff.map((staff) => (
                  <div
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

  const [department, setDepartment] = useState([]);
  return (
    <section className="bg-[#E6EEF9] h-full w-[100%] overflow-y-auto p-1 xs:p-2 sm:p-4">
      <h1 className="text-[#252941] text-3xl mb-3 mt-5 pl-12 ml-4 font-semibold">
        Schedule status
      </h1>

      <div>
        <div className="bg-white w-auto rounded-lg shadow-lg sm:mx-6 mx-3 min-h-[calc(100vh-120px)] lg:h-[80rem]">
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
              <div className="flex gap-2 xs:gap-3 sm:gap-5 text-black font-medium sm:w-auto lg:w-2/3 overflow-x-auto pb-2">
              <button
              key="all"
              onClick={() => setActiveFilter("All")}
              className={`px-4 py-1 w-auto rounded-3xl min-w-16 font-semibold  border-none ${activeFilter.includes('All') ? "bg-[#6675C5] text-white" : "bg-[#E6EEF9] text-[#252941] font-semibold border border-gray-700"
                }`}
            >
              All
              </button>
                {department.map((department) => (
                  <button
                    key={department}
                    onClick={() => setActiveFilter(department)}
                    className={`p-1.5 xs:p-2 sm:p-2 w-auto lg:min-w-40 min-w-32
                      text-[14px] xs:text-lg sm:text-sm md:text-base lg:text-lg 
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
                  className="p-1.5 xs:p-2 sm:p-3 pl-10 xs:pl-12 sm:pl-14 bg-[#E6EEF9] rounded-3xl text-xs xs:text-sm w-[98%] sm:text-base"
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

          <ShiftSection title="Morning Shift" staff={dayShiftStaff} shiftType="Morning" />
          <ShiftSection title="Evening Shift" staff={EveningShiftStaff} shiftType="Evening" />
          <ShiftSection title="Night Shift" staff={nightShiftStaff} shiftType="Night" />
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
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {isChangingShift ? 'Changing shift...' : snackbar.message}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={showHelpSnackbar}
        autoHideDuration={8000}
        onClose={handleCloseHelp}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          mt: 0, // Add top margin to avoid collision with app bar
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#3A426F',
            padding: '12px 24px',
            minWidth: '400px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          },
          '& .MuiSnackbarContent-message': {
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontSize: '0.95rem'
          }
        }}
        message={
          <>
            <InfoIcon size={20} />
            Tip: You can drag and drop staff members between shifts to reassign them
          </>
        }
        action={
          <>
            <Button 
              color="inherit"
              size="small" 
              onClick={handleDontShowAgain}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.12)'
                }
              }}
            >
              Don't show again
            </Button>
            <Button 
              color="inherit"
              size="small" 
              onClick={handleCloseHelp}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.12)'
                }
              }}
            >
              Got it
            </Button>
          </>
        }
      />
    </section>
  );
}

export default AdminScheduleStatus;


