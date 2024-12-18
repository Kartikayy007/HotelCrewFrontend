import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Plus, Trash2, Clock} from "lucide-react";
import {
  selectHotelDetails,
  updateHotelDetails,
  selectHotelUpdateLoading,
  selectHotelUpdateError,
  massCreateStaff,
} from "../../../redux/slices/HotelDetailsSlice";
import {
  selectUserProfile,
  selectUserProfileLoading,
  selectUserProfileError,
  fetchUserProfile,
} from "../../../redux/slices/userProfileSlice";
import docupload from "/docupload.svg";
import {toast} from "react-toastify";
import axios from "axios";
import LoadingAnimation from "../../common/LoadingAnimation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";

const useConfirmationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const openDialog = (config) => {
    setDialogConfig(config);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const ConfirmationDialog = () => (
    <Dialog
      open={isOpen}
      onClose={closeDialog}
      PaperProps={{
        style: {
          borderRadius: "16px",
          padding: "8px",
        },
      }}
    >
      <DialogTitle>{dialogConfig.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogConfig.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="#252941">
          Cancel
        </Button>
        <Button
          onClick={() => {
            dialogConfig.onConfirm();
            closeDialog();
          }}
          sx={{
            backgroundColor: "#252941", // Background color
            color: "#ffffff", // Text color
            '&:hover': {
              backgroundColor: "#1e2135", // Hover effect
            },
          }}
          // color="#252941"
          
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  return {openDialog, ConfirmationDialog};
};

const BasicInfo = () => {
  const dispatch = useDispatch();
  const hotelDetails = useSelector(selectHotelDetails);
  const updateLoading = useSelector(selectHotelUpdateLoading);
  const updateError = useSelector(selectHotelUpdateError);

  const [formData, setFormData] = useState({
    hotel_name: "",
    legal_business_name: "",
    year_established: "",
    license_registration_numbers: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [isDirty, setIsDirty] = useState(false);
  const [lastChangedField, setLastChangedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (hotelDetails) {
      const initialData = {
        hotel_name: hotelDetails.hotel_name || "",
        legal_business_name: hotelDetails.legal_business_name || "",
        year_established: hotelDetails.year_established || "",
        license_registration_numbers:
          hotelDetails.license_registration_numbers || "",
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [hotelDetails]);

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
    setLastChangedField(field);
  };

  const handleInputChange = (e) => {
    handleChange(e.target.name, e.target.value);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleConfirmation = () => {
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!hasChanges()) {
      setSnackbar({
        open: true,
        message: "No changes to save",
        severity: "info",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        updateHotelDetails({
          ...formData,
          lastChangedField,
        })
      ).unwrap();

      setOriginalData(formData);
      setIsDirty(false);
      setLastChangedField(null);
      setOpenDialog(false);

      setSnackbar({
        open: true,
        message: "Changes saved successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to save changes",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-white rounded-3xl p-8 lg:h-[75vh] mx-5 h-full  lg:w-2/3">
        <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hotel Name
            </label>
            <input
              type="text"
              name="hotel_name"
              maxLength={120}
              value={formData.hotel_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Legal Business Name
            </label>
            <input
              type="text"
              name="legal_business_name"
              maxLength={150}
              value={formData.legal_business_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Established
            </label>
            <input
              type="number"
              name="year_established"
              min={1000}
              max={2024}
              minLength={3}
              value={formData.year_established}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License/Registration Numbers
            </label>
            <input
              type="text"
              maxLength={100}
              name="license_registration_numbers"
              value={formData.license_registration_numbers}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleConfirmation}
            disabled={!isDirty || isSubmitting || !hasChanges()}
            className={`bg-[#424C6B] text-white px-6 py-2 rounded-full hover:bg-[#374160] 
              transition-colors flex items-center gap-2
              ${
                !isDirty || isSubmitting || !hasChanges()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
          >
            {isSubmitting ? (
              <>
                <LoadingAnimation size={20} />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </section>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          style: {
            borderRadius: "16px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to save these changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setOpenDialog(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#424C6B] text-white rounded-md hover:bg-[#374160]"
          >
            Confirm
          </button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
          severity={snackbar.severity}
          variant="filled"
          sx={{width: "100%"}}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

const ContactInfo = () => {
  const dispatch = useDispatch();
  const hotelDetails = useSelector(selectHotelDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    complete_address: "",
    main_phone_number: "",
    emergency_phone_number: "",
    email_address: "",
  });
  const [isDirty, setIsDirty] = useState(false);
  const [lastChangedField, setLastChangedField] = useState(null);
  const {openDialog, ConfirmationDialog} = useConfirmationDialog();

  useEffect(() => {
    if (hotelDetails) {
      const initialData = {
        complete_address: hotelDetails.complete_address || "",
        main_phone_number: hotelDetails.main_phone_number || "",
        emergency_phone_number: hotelDetails.emergency_phone_number || "",
        email_address: hotelDetails.email_address || "",
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [hotelDetails]);

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleInputChange = (e) => {
    const {id, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setIsDirty(true);
    setLastChangedField(id);
  };

  const handleSubmit = async () => {
    if (!hasChanges()) {
      setSnackbar({
        open: true,
        message: "No changes to save",
        severity: "info",
      });
      return;
    }

    openDialog({
      title: "Save Changes?",
      message: "Are you sure you want to save these changes?",
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          await dispatch(
            updateHotelDetails({
              ...formData,
              lastChangedField,
            })
          ).unwrap();

          setOriginalData(formData);
          setIsDirty(false);
          setLastChangedField(null);

          setSnackbar({
            open: true,
            message: "Contact information updated successfully",
            severity: "success",
          });
        } catch (err) {
          setSnackbar({
            open: true,
            message: err.message || "Failed to update contact information",
            severity: "error",
          });
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  return (
    <section className="bg-white rounded-3xl mx-5 lg:h-[75vh] h-full p-8  lg:w-2/3">
      <h2 className="text-xl font-bold mb-8">Contact Information</h2>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="complete_address"
            className="block text-sm font-medium mb-2"
          >
            Complete Address*
          </label>
          <input
            type="text"
            id="complete_address"
            maxLength={150}
            value={formData.complete_address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Phone Numbers*
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="tel"
              id="main_phone_number"
              maxLength={10}
              placeholder="Main number"
              value={formData.main_phone_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <input
              type="tel"
              id="emergency_phone_number"
              maxLength={10}
              placeholder="Emergency number"
              value={formData.emergency_phone_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email_address"
            className="block text-sm font-medium mb-2"
          >
            Hotel E-mail*
          </label>
          <input
            type="email"
            maxLength={150}
            id="email_address"
            value={formData.email_address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            disabled={!isDirty || isSubmitting || !hasChanges()}
            className={`bg-[#252941] text-white px-6 py-2 rounded-full hover:bg-[#374160] 
              transition-colors flex items-center gap-2
              ${
                !isDirty || isSubmitting || !hasChanges()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
          >
            {isSubmitting ? (
              <>
                <LoadingAnimation size={20} />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      <ConfirmationDialog />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
          severity={snackbar.severity}
          variant="filled"
          sx={{width: "100%"}}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </section>
  );
};

const PropertyDetails = () => {
  const dispatch = useDispatch();
  const hotelDetails = useSelector(selectHotelDetails);
  const updateLoading = useSelector(selectHotelUpdateLoading);
  const updateError = useSelector(selectHotelUpdateError);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    total_number_of_rooms: 0,
    room_types: [],
    number_of_floors: 0,
    valet_parking_capacity: 0,
    valet_parking_available: false,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [lastChangedField, setLastChangedField] = useState(null);

  useEffect(() => {
    if (hotelDetails) {
      setFormData({
        total_number_of_rooms: hotelDetails.total_number_of_rooms,
        room_types: hotelDetails.room_types || [],
        number_of_floors: hotelDetails.number_of_floors,
        valet_parking_capacity: hotelDetails.valet_parking_capacity,
        valet_parking_available: hotelDetails.valet_parking_available,
      });
    }
  }, [hotelDetails]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
    setLastChangedField(field);
  };

  const handleRoomTypes = (updatedRoomTypes) => {
    setFormData((prev) => ({
      ...prev,
      room_types: updatedRoomTypes,
    }));
    setIsDirty(true);
    setLastChangedField("room_types");
  };

  const addRoomType = () => {
    const updatedRoomTypes = [
      ...formData.room_types,
      {room_type: "", count: 0, price: 0},
    ];
    handleRoomTypes(updatedRoomTypes);
  };

  const removeRoomType = (index) => {
    const updatedRoomTypes = formData.room_types.filter((_, i) => i !== index);
    handleRoomTypes(updatedRoomTypes);
  };

  const updateRoomType = (index, field, value) => {
    const updatedRoomTypes = [...formData.room_types];
    updatedRoomTypes[index] = {
      ...updatedRoomTypes[index],
      [field]: value,
    };
    handleRoomTypes(updatedRoomTypes);
  };

  const handleSaveClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      await dispatch(
        updateHotelDetails({
          ...formData,
          lastChangedField,
        })
      ).unwrap();
      setIsDirty(false);
      setLastChangedField(null);
      setConfirmDialogOpen(false);
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  return (
    <section className="bg-white rounded-3xl h-full  sm:p-8 lg:h-[75vh] sm:mx-5 mx-[16px] py-8 px-3   lg:w-2/3">
      <h2 className="text-xl font-bold mb-4 sm:mb-8">Property Details</h2>
      {updateError && (
        <div className="text-red-500 mb-4">
          Error updating property details: {updateError.message}
        </div>
      )}

      <div className="space-y-4 sm:space-y-1 w-full">
        <div className="h-80 w-full overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium">Room Types</label>
            <button
              type="button"
              onClick={addRoomType}
              className="px-3 py-1 text-sm text-gray-400 hover:text-gray-600"
            >
              <Plus size={26} />
            </button>
          </div>

          {formData.room_types.map((room, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-4 items-end">
              <div className="col-span-4">
                <label className="block text-xs mb-2">Room Type</label>
                <input
                  type="text"
                  maxLength={70}
                  value={room.room_type}
                  onChange={(e) =>
                    updateRoomType(index, "room_type", e.target.value)
                  }
                  placeholder="e.g. Single, Double"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div className="col-span-3">
                <label className="block text-xs mb-2">Count</label>
                <input
                  type="number"
                  value={room.count}
                  min={1}
                  onChange={(e) =>
                    updateRoomType(
                      index,
                      "count",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div className="col-span-4">
                <label className="block text-xs mb-2">Price</label>
                <input
                  type="number"
                  value={room.price}
                  min={0}
                  onChange={(e) =>
                    updateRoomType(
                      index,
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => removeRoomType(index)}
                  className="px-2 py-2 text-gray-400 hover:text-gray-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Floors
            </label>
            <input
              type="number"
              min={1}
              value={formData.number_of_floors}
              onChange={(e) =>
                handleInputChange("number_of_floors", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Parking Capacity
            </label>
            <input
              type="number"
              min={0}
              value={formData.valet_parking_capacity}
              onChange={(e) =>
                handleInputChange("valet_parking_capacity", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.valet_parking_available}
              onChange={(e) =>
                handleInputChange("valet_parking_available", e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-400"
            />
            <span className="text-sm font-medium">Valet Parking Available</span>
          </label>
        </div>

        <div className="flex justify-end mt-4 sm:mt-8">
          <button
            onClick={handleSaveClick}
            disabled={!isDirty || updateLoading}
            className={`bg-[#252941] text-white px-6 py-2 rounded-full hover:bg-[#374160] transition-colors ${
              !isDirty || updateLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {updateLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
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
        <DialogTitle sx={{ bgcolor: "white", color: "252941" }}>
          Confirm Changes
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          Are you sure you want to save these changes to the property details?
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            sx={{
              bgcolor: "#252941",
              "&:hover": { bgcolor: "#252941" },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

const StaffManagement = () => {
  const dispatch = useDispatch();
  const hotelDetails = useSelector(selectHotelDetails);
  const updateLoading = useSelector(selectHotelUpdateLoading);
  const updateError = useSelector(selectHotelUpdateError);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    department_names: "",
  });
  const [departments, setDepartments] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [lastChangedField, setLastChangedField] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const {openDialog, ConfirmationDialog} = useConfirmationDialog();

  useEffect(() => {
    if (hotelDetails?.department_names) {
      const initialDepartments = hotelDetails.department_names.split(", ");
      setDepartments(initialDepartments);
      const initialData = {
        department_names: hotelDetails.department_names,
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [hotelDetails]);

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const validateForm = () => {
    if (departments.some((dept) => !dept.trim())) {
      setSnackbar({
        open: true,
        message: "All departments must have a name",
        severity: "error",
      });
      return false;
    }
    return true;
  };

  const updateDepartments = (newDepartments) => {
    setDepartments(newDepartments);
    const departmentString = newDepartments.filter((d) => d).join(", ");
    setFormData((prev) => ({
      ...prev,
      department_names: departmentString,
    }));
    setIsDirty(true);
    setLastChangedField("department_names");
  };

  const addDepartment = () => {
    updateDepartments([...departments, ""]);
  };

  const removeDepartment = (index) => {
    updateDepartments(departments.filter((_, i) => i !== index));
  };

  const handleDepartmentChange = (index, value) => {
    const newDepartments = [...departments];
    newDepartments[index] = value;
    updateDepartments(newDepartments);
  };

  const handleSubmit = async () => {
    if (!hasChanges()) {
      setSnackbar({
        open: true,
        message: "No changes to save",
        severity: "info",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    openDialog({
      title: "Save Changes?",
      message: "Are you sure you want to save these changes?",
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          await dispatch(
            updateHotelDetails({
              ...formData,
              lastChangedField,
            })
          ).unwrap();

          setOriginalData(formData);
          setIsDirty(false);
          setLastChangedField(null);

          setSnackbar({
            open: true,
            message: "Departments updated successfully",
            severity: "success",
          });
        } catch (err) {
          setSnackbar({
            open: true,
            message: err.message || "Failed to update departments",
            severity: "error",
          });
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  return (
    <section className="bg-white mx-4 lg:h-[75vh] h-full rounded-3xl p-8  lg:w-2/3">
      <h2 className="text-xl font-bold mb-8">Staff Management</h2>

      <div className="space-y-6 h-96 overflow-y-auto">
        <div>
          <div className="flex justify-between  items-center mb-2">
            <label className="block text-sm font-medium">Departments</label>
            <button
              onClick={addDepartment}
              className="text-gray-600 hover:text-gray-800"
            >
              <Plus size={24} />
            </button>
          </div>
          {departments.map((department, index) => (
            <div key={index} className="flex gap-4 mb-4 items-center ">
              <input
                type="text"
                value={department}
                maxLength={50}
                onChange={(e) => handleDepartmentChange(index, e.target.value)}
                placeholder="Department name"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <button
                onClick={() => removeDepartment(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        </div>
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            disabled={!isDirty || isSubmitting || !hasChanges()}
            className={`bg-[#424C6B] text-white px-6 py-2 rounded-full hover:bg-[#374160] 
              transition-colors flex items-center gap-2
              ${
                !isDirty || isSubmitting || !hasChanges()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
          >
            {isSubmitting ? (
              <>
                <LoadingAnimation size={20} />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      

      <ConfirmationDialog />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
          severity={snackbar.severity}
          variant="filled"
          sx={{width: "100%"}}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </section>
  );
};

const OperationalInfo = () => {
  const dispatch = useDispatch();
  const hotelDetails = useSelector(selectHotelDetails);
  const updateLoading = useSelector(selectHotelUpdateLoading);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    check_in_time: "",
    check_out_time: "",
    payment_methods: [],
  });

  const [originalData, setOriginalData] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const {openDialog, ConfirmationDialog} = useConfirmationDialog();

  useEffect(() => {
    if (hotelDetails) {
      const initialData = {
        check_in_time: hotelDetails.check_in_time || "",
        check_out_time: hotelDetails.check_out_time || "",
        payment_methods: hotelDetails.payment_methods
          ? hotelDetails.payment_methods.split(", ")
          : [],
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [hotelDetails]);

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const validateForm = () => {
    if (!formData.check_in_time || !formData.check_out_time) {
      setSnackbar({
        open: true,
        message: "Check-in and Check-out times are required",
        severity: "error",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges()) {
      setSnackbar({
        open: true,
        message: "No changes to save",
        severity: "info",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    openDialog({
      title: "Save Changes?",
      message: "Are you sure you want to save these changes?",
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          const updateData = {
            check_in_time: formData.check_in_time,
            check_out_time: formData.check_out_time,
            payment_methods: formData.payment_methods
              .filter((method) => method.trim())
              .join(", "),
          };

          await dispatch(updateHotelDetails(updateData)).unwrap();

          setOriginalData(formData);
          setIsDirty(false);

          setSnackbar({
            open: true,
            message: "Operational information updated successfully",
            severity: "success",
          });
        } catch (err) {
          setSnackbar({
            open: true,
            message: err.message || "Failed to update operational information",
            severity: "error",
          });
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white lg:h-[75vh] h-full rounded-3xl p-8  w-2/3 mx-4"
    >
      <h2 className="text-xl font-bold mb-8">Operational Information</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Check-in Time*
          </label>
          <div className="relative">
            <input
              type="time"
              value={formData.check_in_time}
              onChange={(e) =>
                handleInputChange("check_in_time", e.target.value)
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
            <Clock
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Check-out Time*
          </label>
          <div className="relative">
            <input
              type="time"
              value={formData.check_out_time}
              onChange={(e) =>
                handleInputChange("check_out_time", e.target.value)
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
            <Clock
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Payment Methods
          </label>
          <input
            type="text"
            value={formData.payment_methods.join(", ")}
            onChange={(e) =>
              handleInputChange("payment_methods", e.target.value.split(", "))
            }
            placeholder="Enter payment methods (comma separated)"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={!isDirty || isSubmitting || !hasChanges()}
            className={`bg-[#424C6B] text-white px-6 py-2 rounded-full hover:bg-[#374160] 
              transition-colors flex items-center gap-2
              ${
                !isDirty || isSubmitting || !hasChanges()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
          >
            {isSubmitting ? (
              <>
                <LoadingAnimation size={20} />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      <ConfirmationDialog />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({...prev, open: false}))}
          severity={snackbar.severity}
          variant="filled"
          sx={{width: "100%"}}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

const StaffData = () => {
  const [file, setFile] = useState(null); // Change to single file
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  const validateFile = (file) => {
    // Updated MIME types for Excel files
    const validTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/octet-stream", // Fallback for some systems
    ];

    const validExtensions = [".xls", ".xlsx"];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(fileExtension)
    ) {
      toast.error("Please upload only Excel files (.xls or .xlsx)");
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0]; // Take only first file

    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      //  ('File selected:', selectedFile); // Debug log
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("staff_excel_sheet", file); // Updated field name

      //  ('Uploading file:', file.name);
      const result = await dispatch(massCreateStaff(formData)).unwrap();

      toast.success("Staff data uploaded successfully");
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error?.message || "Failed to upload staff data");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="bg-white lg:h-[75vh] h-full rounded-3xl p-8  lg:w-2/3 mx-4">
      <h2 className="text-xl font-bold mb-8">Staff Data</h2>
      {/* {file && (
        <div className="mb-4 p-2 bg-gray-100 rounded">
          <p>Selected file: {file.name}</p>
          <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p>Type: {file.type}</p>
        </div>
      )} */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-blue-400");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("border-blue-400");
        }}
        onDrop={(e) => {
          e.currentTarget.classList.remove("border-blue-400");
          handleDrop(e);
        }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-[#EFEFEF] h-1/2 flex flex-col justify-center items-center"
      >
        <p className="text-sm text-gray-600 mb-4">
          Drag Excel file (.xls or .xlsx) or click to upload
        </p>
        <div className="mb-4 flex justify-center item-center">
          <img src={docupload} alt="Upload icon" />
        </div>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-[#5663AC] text-white p-4 rounded-lg hover:bg-[#374160] transition-colors cursor-pointer inline-block w-32"
        >
          Select File
        </label>
      </div>

      {file && (
        <div className="mt-6">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">{file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-8">
        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="bg-[#424C6B] text-white px-6 py-2 rounded-full hover:bg-[#374160] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isUploading ? <>Uploading...</> : "Upload Staff Data"}
        </button>
      </div>
    </section>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectUserProfile);
  const loading = useSelector(selectUserProfileLoading);

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState({
    user_name: "",
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        user_name: profile.user_name || "",
      });
      setPreviewImage(profile.user_profile || "");
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const {id, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setIsDirty(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({...prev, open: false}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user_name.trim()) {
      setSnackbar({
        open: true,
        message: "Username cannot be empty",
        severity: "error",
      });
      return;
    }

    setIsUploading(true);

    const getAuthToken = () => {
      const token =
        localStorage.getItem("accessToken") || sessionStorage.getItem("token");

      if (!token) throw new Error("Authentication token not found");
      return token;
    };

    try {
      // Create form data for profile picture update
      const profileFormData = new FormData();
      if (profileImage) {
        profileFormData.append("user_profile", profileImage);
      }
      profileFormData.append("user_name", formData.user_name.trim());

      // Update profile picture and name
      await axios.put(
        "https://hotelcrew-1.onrender.com/api/edit/user_profile/",
        profileFormData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
      setIsDirty(false);
      dispatch(fetchUserProfile()); // Refresh profile data
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || "Failed to update profile",
        severity: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="lg:h-[75vh] h-full p-2 mr-4 font-Montserrat">
      <div className="lg:mt-1 mt-2 ml-4 mr-2 pt-2 pb-1 pr-7 pl-7 rounded-lg">
        <div className="lg:flex-row flex-col flex w-full lg:items-start items-center lg:justify-evenly">
          <div className="relative mt-4 w-48 h-48 lg:w-60 lg:h-60 lg:top-14">
            <div className="relative w-full h-full rounded-full border border-gray-400">
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-full">
                  <LoadingAnimation size={60} color="#3F4870" />
                </div>
              ) : (
                <img
                  src={previewImage || "/default-profile.png"}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                  />
                )}
                <label className="absolute bottom-0 right-0 rounded-full p-2 cursor-pointer h-full w-full">
                <img
                  src="/tabler_edit.svg"
                  alt="edit"
                  className="absolute bottom-3 right-8 lg:w-10 lg:h-10 w-7 h-7 cursor-pointer z-10"
                />
              
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="relative w-full lg:w-auto pl-4 lg:pl-8 mt-4">
            <h2 className="text-[#000000] text-xl mt-5 font-semibold">
              Personal Details
            </h2>

            <form
              onSubmit={handleSubmit}
              className="lg:mt-10 mt-8 flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="user_name" className="font-semibold text-sm">
                  User Name*
                </label>
                <input
                  type="text"
                  id="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  maxLength={15}
                  required
                  className="border border-gray-400 rounded-[4px] px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex lg:justify-end justify-center">
                <button
                  type="submit"
                  disabled={!isDirty || loading}
                  className={`mt-2 mb-6 w-[195px] rounded-2xl text-white font-semibold p-1 bg-[#3F4870] 
                    ${
                      !isDirty || loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    {id: "profile", label: "Profile"},
    {id: "basicInfo", label: "Basic Info"},
    {id: "contactInfo", label: "Contact Info"},
    {id: "propertyDetails", label: "Property Details"},
    {id: "staffManagement", label: "Staff Management"},
    {id: "operationalInfo", label: "Operational Info"},
    {id: "staffData", label: "Staff Data"},
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "basicInfo":
        return <BasicInfo />;
      case "contactInfo":
        return <ContactInfo />;
      case "propertyDetails":
        return <PropertyDetails />;
      case "staffManagement":
        return <StaffManagement />;
      case "operationalInfo":
        return <OperationalInfo />;
      case "staffData":
        return <StaffData />;
      default:
        return <Profile />;
    }
  };

  return (
    <section className="bg-[#E6EEF9] min-h-screen w-full overflow-y-auto p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">
        Settings
      </h1>

      <div className="mb-6 mt-6">
        <div>
          <nav className="flex flex-wrap overflow-x-auto w-screen   md:w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "bg-[#252941] text-[#F1F6FC]"
                    : "bg-[#ffff] border text-[#252941]"
                } font-medium py-2 px-4 rounded-t-lg mr-1 mb-1`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-tr-lg rounded-b-lg shadow xl:w-[75vw] -mt-7">
        {renderContent()}
      </div>
    </section>
  );
};

export default AdminSettings;
