import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login/Login';
import Home from './components/Home';
import MultiStepForm from './components/Registration/MultiStepForm';
import SignUp from './components/signup/SignUp';
import Onboarding from './components/Onboarding';

const RegistrationFlowGuard = ({ children }) => {
  const location = useLocation();
  const isRegistrationStarted = localStorage.getItem('registrationStarted');
  const isOtpVerified = localStorage.getItem('otpVerified');


  if (location.pathname === '/signup/hoteldetails' && (!isRegistrationStarted || !isOtpVerified)) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken')|| sessionStorage.getItem('accessToken');;

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const rememberMe = localStorage.getItem('rememberMe');
  const accessToken = localStorage.getItem('accessToken')|| sessionStorage.getItem('accessToken');
  const user = useSelector((state) => state.user);

  if (accessToken && user.email && (location.pathname === '/login' || location.pathname === '/signup' ||location.pathname==='/')) {
    // return <Navigate to="/dashboard" replace />;
    if (rememberMe || sessionStorage.getItem('accessToken')) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};
const LandingRoute = ({ children }) => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  const accessToken = localStorage.getItem('accessToken') ;
  const user = useSelector((state) => state.user);

  // Redirect to dashboard if user is authenticated (remembered or session) when accessing the root path
  if (accessToken && rememberMe) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <RegistrationFlowGuard>
                <SignUp />
              </RegistrationFlowGuard>
            </PublicRoute>
          }
        />
        <Route
          path="/signup/hoteldetails"
          element={
            <PublicRoute>
              <RegistrationFlowGuard>
                <MultiStepForm />
              </RegistrationFlowGuard>
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <RegistrationFlowGuard>
                <Login />
              </RegistrationFlowGuard>
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <LandingRoute>
            <Onboarding />
          </LandingRoute>
        }
        />

        
         <Route path="*" element={<Navigate to="/" replace />} /> 
       

         {/* Redirect to "/" for any undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
};

export default App;