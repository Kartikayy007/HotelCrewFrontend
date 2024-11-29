import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminSidebar from './components/AdminSidebar';
import { setActiveComponent } from '../../redux/slices/AdminSlice';
import IncompleteRegisteration from '../common/IncompleteRegisteration';

const Admin = () => {
  const dispatch = useDispatch();
  const { activeComponent } = useSelector(state => state.admin);
  const [multiStepCompleted, setMultiStepCompleted] = useState(null);

  const handleMenuItemClick = (component) => {
    dispatch(setActiveComponent(component));
  };

  useEffect(() => {
    const multiStepCompleted = localStorage.getItem('multiStepCompleted');
    setMultiStepCompleted(multiStepCompleted);
    if (multiStepCompleted === 'false') {
      import('../common/IncompleteRegisteration').then(module => {
        dispatch(setActiveComponent(module.default));
      });
    }
  }, [dispatch]);

  return (
    <div className="flex h-screen">
      <AdminSidebar onMenuItemClick={handleMenuItemClick} />
        {multiStepCompleted === 'false' ? (
          <div className="incomplete-form">
            <IncompleteRegisteration />
          </div>
        ) : (
          <div className='flex-1'>
            {activeComponent && React.createElement(activeComponent)}
          </div>
        )}
    </div>
  );
};

export default Admin;