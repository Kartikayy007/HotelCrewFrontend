import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const SettingsStep = ({ children, isActive }) => (
  <div className={`${isActive ? 'block' : 'hidden'} w-full`}>
    {children}
  </div>
);

const ContactInformation = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold">Contact Information</h2>
    <div>
      <label className="block text-sm font-medium mb-2">Complete Address*</label>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Phone Number*</label>
        <input
          type="tel"
          placeholder="Main number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">&nbsp;</label>
        <input
          type="tel"
          placeholder="Emergency number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium mb-2">Hotel E-mail*</label>
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
  </div>
);

const PropertyDetails = () => {
  const [roomTypes, setRoomTypes] = useState([]);

  const addRoomType = () => {
    setRoomTypes([...roomTypes, { type: '', count: '' }]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Property Details</h2>
      <div>
        <label className="block text-sm font-medium mb-2">Number of Rooms</label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Types of Rooms</label>
        {roomTypes.map((room, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Type of Room"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Number of Rooms"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <button
          onClick={addRoomType}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add Room Type
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Number of Floors</label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="rounded border-gray-300" />
          <span className="text-sm font-medium">Valet Parking Available</span>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Parking Capacity</label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
};

const SettingsForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className=" bg-slate-50">
      <div className=" mx-auto">
        
        <div className="bg-white rounded-lg shadow-sm p-6">

          <form className="space-y-6">
            <SettingsStep isActive={currentStep === 1}>
              <ContactInformation />
            </SettingsStep>
            
            <SettingsStep isActive={currentStep === 2}>
              <PropertyDetails />
            </SettingsStep>

            <SettingsStep isActive={currentStep === 3}>
              <h2 className="text-xl font-bold">Amenities</h2>
              {/* Add amenities form content */}
            </SettingsStep>

            <SettingsStep isActive={currentStep === 4}>
              <h2 className="text-xl font-bold">Policies</h2>
              {/* Add policies form content */}
            </SettingsStep>

            <SettingsStep isActive={currentStep === 5}>
              <h2 className="text-xl font-bold">Photos</h2>
              {/* Add photos form content */}
            </SettingsStep>

            <SettingsStep isActive={currentStep === 6}>
              <h2 className="text-xl font-bold">Review</h2>
              {/* Add review form content */}
            </SettingsStep>

            <div className="flex justify-between items-center pt-6">
              <div className="flex space-x-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentStep(i + 1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <div className="space-x-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Next
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;