import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import { setActiveComponent } from '../../redux/slices/ReceptionSlice';
import store from '../../redux/Store';

type RootState = ReturnType<typeof store.getState>;

const Reception: React.FC = () => {
  const dispatch = useDispatch();
  const { activeComponent } = useSelector((state: RootState) => state.reception);

  const handleMenuItemClick = (component: React.ComponentType) => {
    dispatch(setActiveComponent(component));
  };

  return (
    <div className="flex h-screen">
      <Sidebar onMenuItemClick={handleMenuItemClick} />
      <div className="flex-1">
        {activeComponent && React.createElement(activeComponent)}
      </div>
    </div>
  );
};

export default Reception;