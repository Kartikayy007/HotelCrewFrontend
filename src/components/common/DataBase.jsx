import React, {useState, useRef, useEffect, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {
  selectStaffPerDepartment,
  createStaff,
  fetchStaffData, 
  selectStaffList,
} from "../../redux/slices/StaffSlice";
import { selectCustomers } from "../../redux/slices/customerSlice"; // Adjust path as needed
import StaffDB from "./DB/StaffDB";
import CustomerDB from "./DB/CustomerDB";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import LoadingAnimation from "./LoadingAnimation"; // Adjust path as needed
import AddIcon from "@mui/icons-material/Add"; // Add this import
import {
  fetchHotelDetails,
  selectDepartmentNames,
  selectHotelDetails
} from "../../redux/slices/HotelDetailsSlice";

// Add these validation functions
const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

const isValidUPI = (upi) => {
  const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  return upiPattern.test(upi);
};

// Add utility function at the top
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// In Database.jsx, add these selectors at the top:
const getUniqueValues = (staffList, field) => {
  return [...new Set(staffList
    .map(staff => staff[field])
    .filter(Boolean))]
    .sort();
};

// In Database.jsx, add this helper function at the top
const normalizeString = (str) => {
  return str ? str.toLowerCase().trim() : '';
};

function DataBase() {
  const [activeComponent, setActiveComponent] = React.useState("StaffDB");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "All",
    role: "All",
    shift: "All",
    customerType: "All", 
    roomType: "All",
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    email: "",
    user_name: "",
    role: "staff",
    salary: "",
    upi_id: "",
    shift: "morning",
    department: "housekeeping",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(true);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({
    email: false,
    upi_id: false
  });

  const [isManager, setIsManager] = useState(false);

  const staffList = useSelector(selectStaffList);
  const hotelDetails = useSelector(selectHotelDetails);
  
  // Get unique departments
  const departments = useMemo(() => {
    if (!hotelDetails?.department_names) return [];
    
    return hotelDetails.department_names
      .split(',')
      .map(dept => dept.trim())
      .map(dept => ({
        value: dept.toLowerCase(),
        label: capitalizeFirstLetter(dept)
      }));
  }, [hotelDetails]);

  // Get unique roles 
  const roles = useMemo(() => {
    return getUniqueValues(staffList, 'role')
      .map(role => ({
        value: role.toLowerCase(),
        label: capitalizeFirstLetter(role)
      }));
  }, [staffList]);

  // Get unique shifts
  const shifts = useMemo(() => {
    return getUniqueValues(staffList, 'shift')
      .map(shift => ({
        value: shift.toLowerCase(), 
        label: `${capitalizeFirstLetter(shift)} Shift`
      }));
  }, [staffList]);

  // Update handleCreateStaff function
  const handleCreateStaff = async () => {
    setIsCreating(true);
    try {
      const staffDataForApi = {
        ...newStaffData,
        role: capitalizeFirstLetter(newStaffData.role), // Capitalize before API call
      };

      await dispatch(createStaff(staffDataForApi));
      setCreateDialogOpen(false);
      dispatch(fetchStaffData()); // Refresh staff list
    } catch (error) {
      console.error('Error creating staff:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Update handleInputChange
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'role') {
      setIsManager(value === 'manager');
      // Clear department if manager is selected
      if (value === 'manager') {
        setNewStaffData(prev => ({
          ...prev,
          [name]: value,
          department: '' // Clear department
        }));
        return;
      }
    }

    setNewStaffData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate on change
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: value ? !isValidEmail(value) : false
      }));
    }
    if (name === 'upi_id') {
      setErrors(prev => ({
        ...prev,
        upi_id: value ? !isValidUPI(value) : false
      }));
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
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
      dispatch(fetchHotelDetails()),
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

  // Update isAllFieldsFilled
  const isAllFieldsFilled = () => {
    const baseValidation =
      newStaffData.user_name &&
      newStaffData.email &&
      isValidEmail(newStaffData.email) &&
      newStaffData.role &&
      newStaffData.shift &&
      newStaffData.salary &&
      newStaffData.upi_id &&
      isValidUPI(newStaffData.upi_id);

    // Skip department check for managers
    if (isManager) {
      return baseValidation;
    }

    return baseValidation && newStaffData.department;
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-auto p-2 sm:p-4">
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
                className="scroll-container flex gap-2 overflow-x-auto hide-scrollbar w-full">

                {activeComponent === "StaffDB" && (
                  <>
                    <select
                      value={filters.department}
                      onChange={(e) =>
                        setFilters({ ...filters, department: e.target.value })
                      }
                      className="filter1 bg-white hover:bg-slate-50 text-[#5663AC] font-Montserrat font-medium py-2 px-4 rounded-full focus:bg-white"
                    >
                      <option value="All">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value.toLowerCase()}>
                          {capitalizeFirstLetter(dept.label)}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filters.role}
                      onChange={(e) =>
                        setFilters({ ...filters, role: e.target.value })
                      }
                      className="filter1 bg-white hover:bg-slate-50 font-Montserrat text-[#5663AC] font-medium py-2 px-4 rounded-full mr-2 focus:bg-white"
                    >
                      <option value="All">Role</option>
                      {roles.map((role) => (
                        <option key={role.value} value={role.value.toLowerCase()}>
                          {capitalizeFirstLetter(role.label)}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filters.shift}
                      onChange={(e) =>
                        setFilters({ ...filters, shift: e.target.value })
                      }
                      className="filter1 bg-white hover:bg-slate-50 font-Montserrat text-[#5663AC] font-medium py-2 px-4 rounded-full mr-2 focus:bg-white"
                    >
                      <option value="All">Shift</option>
                      {shifts.map((shift) => (
                        <option key={shift.value} value={shift.value.toLowerCase()}>
                          {capitalizeFirstLetter(shift.label)}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                {activeComponent === "CustomerDB" && (
                  <>
                    <select
                      value={filters.customerType}
                      onChange={(e) =>
                        setFilters({ ...filters, customerType: e.target.value })
                      }
                      className="filter1 bg-white font-Montserrat hover:bg-slate-50 text-[#5663AC] font-medium py-2 px-4 rounded-full"
                    >
                      <option value="All">Customer Type</option>
                      <option value="Regular">Regular</option>
                      <option value="VIP">VIP</option>
                    </select>
                    <select
                      value={filters.roomType}
                      onChange={(e) =>
                        setFilters({ ...filters, roomType: e.target.value })
                      }
                      className="filter1 bg-white hover:bg-slate-50 font-Montserrat text-[#5663AC] font-medium py-2 px-4 rounded-full border-2 mr-2"
                    >
                      <option value="All">Room Type</option>
                      {customers &&
                        Array.from(new Set(customers.map((c) => c.room_type)))
                          .filter(Boolean)
                          .map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
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
              className={`${activeComponent === "StaffDB"
                  ? "bg-[#252941] text-[#F1F6FC]"
                  : "bg-[#B7CBEA] text-[#252941]"
                } font-medium py-2 px-4 rounded-t-lg`}
              onClick={() => setActiveComponent("StaffDB")}
            >
              Staff
            </button>
            <button
              className={`${activeComponent === "CustomerDB"
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
              <StaffDB searchTerm={searchTerm} filters={filters} />
            ) : (
              <CustomerDB searchTerm={searchTerm} filters={filters} />
            )}
          </div>
        </div>
      </div>
      {activeComponent === "StaffDB" && (
        <Button
          variant="contained"
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            bgcolor: "#252941",
            "&:hover": { bgcolor: "#1a1f36" },
            borderRadius: "500px",
            padding: "12px 24px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            zIndex: 1000,
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          <span className="text-6xl">+</span>
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
            bgcolor: "background.paper",
            boxShadow: 24,
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "#252941", color: "white" }}>
          Create New Staff
        </DialogTitle>
        <DialogContent sx={{ mt: 2, minHeight: "400px" }}>
          {isCreating ? (
            <div className="flex flex-col mt-36 items-center justify-center h-full">
              <LoadingAnimation size={60} />
              <p className="mt-4 text-gray-600">Creating staff member...</p>
            </div>
          ) : (
            <>
              <TextField
                required
                autoFocus
                margin="dense"
                name="user_name"
                label="Name"
                fullWidth
                value={newStaffData.user_name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <Tooltip
                open={newStaffData.email && !isValidEmail(newStaffData.email)}
                title="Please enter a valid email address"
                placement="top"
                arrow
              >
                <TextField
                  required
                  margin="dense"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={newStaffData.email}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Tooltip>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="department-label"
                  sx={{
                    backgroundColor: "white",
                    px: 1,
                  }}
                >
                  Department
                </InputLabel>
                <Select
                  name="department"
                  value={newStaffData.department}
                  onChange={handleInputChange}
                  disabled={isDepartmentsLoading || isManager}
                >
                  {isManager ? (
                    <MenuItem value="" disabled>
                      Not applicable for managers
                    </MenuItem>
                  ) : isDepartmentsLoading ? (
                    <MenuItem value="" disabled>
                      <div className="flex items-center">
                        <LoadingAnimation size={20} />
                        <span className="ml-2">Loading departments...</span>
                      </div>
                    </MenuItem>
                  ) : (
                    departments.map((dept) => (
                      <MenuItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="role-label"
                  sx={{
                    backgroundColor: 'white',
                    px: 1
                  }}
                >
                  Role
                </InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={newStaffData.role}
                  onChange={(e) => {
                    const role = e.target.value;
                    handleInputChange({
                      target: {
                        name: 'role',
                        value: role  
                      }
                    });
                  }}
                  label="Role"
                >
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="receptionist">Receptionist</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  id="shift-label"
                  sx={{
                    backgroundColor: 'white',
                    px: 1
                  }}
                >
                  Shift
                </InputLabel>
                <Select
                  labelId="shift-label"
                  name="shift"
                  value={newStaffData.shift}
                  onChange={handleInputChange}
                  label="Shift"
                  defaultValue="morning"
                >
                  <MenuItem value="morning">Morning</MenuItem>
                  <MenuItem value="evening">Evening</MenuItem>
                  <MenuItem value="night">Night</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                margin="dense"
                name="salary"
                label="Salary"
                type="number"
                fullWidth
                value={newStaffData.salary}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <Tooltip
                open={newStaffData.upi_id && !isValidUPI(newStaffData.upi_id)}
                title="Please enter a valid UPI ID"
                placement="top"
                arrow
              >
                <TextField
                  required
                  margin="dense"
                  name="upi_id"
                  label="UPI ID"
                  fullWidth
                  value={newStaffData.upi_id}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Tooltip>
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
          <Tooltip
            open={!isAllFieldsFilled() && !isCreating}
            placement="top"
            arrow
          >
            <span>
              <Button
                onClick={handleCreateStaff}
                variant="contained"
                disabled={isCreating || !isAllFieldsFilled()}
                sx={{
                  bgcolor: "#252941",
                  "&:hover": { bgcolor: "#1a1f36" },
                }}
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </span>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </section>
  );
}

export default DataBase;
