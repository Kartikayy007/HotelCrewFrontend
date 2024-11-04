import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Hoteldetails from './Hoteldetails';
import ContactInfo from './ContactInfo';
import StaffManagement from './StaffManagment';
import Property from './Property';
import OperationalInfo from './OperationalInfo';
import UploadDoc from './UploadDoc';
import { useNavigate } from 'react-router-dom';

const MultiStepForm = () => {
  const email = useSelector(state => state.user.email);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    user: email,
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
    room_types: []
  });

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    return parts.length === 2 ? `${timeStr}:00` : timeStr;  
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
    const departmentNamesArray = Array.isArray(formData.department_names) 
      ? formData.department_names 
      : formData.department_names.split(',').map(dep => dep.trim());
  
    const transformedData = {
      user: formData.user || "",
      hotel_name: formData.hotel_name || "",
      legal_business_name: formData.legal_business_name || "",
      year_established: safeParseInt(formData.year_established),
      license_registration_numbers: formData.license_registration_numbers || "",
      complete_address: formData.complete_address || "",
      main_phone_number: formData.main_phone_number || "",
      emergency_phone_number: formData.emergency_phone_number || "",
      email_address: formData.email_address || "",
      total_number_of_rooms: safeParseInt(formData.total_number_of_rooms),
      number_of_floors: safeParseInt(formData.number_of_floors),
      valet_parking_available: Boolean(formData.valet_parking_available),
      valet_parking_capacity: formData.valet_parking_available 
        ? formData.valet_parking_capacity 
        : "",
      check_in_time: formatTime(formData.check_in_time),
      check_out_time: formatTime(formData.check_out_time),
      payment_methods: formData.payment_methods,
      room_price: safeParseFloat(formData.room_price),
      number_of_departments: safeParseInt(formData.number_of_departments),
      department_names: departmentNamesArray,
      room_types: Array.isArray(formData.room_types) ? formData.room_types.map(type => ({
        room_type: type.type || "",
        count: safeParseInt(type.count) || 0
      })) : []
    };
  
    return transformedData;
  };

  const handleSubmit = async () => {
    try {
      const transformedData = transformFormData();
      console.log('Transformed data:', transformedData);

      const formDataToSend = new FormData();

      if (formData.staff_excel_sheet instanceof File) {
        formDataToSend.append('staff_excel_sheet', formData.staff_excel_sheet);
      }

      Object.entries(transformedData).forEach(([key, value]) => {
        if (key === 'room_types' || key === 'department_names') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key !== 'staff_excel_sheet') {
          formDataToSend.append(key, value?.toString() || '');
        }
      });

      const response = await axios.post(
        'https://hotelcrew-1.onrender.com/api/hoteldetails/register/',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.status === 201) {
        console.log('Form submitted successfully:', response.data);
        localStorage.setItem('registrationComplete', 'true');
        localStorage.setItem('multiStepCompleted', 'true');
        alert('Hotel registered!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorData = error.response?.data;
      if (errorData) {
        console.error('Validation errors:', errorData);
      }
    }
  };

  const updateFormData = (stepData, step) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      switch (step) {
        case 1:
          return {
            ...newData,
            hotel_name: stepData.hotel_name || "",
            legal_business_name: stepData.legal_business_name || "",
            year_established: stepData.year_established || "",
            license_registration_numbers: stepData.license_registration_numbers || ""
          };
        case 2:
          return {
            ...newData,
            complete_address: stepData.complete_address || "",
            main_phone_number: stepData.main_phone_number || "",
            emergency_phone_number: stepData.emergency_phone_number || "",
            email_address: stepData.email_address || ""
          };
        case 3:
          return {
            ...newData,
            department_names: Array.isArray(stepData.department_names) 
              ? stepData.department_names 
              : stepData.department_names.split(',').map(dep => dep.trim()),
            number_of_departments: safeParseInt(stepData.number_of_departments),
            staff_excel_sheet: stepData.staff_excel_sheet || null
          };
        case 4:
          return {
            ...newData,
            total_number_of_rooms: stepData.total_number_of_rooms || "",
            number_of_floors: stepData.number_of_floors || "",
            room_types: Array.isArray(stepData.room_types) ? stepData.room_types : [],
            valet_parking_capacity: stepData.valet_parking_capacity || ""
          };
        case 5:
          return {
            ...newData,
            valet_parking_available: Boolean(stepData.valet_parking_available),
            valet_parking_capacity: stepData.valet_parking_capacity || "",
            check_in_time: formatTime(stepData.check_in_time) || "",
            check_out_time: formatTime(stepData.check_out_time) || "",
            payment_methods: stepData.payment_methods || "",
            room_price: stepData.room_price || ""
          };
        case 6:
          return {
            ...newData,
            documents: stepData
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
            onNext={handleNext}
            onBack={handleBack}
            updateFormData={(data) => updateFormData(data, 5)}
            initialData={formData}
          />
        );
      case 6:
        return (
          <UploadDoc
            onSubmit={handleSubmit}
            onBack={handleBack}
            updateFormData={(data) => updateFormData(data, 6)}
            initialData={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderStep()}
    </div>
  );
};

export default MultiStepForm;