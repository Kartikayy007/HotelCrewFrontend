import React, { useState } from 'react';
import axios from 'axios';
import Hoteldetails from './Hoteldetails';
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

      const formDataToSend = new FormData();
      formDataToSend.append('hotelInfo', JSON.stringify(formData.hotelInfo));
      formDataToSend.append('contactInfo', JSON.stringify(formData.contactInfo));
      formDataToSend.append('staffInfo', JSON.stringify(formData.staffInfo));
      formDataToSend.append('propertyDetails', JSON.stringify(formData.propertyDetails));
      formDataToSend.append('operationalInfo', JSON.stringify(formData.operationalInfo));

      formData.documents.forEach((file, index) => {
        formDataToSend.append(`documents[${index}]`, file);
      });

      const response = await axios.post('http://localhost:8000/api/hoteldetails/register/', formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response:', response);
      
      if (response.status !== 201) {
        throw new Error('Submission failed');
      }
      
      
    } catch (error) {
      console.error('Error submitting form:', error);
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