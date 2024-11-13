import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminSidebar from './admin components/AdminSidebar';
import { setActiveComponent } from '../../redux/slices/adminSlice';

const Admin = () => {
  const dispatch = useDispatch();
  const { activeComponent } = useSelector(state => state.admin);

  const handleMenuItemClick = (component) => {
    dispatch(setActiveComponent(component));
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar onMenuItemClick={handleMenuItemClick} />
      <div className="flex-1">
        {React.createElement(activeComponent)}
      </div>
    </div>
  );
};

export default Admin;