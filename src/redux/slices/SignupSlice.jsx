import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 1,
  formData: {

    hotelName: '',
    legalBusinessName: '',
    yearEstablished: '',
    licenseNumber: '',
    
    address: '',
    mainNumber: '',
    emergencyNumber: '',
    hotelEmail: '',
    
    numberOfRooms: '',
    numberOfFloors: '',
    parkingCapacity: '',
    roomTypes: []

  },
  isSubmitting: false,
  error: null
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateHotelInfo: (state, action) => {
      state.formData = {
        ...state.formData,
        ...action.payload
      };
    },
    nextStep: (state) => {
      if (state.currentStep < 3) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    }
  }
});

export const {
  updateHotelInfo,
  nextStep,
  prevStep,
  setError,
  setSubmitting
} = formSlice.actions;

export const selectCurrentStep = (state) => state.form.currentStep;
export const selectHotelInfo = (state) => state.form.formData;
export const selectIsSubmitting = (state) => state.form.isSubmitting;
export const selectError = (state) => state.form.error;

export default formSlice.reducer;