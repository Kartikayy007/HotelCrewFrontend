import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminSidebar from './components/AdminSidebar';
import { setActiveComponent } from '../../redux/slices/AdminSlice';

const Admin = () => {
  const dispatch = useDispatch();
  const { activeComponent } = useSelector(state => state.admin);

  const handleMenuItemClick = (component) => {
    dispatch(setActiveComponent(component));
  };

  useEffect(() => {
    const multiStepCompleted = localStorage.getItem('multiStepCompleted');
    if (multiStepCompleted === 'false') {
      import('../common/IncompleteRegisteration').then(module => {
        dispatch(setActiveComponent(module.default));
      });
    }
  }, [dispatch]);

  return (
    <div className="flex h-screen">
      <AdminSidebar onMenuItemClick={handleMenuItemClick} />
      <div className="flex-1">
        {activeComponent && React.createElement(activeComponent)}
      </div>
    </div>
  );
};

export default Admin;