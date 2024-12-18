import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { setCurrentComponent } from "../../redux/slices/ManagerSlice";
import MSideBar from './MSideBar';

const MainLayout = () => {
  const dispatch=useDispatch();
//   const currentComponent = useSelector(state => state.manager.currentComponent);
const { currentComponent } = useSelector(state => state.manager);

  const handleMenuItemClick = (component) => {
    dispatch(setCurrentComponent(component));
  };

  return (
    <div className="flex h-screen">
      <MSideBar onMenuItemClick={handleMenuItemClick} />
      <div className="flex-1 bg-[#e6eef9] overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full scrollbar-track-gray-100">
      {currentComponent
                    ? React.createElement(currentComponent)
                    : <div>Component not found</div>}
      </div>
    </div>
  );

};

export default MainLayout;