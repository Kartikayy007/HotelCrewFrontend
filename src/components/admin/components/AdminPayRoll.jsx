import React, {useState, useEffect} from "react";
import {Search, ChevronDown, ChevronLeft, ChevronRight} from "lucide-react";
import {useSelector, useDispatch} from "react-redux";
import {
  selectStaffList,
  selectDepartments,
  selectShifts,
} from "../../../redux/slices/StaffSlice";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';
import { createWallet } from '../../../redux/slices/PayrollSlice';

const MAX_NAME_LENGTH = 20;

const truncateText = (text, maxLength) => {
  if (!text) return ""; // Handle undefined/null case
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const SHIFT_OPTIONS = [
  {label: "Morning", value: "Morning"},
  {label: "Evening", value: "Evening"},
  {label: "Night", value: "Night"},
];

// Helper function to normalize salary values
const normalizeSalary = (salary) => {
  // Handle null/undefined
  if (!salary) return -1;
  
  // Already a number
  if (typeof salary === 'number') return salary;
  
  // Convert string to number
  if (typeof salary === 'string') {
    // Remove currency symbols, commas, and spaces
    const cleaned = salary.toString().replace(/[^\d.-]/g, '');
    const number = parseFloat(cleaned);
    return isNaN(number) ? -1 : number;
  }
  
  return -1;
};

// Updated sorting function
const sortBySalary = (a, b) => {
  const salaryA = normalizeSalary(a?.salary);
  const salaryB = normalizeSalary(b?.salary);
  
  if (salaryA === -1 && salaryB === -1) return 0;
  if (salaryA === -1) return 1;
  if (salaryB === -1) return -1;
  
  return salaryA - salaryB;
};

function AdminPayRoll() {
  const [employees, setEmployees] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({key: null, direction: "asc"});
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [shiftFilter, setShiftFilter] = useState("All");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = React.useRef(null);
  const staffList = useSelector(selectStaffList);
  const departments = useSelector(selectDepartments);
  const shifts = useSelector(selectShifts);

  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState(null);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const [hasWallet, setHasWallet] = useState(false);

  const handleCheckWallet = () => {
    // Logic to check wallet
     ("Checking wallet status");
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [walletCreationStatus, setWalletCreationStatus] = useState(null);
  const [walletDetails, setWalletDetails] = useState(null);
  const dispatch = useDispatch();

  const handleCreateWallet = () => {
    setOpenDialog(true);
  };

  const handleConfirmCreateWallet = async () => {
    try {
      setWalletCreationStatus('loading');
      const response = await dispatch(createWallet()).unwrap();
      
      // Check if response contains "wallet exists" message
      if (response?.message?.toLowerCase().includes('already exists')) {
        setWalletCreationStatus('exists');
        setWalletDetails({
          message: response.message,
          type: 'info'
        });
        setHasWallet(true);
        return;
      }

      // Handle successful wallet creation
      setWalletCreationStatus('success');
      setHasWallet(true);
      setWalletDetails(response);

    } catch (error) {
      // Handle actual errors
      setWalletCreationStatus('error');
      setWalletDetails({
        message: error.message || 'Failed to create wallet',
        type: 'error'
      });
    }
  };

  useEffect(() => {
    if (staffList?.length) {
      const formattedStaff = staffList.map((staff) => ({
        id: staff.id,
        name: staff.name?.trim() || staff.email?.split('@')[0] || "N/A", 
        email: staff.email || "N/A",
        department: staff.department || "N/A",
        shift: staff.shift || "day shift",
        upi_id: staff.upi_id || (staff.email ? `${staff.email.split("@")[0]}@upi` : "N/A"),
        salary: staff.salary || 0,
      }));
      setEmployees(formattedStaff);
      setFilteredEmployees(formattedStaff);
      setIsLoading(false);
    }
  }, [staffList]);

  const handleSort = (column) => {
    // Toggle sort order if clicking same column
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }

    if (column === 'salary') {
      setEmployees(prev => [...prev].sort((a, b) => 
        sortOrder === 'asc' ? sortBySalary(a, b) : sortBySalary(b, a)
      ));
    }
    // Handle other columns...
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(employees.map((emp) => emp.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  // Update handleFilters to use case-insensitive comparison
  const handleFilters = () => {
    let filtered = [...employees];

    // Apply department filter
    if (departmentFilter !== "All") {
      filtered = filtered.filter((emp) => emp.department === departmentFilter);
    }

    // Apply shift filter
    if (shiftFilter !== "All") {
      filtered = filtered.filter(
        (emp) => emp.shift?.toLowerCase() === shiftFilter.toLowerCase()
      );
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter((employee) =>
        Object.values(employee).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredEmployees(filtered);
  };

  useEffect(() => {
    handleFilters();
  }, [departmentFilter, shiftFilter, searchQuery, employees]);

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const {scrollLeft, clientWidth, scrollWidth} = scrollContainerRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      const scrollAmount = clientWidth / 2;

      if (direction === "left") {
        scrollContainerRef.current.scrollLeft = Math.max(
          0,
          scrollLeft - scrollAmount
        );
      } else {
        scrollContainerRef.current.scrollLeft = Math.min(
          maxScrollLeft,
          scrollLeft + scrollAmount
        );
      }

      setShowLeftArrow(scrollContainerRef.current.scrollLeft > 0);
      setShowRightArrow(scrollContainerRef.current.scrollLeft < maxScrollLeft);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const {scrollLeft, clientWidth, scrollWidth} = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  // Add table rendering with loading state
  if (isLoading) {
    return <div className="w-full text-center p-4">Loading...</div>;
  }

  // In your component's render:
  const displaySalary = (salary) => {
    if (!salary) return 'N/A';
    if (typeof salary === 'number') {
      return salary.toLocaleString('en-US', {
        style: 'currency',
        currency: 'INR'
      });
    }
    return salary;
  };

  return (
    <>
      <div className="bg-[#E6EEF9] h-full w-full overflow-auto p-2 sm:p-4">
        <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
          Payroll
        </h1>

        {/* Filters Section */}
        <div className="mb-5 px-2 sm:px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <h2 className="text-xl font-medium hidden lg:block">Filters</h2>

            {/* Filter Dropdowns */}
            <div className="flex-1 w-full relative">
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="min-w-[140px] bg-white hover:bg-gray-200 text-[#5663AC] font-medium py-2 px-4 rounded-full"
                >
                  <option value="All">Department</option>
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>

                <select
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value)}
                  className="min-w-[140px] bg-white hover:bg-gray-50 text-[#5663AC] font-medium py-2 px-4 rounded-full"
                >
                  <option value="All">All Shifts</option>
                  {SHIFT_OPTIONS.map((shift) => (
                    <option key={shift.value} value={shift.value}>
                      {shift.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white hover:bg-gray-50 text-[#5663AC] font-medium py-2 px-4 rounded-2xl border-2 border-[#B7CBEA] pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5663AC] w-5 h-5" />
              </div>

              <button className="bg-[#5663AC] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#4553a0] transition-colors">
                Pay Rollout
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={handleCheckWallet}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18m-9 6h9" />
            </svg>
            Check Wallet
          </button>

          <button
            onClick={handleCreateWallet}
            disabled={hasWallet}
            className={`flex items-center px-4 py-2 rounded-md transition-colors
              ${hasWallet 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Wallet
          </button>
        </div>

        {/* Table Section */}
        <div className="w-[95vw] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw] 2xl:w-[80vw] bg-white rounded-lg shadow-lg ">
          <div className="max-h-[calc(100vh-260px)] overflow-auto">
            <table className="w-full rounded-tr-lg overflow-hidden">
              <thead className="bg-[#252941] sticky top-0 text-white">
                <tr>
                  <th className="p-3 sm:p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === employees.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 accent-[#5663AC] cursor-pointer"
                    />
                  </th>
                  {[
                    "Name",
                    "E-mail",
                    "Department",
                    "UPI ID",
                    "Monthly Salary (₹)",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-3 sm:p-4 text-left font-semibold text-sm sm:text-base whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1">
                        {header}
                        {header === "Monthly Salary (₹)" && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              sortConfig.key === "salary"
                                ? sortConfig.direction === "desc"
                                  ? "rotate-180"
                                  : ""
                                : ""
                            }`}
                            onClick={() => handleSort("salary")}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedEmployees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className={`${
                      index % 2 === 0 ? "bg-[#F1F6FC]" : "bg-[#DEE8FF]"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="p-3 sm:p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(employee.id)}
                        onChange={() => handleSelectRow(employee.id)}
                        className="w-4 text- h-4 rounded border-gray-300 accent-[#5C69F8] cursor-pointer"
                      />
                    </td>
                    <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                      {truncateText(employee.name, MAX_NAME_LENGTH)}
                    </td>
                    <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                      {employee.email}
                    </td>
                    <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                      {employee.department}
                    </td>
                    <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                      {employee.upi_id || `${employee.email.split("@")[0]}@upi`}
                    </td>
                    <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                      {displaySalary(employee.salary)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Dialog open={openDialog} onClose={() => !walletCreationStatus && setOpenDialog(false)}>
        <DialogTitle>
          {walletCreationStatus === 'success' ? 'Wallet Created!' : 
           walletCreationStatus === 'error' ? 'Error' : 'Create New Wallet'}
        </DialogTitle>
        <DialogContent>
          {walletCreationStatus === 'loading' && (
            <div className="flex flex-col items-center p-4">
              <CircularProgress />
              <p className="mt-2">Creating your wallet...</p>
            </div>
          )}
          {walletCreationStatus === 'success' && walletDetails && (
            <div className="space-y-3">
              <p className="text-green-600 font-semibold mb-4">
                Wallet has been successfully created!
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><span className="font-semibold">Wallet ID:</span> {walletDetails.wallet_id}</p>
                <p><span className="font-semibold">Balance:</span> ₹{walletDetails.balance}</p>
                <p><span className="font-semibold">Created:</span> {new Date(walletDetails.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          {walletCreationStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">
                {walletDetails?.error || 'Failed to create wallet. Please try again.'}
              </p>
              {walletDetails?.error?.includes('exists') && (
                <p className="text-sm text-red-500 mt-2">
                  You already have an active wallet. Please use the existing wallet.
                </p>
              )}
            </div>
          )}
          {walletCreationStatus === 'exists' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-600 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {walletDetails.message}
              </p>
              <p className="text-sm text-blue-500 mt-2">
                Please use your existing wallet.
              </p>
            </div>
          )}
          {!walletCreationStatus && (
            <p>Are you sure you want to create a new wallet?</p>
          )}
        </DialogContent>
        <DialogActions>
          {!walletCreationStatus && (
            <>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleConfirmCreateWallet} color="primary" variant="contained">
                Create
              </Button>
            </>
          )}
          {(walletCreationStatus === 'success' || walletCreationStatus === 'error' || walletCreationStatus === 'exists') && (
            <Button onClick={() => {
              setOpenDialog(false);
              setWalletCreationStatus(null);
            }} color="primary">
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminPayRoll;
