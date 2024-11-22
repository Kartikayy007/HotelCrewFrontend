import { useState } from "react";
import {
    LayoutDashboard,
    CalendarClock,
    Database,
    Settings,
    LineChart,
    Menu,
    X,
    ClipboardCheck } from 'lucide-react';



const MSideBar = ({ onMenuItemClick }) => {
    const [image, setImage] = useState('/profile.png');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    }
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', component: 'MDashboard' },
        { icon: <CalendarClock size={20} />, label: 'Schedule ', component: 'MSchedule' },
        { icon: <ClipboardCheck size={20} />, label: 'Attendance', component: 'MAttendance' },
        { icon: <Database size={20} />, label: 'Database', component: 'MDatabase' },
        { icon: <LineChart size={20} />, label: 'Analytics', component: 'MAnalytics' },
        { icon: <Settings size={20} />, label: 'Profile', component: 'MProfile' },
    ];

    const handleMenuClick = (component) => {
        if (onMenuItemClick) {
            onMenuItemClick(component); // Notify parent component
        }
    };

    return (
        <>
            <div className='xl:hidden fixed top-6  left-2 z-50'>
                <button onClick={toggleSidebar} className={`${isSidebarOpen ? 'text-white ' : 'text-[#252941]'}`}>
                    {isSidebarOpen ? <X size={34} className="text-white" /> : <Menu size={34} />}
                </button>
            </div>
            <nav className={`
                fixed top-0 left-0 h-full z-30 
                xl:sticky xl:top-0 xl:left-0
                w-64 bg-[#252941] text-white flex flex-col
                transform transition-transform duration-300 ease-in-out
                 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              `}>
                <div className="flex flex-col items-center py-8 space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden cursor-pointer">
                        <img
                            src={image}
                            alt="profile"
                            className="w-full h-full object-cover"
                            onClick={() => document.getElementById("imageUpload").click()}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id="imageUpload"
                        />
                    </div>
                    <h2 className="text-xl font-semibold">Username</h2>
                </div>

                <ul className="flex-1 space-y-5  px-6 py-4 justify-center">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => handleMenuClick(item.component)}
                                className="flex items-center space-x-4 p-2 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
                            >
                                {item.icon}
                                <span className="text-lg">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );



};

export default MSideBar;
