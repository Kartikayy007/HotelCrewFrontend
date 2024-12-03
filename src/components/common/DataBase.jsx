import React, {useState, useRef, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectStaffPerDepartment, 
  createStaff,
  fetchStaffData  // Add this import
} from '../../redux/slices/staffslice';
import { selectCustomers } from '../../redux/slices/customerSlice'; // Adjust path as needed
import StaffDB from "./DB/StaffDB";
import CustomerDB from "./DB/CustomerDB";
import {Search, ChevronLeft, ChevronRight} from "lucide-react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import LoadingAnimation from './LoadingAnimation'; // Adjust path as needed
import AddIcon from '@mui/icons-material/Add'; // Add this import
import { fetchHotelDetails, selectDepartmentNames } from '../../redux/slices/HotelDetailsSlice';

function DataBase() {
  const [activeComponent, setActiveComponent] = React.useState("StaffDB");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    // Staff filters
    department: "All",
    role: "All",
    shift: "All",
    // Customer filters
    customerType: "All",
    roomType: "All"  // Replace bookingStatus with roomType
  }); 

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    email: '',
    user_name: '',
    role: 'staff',
    salary: '',
    upi_id: '',
    shift: 'morning',
    department: 'housekeeping'
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(true);
  const dispatch = useDispatch();
  const departments = useSelector(selectDepartmentNames);

  const handleCreateStaff = async () => {
    try {
      setIsCreating(true);
      
      // Format the data according to API requirements
      const formattedData = {
        email: newStaffData.email,
        user_name: newStaffData.user_name,
        role: newStaffData.role,
        salary: newStaffData.salary,
        upi_id: newStaffData.upi_id,
        shift: newStaffData.shift,
        department: newStaffData.department
      };

      await dispatch(createStaff(formattedData)).unwrap();
      await dispatch(fetchStaffData());
      setCreateDialogOpen(false);
      
      // Reset form
      setNewStaffData({
        email: '',
        user_name: '',
        role: 'staff',
        salary: '',
        upi_id: '',
        shift: 'morning',
        department: ''
      });
    } catch (error) {
      console.error('Failed to create staff:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e) => {
    setNewStaffData({
      ...newStaffData,
      [e.target.name]: e.target.value
    });
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const {scrollLeft, scrollWidth, clientWidth} = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => scrollContainer.removeEventListener("scroll", checkScroll);
    }
  }, []);

  useEffect(() => {
    setIsDepartmentsLoading(true);
    Promise.all([
      dispatch(fetchStaffData()),
      dispatch(fetchHotelDetails())
    ]).finally(() => {
      setIsDepartmentsLoading(false);
    });
  }, [dispatch]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const staffPerDepartment = useSelector(selectStaffPerDepartment);
  const customers = useSelector(selectCustomers);
  
  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <div className="w-[95vw] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw] 2xl:w-[80vw]">
        <div>
          <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12 text-[#252941] mb-2">
            Database
          </h1>
        </div>
        <div className="filters flex justify-start md:justify-center mb-5">
          <div className="filter-buttons flex flex-col lg:flex-row gap-2 items-center w-full max-w-7xl">
            <h1 className="text-2xl font-medium space-nowrap text-start lg:block hidden">
              Filters
            </h1>

            <div className="flex-1 w-full mx-8 relative">
              {showLeftArrow && (
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 lg:hidden bg-white/80 rounded-full shadow-md p-1 hover:bg-white"
                  onClick={() => scroll("left")}
                >
                  <ChevronLeft className="w-5 h-5 text-[#5663AC]" />
                </button>
              )}

              <div
                ref={scrollContainerRef}
                className="scroll-container flex gap-2 overflow-x-auto hide-scrollbar w-full"
              >
                {activeComponent === "StaffDB" && (
                  <>
                    <select 
                      value={filters.department}
                      onChange={(e) => setFilters({...filters, department: e.target.value})}
                      className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full"
                    >
                      <option value="All">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                    <select 
                      value={filters.role}
                      onChange={(e) => setFilters({...filters, role: e.target.value})}
                      className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full mr-2"
                    >
                      <option value="All">Role</option>
                      <option value="Manager">Manager</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Staff">Staff</option>
                    </select>
                    <select
                      value={filters.shift}
                      onChange={(e) => setFilters({...filters, shift: e.target.value})}
                      className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full mr-2"
                    >
                      <option value="All">Shift</option>
                      <option value="Morning">Day Shift</option>
                      <option value="Night">Night Shift</option>
                      <option value="evening">Evening</option>
                    </select>
                  </>
                )}
                {activeComponent === "CustomerDB" && (
                  <>
                    <select 
                      value={filters.customerType}
                      onChange={(e) => setFilters({...filters, customerType: e.target.value})}
                      className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full"
                    >
                      <option value="All">Customer Type</option>
                      <option value="Regular">Regular</option>
                      <option value="VIP">VIP</option>
                    </select>
                    <select 
                      value={filters.roomType}
                      onChange={(e) => setFilters({...filters, roomType: e.target.value})}
                      className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full border-2 mr-2"
                    >
                      <option value="All">Room Type</option>
                      {customers && Array.from(new Set(customers.map(c => c.room_type)))
                        .filter(Boolean)
                        .map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))
                      }
                    </select>
                  </>
                )}
              </div>

              {showRightArrow && (
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 lg:hidden bg-white/80 rounded-full shadow-md p-1 hover:bg-white"
                  onClick={() => scroll("right")}
                >
                  <ChevronRight className="w-5 h-5 text-[#5663AC]" />
                </button>
              )}
            </div>

            <div className="relative lg:w-2/6 w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="bg-[#F1F6FC] hover:bg-gray-300 w-full text-[#5663AC] font-medium py-2 px-4 rounded-2xl border-2 border-[#B7CBEA] pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5663AC]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div>
            <button
              className={`${
                activeComponent === "StaffDB"
                  ? "bg-[#252941] text-[#F1F6FC]"
                  : "bg-[#B7CBEA] text-[#252941]"
              } font-medium py-2 px-4 rounded-t-lg`}
              onClick={() => setActiveComponent("StaffDB")}
            >
              Staff
            </button>
            <button
              className={`${
                activeComponent === "CustomerDB"
                  ? "bg-[#252941] text-[#F1F6FC]"
                  : "bg-[#B7CBEA] text-[#252941]"
              } font-medium py-2 px-4 rounded-t-lg`}
              onClick={() => setActiveComponent("CustomerDB")}
            >
              Customer
            </button>
          </div>
          <div>
            {activeComponent === "StaffDB" ? (
              <StaffDB 
                searchTerm={searchTerm}
                filters={filters}
              />
            ) : (
              <CustomerDB 
                searchTerm={searchTerm}
                filters={filters}
              />
            )}
          </div>
        </div>
      </div>
      {activeComponent === "StaffDB" && (
        <Button
          variant="contained"
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            bgcolor: '#252941',
            '&:hover': { bgcolor: '#1a1f36' },
            borderRadius: '50px',
            padding: '12px 24px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            zIndex: 1000,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Add Staff <span className="ml-2">+</span>
        </Button>
      )}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 24,
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#252941', color: 'white' }}>
          Create New Staff
        </DialogTitle>
        <DialogContent sx={{ mt: 2, minHeight: '400px' }}>
          {isCreating ? (
            <div className="flex flex-col items-center justify-center h-full">
              <LoadingAnimation size={60} />
              <p className="mt-4 text-gray-600">Creating staff member...</p>
            </div>
          ) : (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="user_name"
                label="Name"
                fullWidth
                value={newStaffData.user_name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={newStaffData.email}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={newStaffData.department}
                  onChange={handleInputChange}
                  disabled={isDepartmentsLoading}
                >
                  {isDepartmentsLoading ? (
                    <MenuItem value="" disabled>
                      <div className="flex items-center">
                        <LoadingAnimation size={20} />
                        <span className="ml-2">Loading departments...</span>
                      </div>
                    </MenuItem>
                  ) : (
                    departments.map(dept => (
                      <MenuItem key={dept.value} value={dept.value}>
                        {dept.label}
                    
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {newStaffData.department === 'add_new' && (
                <TextField
                  margin="dense"
                  name="new_department"
                  label="New Department Name"
                  fullWidth
                  value={newStaffData.new_department || ''}
                  onChange={handleInputChange}
                />
              )}
              <Select
                fullWidth
                name="role"
                value={newStaffData.role}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              >
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="receptionist">Receptionist</MenuItem>
              </Select>
              <Select
                fullWidth
                name="shift"
                value={newStaffData.shift}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              >
                <MenuItem value="morning">Morning</MenuItem>
                <MenuItem value="evening">Evening</MenuItem>
                <MenuItem value="night">Night</MenuItem>
              </Select>
              <TextField
                margin="dense"
                name="salary"
                label="Salary"
                type="number"
                fullWidth
                value={newStaffData.salary}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="upi_id"
                label="UPI ID"
                fullWidth
                value={newStaffData.upi_id}
                onChange={handleInputChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setCreateDialogOpen(false)} 
            color="inherit"
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateStaff}
            variant="contained"
            disabled={isCreating}
            sx={{ 
              bgcolor: '#252941',
              '&:hover': { bgcolor: '#1a1f36' }
            }}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}

export default DataBase;