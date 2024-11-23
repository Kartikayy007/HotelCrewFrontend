import React, {useState, useEffect, Suspense} from "react";
import {MoreVertical, Edit2, Trash2, Eye, X} from "lucide-react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";

const TableRowSkeleton = () => (
  <tr className="border-b">
    <td className="p-6">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={120} />
      </div>
    </td>
    <td className="p-4">
      <Skeleton variant="text" width={100} />
    </td>
    <td className="p-4">
      <Skeleton variant="text" width={80} />
    </td>
    <td className="p-4">
      <Skeleton variant="text" width={150} />
    </td>
    <td className="p-4">
      <Skeleton variant="text" width={80} />
    </td>
    <td className="p-4">
      <Skeleton variant="text" width={50} />
    </td>
    <td className="p-4">
      <Skeleton variant="circular" width={32} height={32} />
    </td>
  </tr>
);

function StaffDB() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setEmployees([
          {
            id: 1,
            name: "Arjun Gupta",
            department: "Housekeeping",
            email: "arjungupta@gmail.com",
            shift: "Day Shift",
            rating: 7.2,
            phone: "1234567890",
          },
          {
            id: 2,
            name: "Shreya Rai",
            department: "Security",
            email: "shreyarai@gmail.com",
            shift: "Day Shift",
            rating: 9.0,
            phone: "2345678901",
          },
          {
            id: 3,
            name: "Arjun Gupta",
            department: "Kitchen",
            email: "arjungupta@gmail.com",
            shift: "Night Shift",
            rating: 8.6,
            phone: "3456789012",
          },
          {
            id: 4,
            name: "Shreya Rai",
            department: "Kitchen",
            email: "shreyarai@gmail.com",
            shift: "Night Shift",
            rating: 4.3,
            phone: "4567890123",
          },
          {
            id: 5,
            name: "Arjun Gupta",
            department: "Parking",
            email: "arjungupta@gmail.com",
            shift: "Day Shift",
            rating: 7.6,
            phone: "5678901234",
          },
          {
            id: 6,
            name: "Shreya Rai",
            department: "Kitchen",
            email: "shreyarai@gmail.com",
            shift: "Day Shift",
            rating: 7.2,
            phone: "6789012345",
          },
          {
            id: 7,
            name: "Shreya Rai",
            department: "Parking",
            email: "shreyarai@gmail.com",
            shift: "Day Shift",
            rating: 9.5,
            phone: "7890123456",
          },
          {
            id: 8,
            name: "Arjun Gupta",
            department: "Housekeeping",
            email: "arjungupta@gmail.com",
            shift: "Night Shift",
            rating: 6.5,
            phone: "8901234567",
          },
        ]);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleView = (id) => {
    console.log("Viewing employee:", id);
    setAnchorEl(null);
  };

  const handleEdit = (id) => {
    console.log("Editing employee:", id);
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="w-full bg-white rounded-lg shadow-lg ">
        <div className="max-h-[calc(100vh-260px)] overflow-auto">
          <table className="w-full rounded-tr-lg overflow-hidden">
            <thead className="sticky top-0 bg-[#252941] shadow-sm z-20">
              <tr className="border-b text-white">
                <th className="p-4 text-left font-semibold">Employee</th>
                <th className="p-4 text-left font-semibold">Contact</th>
                <th className="p-4 text-left font-semibold">Department</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Shift</th>
                <th
                  className="p-4 text-left font-semibold rounded-tr-lg"
                  colspan="2"
                >
                  Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(5)].map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))
                : employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        employee.id % 2 === 0 ? "bg-[#DEE8FF]" : "bg-[#E6EEF9]"
                      }`}
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-md">
                            <img
                              src={`https://randomuser.me/api/portraits/men/${employee.id}.jpg`}
                              alt={employee.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-gray-900">
                            {employee.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{employee.phone}</td>
                      <td className="p-4 text-gray-700">
                        {employee.department}
                      </td>
                      <td className="p-4 text-gray-700">{employee.email}</td>
                      <td className="p-4 text-gray-700">{employee.shift}</td>
                      <td className="p-4 font-medium text-gray-900 text-center">
                        {employee.rating}
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
                  ))}
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
    </Suspense>
  );
}

export default StaffDB;
