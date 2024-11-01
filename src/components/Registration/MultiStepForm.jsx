import React, { useState } from 'react';
import axios from 'axios';
import Hoteldetails from './HotelDetails';
import ContactInfo from './ContactInfo';
import StaffManagement from './StaffManagment';
import Property from './Property';
import OperationalInfo from './OperationalInfo';
import UploadDoc from './UploadDoc';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    hotelInfo: {},
    contactInfo: {},
    staffInfo: {},
    propertyDetails: {},
    operationalInfo: {},
    documents: []
  });

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      console.log('Final form data:', formData);

      // Replace with your API endpoint
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Form data:', formData);
      
      if (response.status !== 201) {
        throw new Error('Submission failed');
      }
      
      // Handle successful submission
      alert('Form submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Hoteldetails 
            onNext={handleNext}
            updateFormData={(data) => setFormData(prev => ({ ...prev, hotelInfo: data }))}
            initialData={formData.hotelInfo}
          />
        );
      case 2:
        return (
          <ContactInfo
            onNext={handleNext}
            onBack={handleBack}
            updateFormData={(data) => setFormData(prev => ({ ...prev, contactInfo: data }))}
            initialData={formData.contactInfo}
          />
        );
      case 3:
        return (
          <StaffManagement
            onNext={handleNext}
            onBack={handleBack}
            updateFormData={(data) => setFormData(prev => ({ ...prev, staffInfo: data }))}
            initialData={formData.staffInfo}
          />
        );
      case 4:
        return (
          <Property
            onNext={handleNext}
            onBack={handleBack}
            updateFormData={(data) => setFormData(prev => ({ ...prev, propertyDetails: data }))}
            initialData={formData.propertyDetails}
          />
        );
      case 5:
        return (
          <OperationalInfo
            onNext={handleNext}
            onBack={handleBack}
            updateFormData={(data) => setFormData(prev => ({ ...prev, operationalInfo: data }))}
            initialData={formData.operationalInfo}
          />
        );
      case 6:
        return (
          <UploadDoc
            onSubmit={handleSubmit}
            onBack={handleBack}
            updateFormData={(data) => setFormData(prev => ({ ...prev, documents: data }))}
            initialData={formData.documents}
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