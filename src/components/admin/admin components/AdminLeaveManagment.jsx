import React, {useState} from "react";
import {Calendar, Check, X, Clock} from "lucide-react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";

const AdminLeaveManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      name: "Emily Johnson",
      department: "Housekeeping",
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      days: 5,
      status: "Pending",
      description: "Annual leave request for vacation planning.",
    },
    {
      id: 2,
      name: "Michael Chen",
      department: "IT",
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      days: 5,
      status: "Pending",
      description: "Planned time off for personal matters.",
    },
    {
      id: 3,
      name: "Sarah Rodriguez",
      department: "Marketing",
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      days: 5,
      status: "Pending",
      description: "Attending professional development conference.",
    },
  ]);

  const [filter, setFilter] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [actionedRequests, setActionedRequests] = useState({});
  const [selectedAction, setSelectedAction] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenModal = (staff) => {
    setSelectedStaff(staff);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStaff(null);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90%" : 400,
    maxHeight: isMobile ? "90vh" : "auto",
    overflowY: "auto",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  const handleApprove = (requestId) => {
    setSelectedAction("approved");
    setActionedRequests((prev) => ({
      ...prev,
      [requestId]: "approved",
    }));
    setLeaveRequests(
      leaveRequests.map((req) =>
        req.id === requestId ? {...req, status: "Approved"} : req
      )
    );
    setSnackbar({
      open: true,
      message: "Leave request approved successfully",
      severity: "success",
    });
  };

  const handleReject = (requestId) => {
    setSelectedAction("rejected");
    setActionedRequests((prev) => ({
      ...prev,
      [requestId]: "rejected",
    }));
    setLeaveRequests(
      leaveRequests.map((req) =>
        req.id === requestId ? {...req, status: "Rejected"} : req
      )
    );
    setSnackbar({
      open: true,
      message: "Leave request rejected",
      severity: "error",
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const filteredRequests = leaveRequests.filter(
    (req) => filter === "All" || req.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

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
                <span className="font-semibold text-base">{request.name}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-[#3F4870]" size={16} />
                  {request.startDate} - {request.endDate}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 text-[#3F4870]" size={16} />
                  {request.days} days
                </div>
                <div>{request.department}</div>
              </div>
              {request.status === "Pending" && (
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(request.id);
                    }}
                    className={`rounded-full flex items-center justify-center ${
                      actionedRequests[request.id] === "approved"
                        ? "bg-green-100"
                        : ""
                    }`}
                  >
                    <Check className="text-green-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(request.id);
                    }}
                    className={`rounded-full flex items-center justify-center ${
                      actionedRequests[request.id] === "rejected"
                        ? "bg-red-100"
                        : ""
                    }`}
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
      <div className="overflow-x-auto ">
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
                <td
                  className="p-3 text-base font-medium cursor-pointer hover:text-blue-600"
                  onClick={() => handleOpenModal(request)}
                >
                  {request.name}
                </td>
                <td className="p-3">{request.department}</td>
                <td className="p-3">
                  <Calendar
                    className="mr-2 text-[#3F4870] inline-block"
                    size={16}
                  />
                  {request.startDate}
                </td>
                <td className="p-3">
                  <Calendar
                    className="mr-2 text-[#3F4870] inline-block"
                    size={16}
                  />
                  {request.endDate}
                </td>
                <td className="p-3">
                  <Clock
                    className="mr-2 text-[#3F4870] inline-block"
                    size={16}
                  />
                  {request.days}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="p-3">
                  {request.status === "Pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className={`rounded-full flex items-center justify-center ${
                          actionedRequests[request.id] === "approved"
                            ? "bg-green-100"
                            : ""
                        }`}
                      >
                        <Check className="text-green-600" />
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className={`rounded-full flex items-center justify-center ${
                          actionedRequests[request.id] === "rejected"
                            ? "bg-red-100"
                            : ""
                        }`}
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
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-1 xs:p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        Staff Leave Management
      </h1>
      <div
        className={`bg-white mx-6 ${
          isMobile
            ? "rounded-lg shadow-md"
            : "h-[83vh] overflow-scroll rounded-lg shadow-lg"
        } p-4 sm:p-6`}
      >
        <h1 className="font-semibold text-lg ml-1 xs:text-xl sm:text-2xl mb-2 xs:mb-4 sm:mb-0">
          Filters
        </h1>
        <div
          className={`flex ${
            isMobile ? "flex-col space-y-4" : "justify-between items-center"
          } mt-3 mb-6`}
        >
          <div
            className={`flex ${isMobile ? "justify-center" : "space-x-2"} ${
              !isMobile && "items-center"
            }`}
          >
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full ${
                  filter === status
                    ? "bg-[#6675C5] text-white"
                    : "bg-[#F1F6FC] text-black"
                } ${isMobile ? "mr-2 mb-2" : ""}`}
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="staff-profile-modal"
      >
        <Box sx={modalStyle}>
          <div className="flex flex-col">
            <Typography
              variant="h5"
              component="h2"
              className="mb-4 text-center"
            >
              {selectedStaff?.name}
            </Typography>
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
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedStaff?.description}
                </Typography>
              </div>
              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Leave Status
                </Typography>
                <div className="flex items-center space-x-4 mt-2">
                  <Button
                    variant="contained"
                    color={
                      selectedAction === "approved" ? "success" : "inherit"
                    }
                    size="small"
                    onClick={() => handleApprove(selectedStaff?.id)}
                    startIcon={<Check />}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color={selectedAction === "rejected" ? "error" : "inherit"}
                    size="small"
                    onClick={() => handleReject(selectedStaff?.id)}
                    startIcon={<X />}
                  >
                    Reject
                  </Button>
                </div>
              </div>
              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Leave Duration
                </Typography>
                <Typography variant="body1">
                  {selectedStaff?.startDate} to {selectedStaff?.endDate} (
                  {selectedStaff?.days} days)
                </Typography>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
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
