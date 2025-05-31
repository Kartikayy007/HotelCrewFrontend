import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import Admin from './components/admin/Admin';
import MainLayout from './components/Manager/MainLayout';
import Reception from './components/receptionist/Reception';
import SLayout from './components/Staff/SLayout';
import Login from './components/Login/Login';
import SignUp from './components/signup/SignUp';
import MultiStepForm from './components/Registration/MultiStepForm';
import Onboarding from './components/Onboarding';
import Page404 from './components/common/Page404';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { token, userData } = useSelector(state => state.user);
  const location = useLocation();
  

  const accessToken = token || localStorage.getItem('accessToken');
  const userRole = userData?.role || localStorage.getItem('role');

   ('RoleBasedRoute Check:', {
    token: !!accessToken,
    userRole,
    allowedRoles,
    currentPath: location.pathname
  });

  if (!accessToken) {
     ('No token, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
     ('Role not allowed:', {
      userRole,
      allowedRoles
    });
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const RegistrationFlowGuard = ({ children }) => {
  const location = useLocation();
  const { isHotelRegistered } = useSelector(state => state.user);
  const accessToken = localStorage.getItem('accessToken');
  const storedIsHotelRegistered = localStorage.getItem('isHotelRegistered') === 'true';

  if (location.pathname === '/signup/hoteldetails') {
    if (isHotelRegistered || storedIsHotelRegistered) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (!isHotelRegistered && accessToken) {
      return children;
    }

    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const PublicRoute = ({ children, allowAccess = false }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  const { isHotelRegistered } = useSelector(state => state.user);
  let user = null;

  try {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowAccess) {
    return children;
  }

  if (accessToken && user?.role) {
    const roleRoutes = {
      'Admin': '/admin/dashboard',
      'Manager': '/manager/dashboard',
      'Receptionist': '/reception/dashboard', 
      'Staff': '/staff/dashboard'
    };
    
    const redirectPath = roleRoutes[user.role];
    return redirectPath ? <Navigate to={redirectPath} replace /> : children;
  }

  return children;
};

const App = () => {
  return (
    <HelmetProvider>
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
            <RoleBasedRoute allowedRoles={['Receptionist']}> 
              <Reception />
            </RoleBasedRoute>
          } />
          
          <Route path="/staff/dashboard/*" element={
            <RoleBasedRoute allowedRoles={['Staff']}>
              <SLayout />
            </RoleBasedRoute>
          } />

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Page404 />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;