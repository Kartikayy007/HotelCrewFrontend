import React, { useState } from "react";
import { MoreVertical, Edit2, Trash2, Eye, X } from "lucide-react";

function StaffDB() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Arjun Gupta", department: "Housekeeping", email: "arjungupta@gmail.com", shift: "Day Shift", rating: 7.2, phone: "1234567890" },
    { id: 2, name: "Shreya Rai", department: "Security", email: "shreyarai@gmail.com", shift: "Day Shift", rating: 9.0, phone: "2345678901" },
    { id: 3, name: "Arjun Gupta", department: "Kitchen", email: "arjungupta@gmail.com", shift: "Night Shift", rating: 8.6, phone: "3456789012" },
    { id: 4, name: "Shreya Rai", department: "Kitchen", email: "shreyarai@gmail.com", shift: "Night Shift", rating: 4.3, phone: "4567890123" },
    { id: 5, name: "Arjun Gupta", department: "Parking", email: "arjungupta@gmail.com", shift: "Day Shift", rating: 7.6, phone: "5678901234" },
    { id: 6, name: "Shreya Rai", department: "Kitchen", email: "shreyarai@gmail.com", shift: "Day Shift", rating: 7.2, phone: "6789012345" },
    { id: 7, name: "Shreya Rai", department: "Parking", email: "shreyarai@gmail.com", shift: "Day Shift", rating: 9.5, phone: "7890123456" },
    { id: 8, name: "Arjun Gupta", department: "Housekeeping", email: "arjungupta@gmail.com", shift: "Night Shift", rating: 6.5, phone: "8901234567" },
  ]);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const handleView = (id) => {
    console.log("Viewing employee:", id);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    console.log("Editing employee:", id);
    setOpenMenuId(null);
  };

  const initiateDelete = (employee) => {
    setDeleteConfirmation(employee);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      setEmployees(employees.filter(emp => emp.id !== deleteConfirmation.id));
      setDeleteConfirmation(null);
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg">
      <div className="max-h-[calc(100vh-200px)] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b bg-[#252941] text-white">
              <th className="p-4 text-left font-semibold">Employee</th>
              <th className="p-4 text-left font-semibold">Contact</th>
              <th className="p-4 text-left font-semibold">Department</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Shift</th>
              <th className="p-4 text-left font-semibold">Rating</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  employee.id % 2 === 0 ? "bg-[#DEE8FF]" : "bg-[#E6EEF9]"
                }`}
              >
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={`https://randomuser.me/api/portraits/men/${employee.id}.jpg`}
                        alt={employee.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-900">{employee.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-700">{employee.phone}</td>
                <td className="p-4 text-gray-700">{employee.department}</td>
                <td className="p-4 text-gray-700">{employee.email}</td>
                <td className="p-4 text-gray-700">{employee.shift}</td>
                <td className="p-4 font-medium text-gray-900">{employee.rating}</td>
                <td className="p-4 relative">
                  <button
                    onClick={() => toggleMenu(employee.id)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                  
                  {openMenuId === employee.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => handleView(employee.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(employee.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => initiateDelete(employee)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
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
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete {deleteConfirmation.name}? This action cannot be undone.
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
    </div>
  );
}

export default StaffDB;