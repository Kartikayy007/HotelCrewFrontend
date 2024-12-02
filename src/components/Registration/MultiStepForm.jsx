import React, {useState, useEffect} from "react";
import axios from "axios";
import Hoteldetails from "./Hoteldetails";
import ContactInfo from "./ContactInfo";
import StaffManagement from "./StaffManagment";
import Property from "./Property";
import OperationalInfo from "./OperationalInfo";
import UploadDoc from "./UploadDoc";
import {useNavigate} from "react-router-dom";
import {Snackbar, Alert} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import {completeMultiStepForm} from "../../redux/slices/UserSlice";

// MultiStepForm.jsx
const MultiStepForm = () => {
  const {email, username, isHotelRegistered} = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    user: username || "", 
    email: email || "", 
    hotel_name: "",
    legal_business_name: "",
    year_established: "",
    license_registration_numbers: "",
    complete_address: "",
    main_phone_number: "",
    emergency_phone_number: "",
    email_address: "",
    total_number_of_rooms: "",
    number_of_floors: "",
    valet_parking_available: false,
    valet_parking_capacity: "",
    check_in_time: "",
    check_out_time: "",
    payment_methods: "",
    room_price: "",
    number_of_departments: "",
    department_names: [],
    staff_excel_sheet: null,
    room_types: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (username) {
      setFormData((prev) => ({
        ...prev,
        user: username,
        email: email,
      }));
    }
  }, [username, email]);

  // Prevent redirect if on step 6
  useEffect(() => {
    if (isHotelRegistered && currentStep !== 6) {
      navigate("/admin/dashboard");
    }
  }, [isHotelRegistered, currentStep]);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    // If time already has seconds, return as is
    if (timeStr.split(":").length === 3) return timeStr;
    // Add seconds if not present
    return `${timeStr}:00`;
  };

  const safeParseInt = (value) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
  };

  const safeParseFloat = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  const transformFormData = () => {
    const transformedData = {
      ...formData,
      check_in_time: formData.check_in_time || "12:00:00",
      check_out_time: formData.check_out_time || "12:00:00",
      payment_methods: formData.payment_methods?.trim() || "Cash",
      room_price: formData.room_types[0]?.price || 0,
      room_types: Array.isArray(formData.room_types)
        ? formData.room_types.map((type) => ({
            room_type: type.type || "",
            count: safeParseInt(type.count) || 0,
            price: safeParseFloat(type.price) || 0,
          }))
        : [],
    };

    console.log("Final transformed data:", transformedData);
    return transformedData;
  };

  const handleSnackbarClose = () => {
    setSnackbar({...snackbar, open: false});
  };

  const handleSubmit = async () => {
    try {
      const transformedData = transformFormData();
      const response = await axios.post(
        "https://hotelcrew-1.onrender.com/api/hoteldetails/register/",
        transformedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("accessToken");

      if (response.status === 201) {
        setSnackbar({
          open: true,
          message: "Hotel registered successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: error.message || "Registration failed",
        severity: "error",
      });
    }
  };

  const handleOperationalInfoSubmit = async (operationalData) => {
    try {
      // Show loading state
      setSnackbar({
        open: true,
        message: "Registering hotel details...",
        severity: "info"
      });

      const currentFormData = {
        ...formData,
        ...operationalData,
      };

      const transformedData = transformFormData(currentFormData);
      const result = await dispatch(completeMultiStepForm(transformedData)).unwrap();

      if (result.status === "success") {
        // Show success message
        setSnackbar({
          open: true,
          message: "Hotel registered successfully!",
          severity: "success"
        });

        // Update registration status
        dispatch(setHotelRegistration(true));

        // Wait for snackbar to be visible before navigating
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 9000); // 3 second delay for user to see success message
      }
    } catch (error) {
      // Show error message
      setSnackbar({
        open: true,
        message: error.message || "Failed to register hotel details",
        severity: "error"
      });
    }
  };

  const updateFormData = (stepData, step) => {
    setFormData((prev) => {
      const newData = {...prev};

      switch (step) {
        case 1:
          return {
            ...newData,
            hotel_name: stepData.hotel_name || "",
            legal_business_name: stepData.legal_business_name || "",
            year_established: stepData.year_established || "",
            license_registration_numbers:
              stepData.license_registration_numbers || "",
          };
        case 2:
          return {
            ...newData,
            complete_address: stepData.complete_address || "",
            main_phone_number: stepData.main_phone_number || "",
            emergency_phone_number: stepData.emergency_phone_number || "",
            email_address: stepData.email_address || "",
          };
        case 3:
          return {
            ...newData,
            department_names: Array.isArray(stepData.department_names)
              ? stepData.department_names
              : stepData.department_names.split(",").map((dep) => dep.trim()),
            number_of_departments: safeParseInt(stepData.number_of_departments),
            staff_excel_sheet: stepData.staff_excel_sheet || null,
          };
        case 4:
          return {
            ...newData,
            total_number_of_rooms: stepData.total_number_of_rooms || "",
            number_of_floors: stepData.number_of_floors || "",
            room_types: Array.isArray(stepData.room_types)
              ? stepData.room_types
              : [],
            valet_parking_available: Boolean(stepData.valet_parking_available),
            valet_parking_capacity: stepData.valet_parking_capacity || "",
          };
        // MultiStepForm.jsx
        case 5:
          return {
            ...newData,
            check_in_time: stepData.check_in_time || "",
            check_out_time: stepData.check_out_time || "",
            payment_methods: stepData.payment_methods?.trim() || "",
          };
        default:
          return newData;
      }
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Hoteldetails
            onNext={handleNext}
            updateFormData={(data) => updateFormData(data, 1)}
            initialData={formData}
          />
        );
      case 2:
        return (
          <ContactInfo
            onNext={handleNext}
            onBack={handleBack}
            updateFormData={(data) => updateFormData(data, 2)}
            initialData={formData}
          />
        );
      case 3:
        return (
          <StaffManagement
            onNext={handleNext}
            onBack={handleBack}
            updateFormData={(data) => updateFormData(data, 3)}
            initialData={formData}
          />
        );
      case 4:
        return (
          <Property
            onNext={handleNext}
            onBack={handleBack}
            updateFormData={(data) => updateFormData(data, 4)}
            initialData={formData}
          />
        );
      case 5:
        return (
          <OperationalInfo
            onNext={(data) => handleOperationalInfoSubmit(data)}
            onBack={handleBack}
            updateFormData={(data) => updateFormData(data, 5)}
            initialData={formData}
          />
        );
      default:
        return null;
    }
  };

  // Update UI to show only 5 steps
  const stepNumbers = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-white">
      {renderStep()}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{vertical: "top", horizontal: "center"}}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MultiStepForm;
