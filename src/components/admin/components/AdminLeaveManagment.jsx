import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Check, X, Clock } from 'lucide-react';
import { fetchLeaveRequests, selectLeaveError, selectLeaveRequests, selectUpdateStatus, updateLeaveStatus } from '../../../redux/slices/leaveSlice';
import {
  Alert,
  Box,
  Button,
  Divider,
  Modal,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
  Skeleton
} from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: 400
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflow: 'auto'
};

const LeaveRequestSkeleton = ({ isMobile }) => {
  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="flex justify-between items-center mb-2">
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="rectangular" width={60} height={20} className="rounded-full" />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center">
                <Skeleton variant="rectangular" width="100%" height={20} className="ml-6" />
              </div>
              <div className="flex items-center">
                <Skeleton variant="rectangular" width="100%" height={20} className="ml-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left animate-pulse">
        <thead className="bg-[#F1F6FC] text-black">
          <tr>
            {['Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Status', 'Actions'].map((header) => (
              <th key={header} className="p-3">
                <Skeleton variant="text" width="80%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((item) => (
            <tr key={item} className="border-b">
              {[1, 2, 3, 4, 5, 6].map((cell) => (
                <td key={cell} className="p-3">
                  <Skeleton variant="text" width="80%" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminLeaveManagement = () => {
  const dispatch = useDispatch();
  // const leaveRequests = useSelector((state) => state.leave.requests);
  // const status = useSelector((state) => state.leave.status);
  // const error = useSelector((state) => state.leave.error);
  const leaveRequests = useSelector(selectLeaveRequests);
  const status=useSelector(selectUpdateStatus);
  const error=useSelector(selectLeaveError);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filter, setFilter] = useState('All');
  const [openModal, setOpenModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLeaveRequests());
    }
  }, [status, dispatch]);

  const handleOpenModal = (staff) => {
    setSelectedStaff(staff);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStaff(null);
  };

  const handleApprove = async (requestId) => {
    try {
      // Optimistically update the UI
      const updatedRequests = leaveRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'Approved' }
          : request
      );
      
      // Update local state immediately
      dispatch({
        type: 'leave/updateLocalRequest',
        payload: updatedRequests
      });

      // Make API call
      const result = await dispatch(updateLeaveStatus({ 
        id: requestId, 
        status: 'Approved' 
      })).unwrap();
      
      setSnackbar({
        open: true,
        message: result.message || 'Leave request approved successfully',
        severity: 'success',
      });
      
      handleCloseModal();
    } catch (err) {
      // Revert optimistic update on error
      dispatch(fetchLeaveRequests());
      
      setSnackbar({
        open: true,
        message: err.message || 'Failed to approve leave request',
        severity: 'error',
      });
    }
  };

  const handleReject = async (requestId) => {
    try {
      // Optimistically update the UI
      const updatedRequests = leaveRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'Rejected' }
          : request
      );
      
      // Update local state immediately
      dispatch({
        type: 'leave/updateLocalRequest',
        payload: updatedRequests
      });

      // Make API call
      const result = await dispatch(updateLeaveStatus({ 
        id: requestId, 
        status: 'Rejected' 
      })).unwrap();
      
      setSnackbar({
        open: true,
        message: result.message || 'Leave request rejected',
        severity: 'error',
      });
      
      handleCloseModal();
    } catch (err) {
      // Revert optimistic update on error
      dispatch(fetchLeaveRequests());
      
      setSnackbar({
        open: true,
        message: err.message || 'Failed to reject leave request',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const filteredRequests = leaveRequests.filter(
    (req) => filter === 'All' || req.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (status === 'loading') {
    return (
      <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
        <h1 className="lg:text-3xl text-2xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
          Staff Leave Management
        </h1>
        <div className={`bg-white mx-6 ${
          isMobile ? 'rounded-lg shadow-md' : 'h-[83vh] overflow-scroll rounded-lg shadow-lg'
        } p-4 sm:p-6`}>
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between items-center'} mt-3 mb-6`}>
            <div className={`flex ${isMobile ? 'justify-center' : 'space-x-2'} ${!isMobile && 'items-center'}`}>
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <Skeleton 
                  key={status} 
                  variant="rectangular" 
                  width={100} 
                  height={40} 
                  className={`rounded-full ${isMobile ? 'mr-2 mb-2' : ''}`} 
                />
              ))}
            </div>
          </div>

          <LeaveRequestSkeleton isMobile={isMobile} />
        </div>
      </section>
    );
  }

  if (status === 'failed') {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const renderLeaveRequestsContent = () => {
    if (isMobile) {
      return (
        <div className="space-y-4 p-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors"
              onClick={() => handleOpenModal(request)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-base">{request.user_name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-[#3F4870]" size={16} />
                  {request.from_date} - {request.to_date}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 text-[#3F4870]" size={16} />
                  {request.leave_type}
                </div>
              </div>
              {request.status === 'Pending' && (
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(request.id);
                    }}
                    className="rounded-full flex items-center justify-center hover:bg-green-100"
                  >
                    <Check className="text-green-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(request.id);
                    }}
                    className="rounded-full flex items-center justify-center hover:bg-red-100"
                  >
                    <X className="text-red-600" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F1F6FC] text-black">
            <tr>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Leave Type</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
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
                <td
                  className="p-3 text-base font-medium cursor-pointer hover:text-blue-600"
                  onClick={() => handleOpenModal(request)}
                >
                  {request.user_name}
                </td>
                <td className="p-3">{request.leave_type}</td>
                <td className="p-3">
                  <Calendar className="mr-2 text-[#3F4870] inline-block" size={16} />
                  {request.from_date}
                </td>
                <td className="p-3">
                  <Calendar className="mr-2 text-[#3F4870] inline-block" size={16} />
                  {request.to_date}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="p-3">
                  {request.status === 'Pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="rounded-full flex items-center justify-center hover:bg-green-100"
                      >
                        <Check className="text-green-600" />
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="rounded-full flex items-center justify-center hover:bg-red-100"
                      >
                        <X className="text-red-600" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="lg:text-3xl text-2xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        Staff Leave Management
      </h1>
      <div className={`bg-white mx-6 ${
        isMobile ? 'rounded-lg shadow-md' : 'h-[83vh] overflow-scroll rounded-lg shadow-lg'
      } p-4 sm:p-6`}>
        <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between items-center'} mt-3 mb-6`}>
          <div className={`flex ${isMobile ? 'justify-center' : 'space-x-2'} ${!isMobile && 'items-center'}`}>
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full ${
                  filter === status ? 'bg-[#6675C5] text-white' : 'bg-[#F1F6FC] text-black'
                } ${isMobile ? 'mr-2 mb-2' : ''}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {renderLeaveRequestsContent()}

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No leave requests found.
          </div>
        )}
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <div className="flex flex-col">
            <Typography variant="h5" component="h2" className="mb-4 text-center">
              {selectedStaff?.user_name}
            </Typography>
            <Divider className="my-4" />
            <div className="space-y-3">
              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Leave Type
                </Typography>
                <Typography variant="body1">
                  {selectedStaff?.leave_type}
                </Typography>
              </div>
              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Leave Duration
                </Typography>
                <Typography variant="body1">
                  {selectedStaff?.from_date} to {selectedStaff?.to_date}
                </Typography>
              </div>{selectedStaff?.status === 'Pending' && (
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    Actions
                  </Typography>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApprove(selectedStaff?.id)}
                      startIcon={<Check />}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleReject(selectedStaff?.id)}
                      startIcon={<X />}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default AdminLeaveManagement;
