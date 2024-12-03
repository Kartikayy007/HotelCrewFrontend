import React, {useState, useEffect, useCallback} from "react";
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
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchStaffData,
  selectStaffList,
  selectStaffLoading,
  editStaff,
  deleteStaff
} from "../../../redux/slices/staffslice";

const TableRowSkeleton = () => (
  <tr className="border-b">
    <td className="p-4"><Skeleton variant="text" width={150} /></td>
    <td className="p-4"><Skeleton variant="text" width={100} /></td>
    <td className="p-4"><Skeleton variant="text" width={150} /></td>
    <td className="p-4"><Skeleton variant="text" width={100} /></td>
    <td className="p-4"><Skeleton variant="text" width={100} /></td>
    <td className="p-4"><Skeleton variant="text" width={100} /></td>
    <td className="p-4"><Skeleton variant="text" width={80} /></td>
  </tr>
);

const NoResults = () => (
  <tr>
    <td colSpan="8" className="text-center p-8">
      <div className="flex flex-col items-center justify-center text-gray-500">
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">No matching results found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    </td>
  </tr>
);

// Update EditDialog component
const EditDialog = React.memo(({ open, onClose, staff, onSave }) => {
  const [formData, setFormData] = useState(() => ({
    ...staff
  }));

  useEffect(() => {
    if (open) {
      setFormData({ ...staff });
    }
  }, [open, staff]);

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSave = React.useCallback(async () => {
    await onSave(formData);
  }, [formData, onSave]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      disableBackdropClick
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <DialogTitle>Edit Staff</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="user_name"
          label="Name"
          fullWidth
          value={formData.user_name || ''}
          onChange={handleChange}
          onClick={e => e.stopPropagation()}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          fullWidth
          value={formData.email || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="department"
          label="Department"
          fullWidth
          value={formData.department || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="role"
          label="Role"
          fullWidth
          value={formData.role || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="shift"
          label="Shift"
          fullWidth
          value={formData.shift || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="salary"
          label="Salary"
          fullWidth
          value={formData.salary || ''}
          onChange={handleChange}
          type="number"
        />
        <TextField
          margin="dense"
          name="upi_id"
          label="UPI ID"
          fullWidth
          value={formData.upi_id || ''}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
});

function StaffDB({ searchTerm, filters }) {
  const dispatch = useDispatch();
  const employees = useSelector(selectStaffList);
  const loading = useSelector(selectStaffLoading);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    dispatch(fetchStaffData());
  }, [dispatch]);

  const handleView = (id) => {
    setViewDialog(true);
    setAnchorEl(null);
  };

  const handleEdit = useCallback((staff) => {
    setSelectedStaff(staff);
    setOpenDialog(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpenDialog(false);
    setSelectedStaff(null);
  }, []);

  const handleSave = useCallback(async (updatedData) => {
    try {
      await dispatch(editStaff({
        employeeId: selectedStaff.id,
        updatedData: {
          user_name: updatedData.user_name,
          email: updatedData.email,
          department: updatedData.department,
          role: updatedData.role,
          shift: updatedData.shift,
          salary: updatedData.salary,
          upi_id: updatedData.upi_id
        }
      })).unwrap();
      
      await dispatch(fetchStaffData());
      
      handleClose();
      setSnackbar({
        open: true,
        message: 'Employee updated successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update employee',
        severity: 'error'
      });
    }
  }, [dispatch, selectedStaff, handleClose]);

  const initiateDelete = (employee) => {
    setDeleteConfirmation(employee);
    setAnchorEl(null);
  };

  const confirmDelete = async () => {
    if (deleteConfirmation) {
      try {
        await dispatch(deleteStaff(deleteConfirmation.id)).unwrap();
        setSnackbar({
          open: true,
          message: 'Employee deleted successfully',
          severity: 'success'
        });
        setDeleteConfirmation(null);
        dispatch(fetchStaffData()); // Refresh the list
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to delete employee',
          severity: 'error'
        });
      }
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(editStaff({
        employeeId: editFormData.id,
        updatedData: editFormData
      })).unwrap();
      
      setSnackbar({
        open: true,
        message: 'Employee updated successfully',
        severity: 'success'
      });
      setEditDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update employee',
        severity: 'error'
      });
    }
  };

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      <EditDialog
        open={openDialog}
        onClose={handleClose}
        staff={selectedStaff}
        onSave={handleSave}
      />
      <Snackbar
  open={snackbar.open}  
  autoHideDuration={6000}
  onClose={() => setSnackbar({...snackbar, open: false})}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}

>
  <Alert 
    variant="filled"
    severity={snackbar.severity}
    onClose={() => setSnackbar({...snackbar, open: false})}
  >
    {snackbar.message}
  </Alert>
</Snackbar>
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
              [...Array(5)].map((_, index) => (
                <TableRowSkeleton key={index} />
              ))
            ) : filteredEmployees.length === 0 ? (
              <NoResults />
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
                  <td className="p-4 text-gray-700">
                    <div className="max-w-[200px] truncate" title={employee.email}>
                      {employee.email}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">
                    {employee.department || "N/A"}
                  </td>
                  <td className="p-4 text-gray-700">{employee.role}</td>
                  <td className="p-4 text-gray-700">{employee.shift}</td>
                  <td className="p-4 font-medium text-gray-900">
                    ₹{employee.salary}
                  </td>
                  <td className="p-4 text-gray-700">
                    <div className="max-w-[150px] truncate" title={employee.upi_id}>
                      {employee.upi_id}
                    </div>
                  </td>
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
                          handleEdit(selectedEmployee);
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

export default React.memo(StaffDB);
