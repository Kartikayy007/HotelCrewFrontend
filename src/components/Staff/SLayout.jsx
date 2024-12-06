import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { setCurrentComponent } from "../../redux/slices/StaffSlice";
import SSidebar from './StaffComponents/SSidebar'
import SDashboard from './StaffComponents/SDashboard'
import STask from './StaffComponents/STask';
import SSchedule from './StaffComponents/SSchedule';
import SProfile from './StaffComponents/SProfile';


const SLayout = () => {
    const dispatch = useDispatch();
    const componentMap = {
        SDashboard: <SDashboard />,
        SSchedule: <SSchedule />,
        SProfile: <SProfile />,
        STask: <STask />,
    };
    const currentComponent = useSelector((state) => state.staff.currentComponent);

    const handleMenuItemClick = (component) => {
        dispatch(setCurrentComponent(component)); 
    };

    return (
        <div className="flex h-screen">
            <SSidebar onMenuItemClick={handleMenuItemClick} />
            <div className="flex-1 bg-[#e6eef9] overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full scrollbar-track-gray-100">
                
                    {componentMap[currentComponent] || <div>Component not found</div>}
            </div>
        </div>
    );
};

export default SLayout;