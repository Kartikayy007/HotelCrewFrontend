import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components
import Admin from './components/admin/Admin';
import MainLayout from './components/Manager/MainLayout';
import Reception from './components/receptionist/Reception'
// import StaffDashboard from './components/Dashboard/StaffDashboard';
import Login from './components/Login/Login';
import SignUp from './components/signup/SignUp';
import MultiStepForm from './components/Registration/MultiStepForm';
import Onboarding from './components/Onboarding';
import Page404 from './components/common/Page404';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  let user = null;

  try {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Registration Flow Guard
const RegistrationFlowGuard = ({ children }) => {
  const location = useLocation();
  const isRegistrationStarted = localStorage.getItem('registrationStarted');
  const isOtpVerified = localStorage.getItem('otpVerified');
  const multiStepCompleted = localStorage.getItem('multiStepCompleted');
  const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  let user = null;

  try {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }


  if (location.pathname === '/signup/hoteldetails') {
    if (multiStepCompleted === 'false' && user?.role === 'Admin') {
      return children;
    }

    if (isRegistrationStarted && isOtpVerified) {
      return children;
    }

    // Case 3: Authenticated admin
    if (accessToken && user?.role === 'Admin') {
      return children;
    }

    // Redirect to signup if registration not started
    if (!isRegistrationStarted) {
      return <Navigate to="/signup" replace />;
    }

    // Redirect to unauthorized for others
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// PublicRoute component with allowAccess prop
const PublicRoute = ({ children, allowAccess = false }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  let user = null;

  try {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access to specified routes even when logged in
  if (allowAccess) {
    return children;
  }

  // Redirect to role-specific dashboard if already logged in
  if (accessToken && user?.role) {
    const roleRoutes = {
      'Admin': '/admin/dashboard',
      'Manager': '/manager/dashboard',
      'Reception': '/reception/dashboard',
      'Staff': '/staff/dashboard'
    };
    
    const redirectPath = roleRoutes[user.role];
    return redirectPath ? <Navigate to={redirectPath} replace /> : children;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing/Public Routes */}
        <Route path="/" element={
          <PublicRoute allowAccess={true}>
            <Onboarding />
          </PublicRoute>
        } />
        
        <Route path="/login" element={
          <PublicRoute allowAccess={true} >
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/signup" element={
          <PublicRoute allowAccess={true}>
            <SignUp />
          </PublicRoute>
        } />
        
        <Route path="/signup/hoteldetails" element={
          <RegistrationFlowGuard>
            <MultiStepForm />
          </RegistrationFlowGuard>
        } />

        {/* Protected Routes */}
        <Route path="/admin/dashboard/*" element={
          <RoleBasedRoute allowedRoles={['Admin']}>
            <Admin />
          </RoleBasedRoute>
        } />
        
        <Route path="/manager/dashboard/*" element={
          <RoleBasedRoute allowedRoles={['Manager']}>
            <MainLayout />
          </RoleBasedRoute>
        } />
        
        <Route path="/reception/dashboard/*" element={
          <RoleBasedRoute allowedRoles={['Reception']}>
            <Reception />
          </RoleBasedRoute>
        } />
        
        <Route path="/staff/dashboard/*" element={
          <RoleBasedRoute allowedRoles={['Staff']}>
            {/* <StaffDashboard /> */}
          </RoleBasedRoute>
        } />

        {/* Error Routes */}
        <Route path="/unauthorized" element={<Page404 />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
};

export default App;