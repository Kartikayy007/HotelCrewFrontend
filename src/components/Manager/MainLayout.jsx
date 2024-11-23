
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { setCurrentComponent } from "../../redux/slices/ManagerSlice";
import MSideBar from './MSideBar';
import MDashboard from './MDashboard';
import MSchedule from './MSchedule';
import MAttendance from './MAttendance';
import MDatabase from './MDatabase';
import MAnalytics from './MAnalytics';
import MProfile from './MProfile';

const MainLayout = () => {
    const dispatch = useDispatch();
    const componentMap = {
        MDashboard: <MDashboard />,
        MSchedule: <MSchedule />,
        MAttendance: <MAttendance />,
        MDatabase: <MDatabase />,
        MAnalytics: <MAnalytics />,
        MProfile: <MProfile />,
    };
    const currentComponent = useSelector((state) => state.manager.currentComponent);

    const handleMenuItemClick = (component) => {
        dispatch(setCurrentComponent(component)); // Update the Redux state
    };

    return (
        <div className="flex h-screen">
            <MSideBar onMenuItemClick={handleMenuItemClick} />
            <div className="flex-1 bg-[#e6eef9] overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full scrollbar-track-gray-100">
                {/* {currentComponent
                    ? React.createElement(currentComponent)
                    : <div>Component not found</div>} */}
                    {componentMap[currentComponent] || <div>Component not found</div>}
            </div>
        </div>
    );
};

export default MainLayout;
