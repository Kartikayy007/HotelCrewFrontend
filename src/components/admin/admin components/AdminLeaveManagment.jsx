import React, { useState } from 'react';
import { Calendar, Check, X, Clock } from 'lucide-react';
import { Modal, Box, Typography, Avatar, Divider } from '@mui/material';

const AdminLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    { 
      id: 1, 
      name: 'Emily Johnson', 
      department: 'Housekeeping', 
      startDate: '2024-02-15', 
      endDate: '2024-02-20', 
      days: 5, 
      status: 'Pending' 
    },
    { 
      id: 2, 
      name: 'Michael Chen', 
      department: 'Front Desk', 
      startDate: '2024-03-01', 
      endDate: '2024-03-10', 
      days: 9, 
      status: 'Approved' 
      
    },
    { 
      id: 3, 
      name: 'Sarah Rodriguez', 
      department: 'Kitchen', 
      startDate: '2024-02-25', 
      endDate: '2024-03-05', 
      days: 8, 
      status: 'Rejected' 
    },
    { 
      id: 3, 
      name: 'Sarah Rodriguez', 
      department: 'Kitchen', 
      startDate: '2024-02-25', 
      endDate: '2024-03-05', 
      days: 8, 
      status: 'Rejected' 
    },
    { 
      id: 3, 
      name: 'Sarah Rodriguez', 
      department: 'Kitchen', 
      startDate: '2024-02-25', 
      endDate: '2024-03-05', 
      days: 8, 
      status: 'Rejected' 
    },
    { 
      id: 3, 
      name: 'Sarah Rodriguez', 
      department: 'Kitchen', 
      startDate: '2024-02-25', 
      endDate: '2024-03-05', 
      days: 8, 
      status: 'Rejected' 
    }
  ]);

  const [filter, setFilter] = useState('All');
  
  // New state for modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Modal handlers
  const handleOpenModal = (staff) => {
    setSelectedStaff(staff);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStaff(null);
  };

  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  const handleApprove = (id) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === id ? { ...req, status: 'Approved' } : req
    ));
  };

  const handleReject = (id) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === id ? { ...req, status: 'Rejected' } : req
    ));
  };

  const filteredRequests = leaveRequests.filter(req => 
    filter === 'All' || req.status === filter
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <section className="bg-[#E6EEF9] min-h-screen ">
    <h1 className="text-3xl font-semibold p-4 sm:p-8 lg:ml-8 ml-12">
          Staff Leave Management
    </h1>
    <div className='p-8  -mt-9 '>
      <div className="bg-white h-[83vh] overflow-scroll rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          
          
          <div className="flex space-x-2">
            {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md ${
                  filter === status 
                    ? 'bg-[#6675C5] text-white' 
                    : 'bg-[#F1F6FC] text-[#3F4870]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F1F6FC] text-black">
              <tr>
                <th className="p-3">Employee Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
                <th className="p-3">Days</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr 
                  key={request.id} 
                  className="border-b hover:bg-[#F1F6FC]/50 transition-colors"
                >
                  <td className="p-3 font-medium cursor-pointer hover:text-blue-600"
                      onClick={() => handleOpenModal(request)}>
                    {request.name}
                  </td>
                  <td className="p-3">{request.department}</td>
                  <td className="p-3 flex items-center">
                    <Calendar className="mr-2 text-[#3F4870]" size={16} />
                    {request.startDate}
                  </td>
                  <td className="p-3">
                    <Calendar className="mr-2 text-[#3F4870] inline-block" size={16} />
                    {request.endDate}
                  </td>
                  <td className="p-3">
                    <Clock className="mr-2 text-[#3F4870] inline-block" size={16} />
                    {request.days}
                  </td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {request.status === 'Pending' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleApprove(request.id)}
                          className="text-green-600 hover:bg-green-100 p-2 rounded-full"
                        >
                          <Check />
                        </button>
                        <button 
                          onClick={() => handleReject(request.id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-full"
                        >
                          <X />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No leave requests found.
          </div>
        )}
      </div>
    </div>  
    {/* Staff Profile Modal */}
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="staff-profile-modal"
    >
      <Box sx={modalStyle}>
        <div className="flex flex-col items-center">
          <Avatar
            sx={{ width: 100, height: 100, mb: 2 }}
            alt={selectedStaff?.name}
            src="/default-avatar.png"
          />
          <Typography variant="h5" component="h2" className="mb-4">
            {selectedStaff?.name}
          </Typography>
        </div>
        
        <Divider className="my-4" />
        
        <div className="space-y-3">
          <div>
            <Typography variant="subtitle2" color="text.secondary">
              Department
            </Typography>
            <Typography variant="body1">
              {selectedStaff?.department}
            </Typography>
          </div>
          
          <div>
            <Typography variant="subtitle2" color="text.secondary">
              Current Leave Status
            </Typography>
            <Typography variant="body1">
              {selectedStaff?.status}
            </Typography>
          </div>
          
          <div>
            <Typography variant="subtitle2" color="text.secondary">
              Leave Duration
            </Typography>
            <Typography variant="body1">
              {selectedStaff?.startDate} to {selectedStaff?.endDate}
              ({selectedStaff?.days} days)
            </Typography>
          </div>
        </div>
      </Box>
    </Modal>
    </section>
  );
};

export default AdminLeaveManagement;