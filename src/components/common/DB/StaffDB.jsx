import React, {useState, useEffect} from "react";
import {MoreVertical, Edit2, Trash2, Eye, X} from "lucide-react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchStaffData,
  selectStaffList,
  selectStaffLoading,
} from "../../../redux/slices/StaffSlice";

const TableRowSkeleton = () => (
  Array(5).fill(0).map((_, index) => (
    <tr key={index} className="border-b animate-pulse">
      <td className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
      <td className="p-4">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </td>
    </tr>
  ))
);

function StaffDB({ searchTerm, filters }) {
  const dispatch = useDispatch();
  const employees = useSelector(selectStaffList);
  const loading = useSelector(selectStaffLoading);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchStaffData());
  }, [dispatch]);

  const handleView = (id) => {
    setViewDialog(true);
    setAnchorEl(null);
  };

  const handleEdit = (id) => {
     ("Editing employee:", id);
    setAnchorEl(null);
  };

  const initiateDelete = (employee) => {
    setDeleteConfirmation(employee);
    setAnchorEl(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      setEmployees(employees.filter((emp) => emp.id !== deleteConfirmation.id));
      setDeleteConfirmation(null);
    }
  };

  const handleMenuOpen = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = 
      filters.department === "All" || 
      employee.department === filters.department.toLowerCase();

    const matchesRole = 
      filters.role === "All" || 
      employee.role === filters.role;

    const matchesShift = 
      filters.shift === "All" || 
      employee.shift === filters.shift.toLowerCase();

    return matchesSearch && matchesDepartment && matchesRole && matchesShift;
  });

  const EmployeeDetailsDialog = () => (
    <Dialog 
      open={viewDialog} 
      onClose={() => setViewDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        bgcolor: '#252941', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Employee Details
        <X 
          className="h-5 w-5 cursor-pointer" 
          onClick={() => setViewDialog(false)}
        />
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {selectedEmployee && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedEmployee.user_name}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedEmployee.email}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                Department
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedEmployee.department || 'N/A'}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                Role
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedEmployee.role}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Shift
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedEmployee.shift}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                Salary
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                ₹{selectedEmployee.salary}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                UPI ID
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedEmployee.upi_id}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                Employee ID
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedEmployee.id}
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setViewDialog(false)}
          variant="contained"
          sx={{ 
            bgcolor: '#252941',
            '&:hover': {
              bgcolor: '#1a1f36'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <section className="w-full bg-white rounded-lg shadow-lg">
      <EmployeeDetailsDialog />
      <div className="max-h-[calc(100vh-260px)] overflow-auto">
        <table className="w-full rounded-tr-lg overflow-hidden">
          <thead className="sticky top-0 bg-[#252941] shadow-sm z-20">
            <tr className="border-b text-white">
              <th className="p-4 text-left font-semibold">Employee</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Department</th>
              <th className="p-4 text-left font-semibold">Role</th>
              <th className="p-4 text-left font-semibold">Shift</th>
              <th className="p-4 text-left font-semibold">Salary</th>
              <th className="p-4 text-left font-semibold">UPI ID</th>
              <th className="p-4 text-left font-semibold rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableRowSkeleton />
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  {searchTerm || filters.department !== "All" || filters.role !== "All" || filters.shift !== "All" 
                    ? "No matching results found"
                    : "No employees found"}
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    employee.id % 2 === 0 ? "bg-[#DEE8FF]" : "bg-[#E6EEF9]"
                  }`}
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        {employee.user_name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{employee.email}</td>
                  <td className="p-4 text-gray-700">
                    {employee.department || "N/A"}
                  </td>
                  <td className="p-4 text-gray-700">{employee.role}</td>
                  <td className="p-4 text-gray-700">{employee.shift}</td>
                  <td className="p-4 font-medium text-gray-900">
                    ₹{employee.salary}
                  </td>
                  <td className="p-4 text-gray-700">{employee.upi_id}</td>
                  <td className="p-4 relative">
                    <button
                      onClick={(e) => handleMenuOpen(e, employee)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      transformOrigin={{
                        horizontal: "right",
                        vertical: "top",
                      }}
                      anchorOrigin={{
                        horizontal: "right",
                        vertical: "bottom",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleView(selectedEmployee?.id);
                          handleMenuClose();
                        }}
                      >
                        <ListItemIcon>
                          <Eye className="h-4 w-4" />
                        </ListItemIcon>
                        <ListItemText>View Details</ListItemText>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          handleEdit(selectedEmployee?.id);
                          handleMenuClose();
                        }}
                      >
                        <ListItemIcon>
                          <Edit2 className="h-4 w-4" />
                        </ListItemIcon>
                        <ListItemText>Edit Employee</ListItemText>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          initiateDelete(selectedEmployee);
                          handleMenuClose();
                        }}
                        sx={{color: "error.main"}}
                      >
                        <ListItemIcon>
                          <Trash2
                            className="h-4 w-4"
                            style={{color: "inherit"}}
                          />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h3>
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete {deleteConfirmation.name}?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default StaffDB;
