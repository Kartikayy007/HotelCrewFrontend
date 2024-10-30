// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { nextStep, selectCurrentStep } from './slices/SignupSlice';
// import HotelDetails from './HotelDetails';
// import ContactInfo from './Registration/ContactInfo';
// // Example for another step

// const HotelRegistration = () => {
//   const currentStep = useSelector(selectCurrentStep);
//   const dispatch = useDispatch();

//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return <HotelDetails />;
//       case 2:
//         return <ContactInfo />;
//       // Add more cases for additional steps
//       default:
//         return <HotelDetails />;
//     }
//   };

//   return (
//     <div>
//       {renderStep()}
//       <button onClick={() => dispatch(nextStep())}>Next</button>
//     </div>
//   );
// };

// export default HotelRegistration;