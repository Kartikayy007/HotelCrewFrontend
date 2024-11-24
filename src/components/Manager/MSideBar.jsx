// import { useState } from "react";
// import {
//     LayoutDashboard,
//     CalendarClock,
//     Database,
//     Settings,
//     LineChart,
//     Menu,
//     X,
//     ClipboardCheck } from 'lucide-react';



// const MSideBar = ({ onMenuItemClick }) => {
//     const [image, setImage] = useState('/profile.png');
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     }

//     const handleImageUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const imageUrl = URL.createObjectURL(file);
//             setImage(imageUrl);
//         }
//     }
//     const menuItems = [
//         { icon: <LayoutDashboard size={20} />, label: 'Dashboard', component: 'MDashboard' },
//         { icon: <CalendarClock size={20} />, label: 'Schedule ', component: 'MSchedule' },
//         { icon: <ClipboardCheck size={20} />, label: 'Attendance', component: 'MAttendance' },
//         { icon: <Database size={20} />, label: 'Database', component: 'MDatabase' },
//         { icon: <LineChart size={20} />, label: 'Analytics', component: 'MAnalytics' },
//         { icon: <Settings size={20} />, label: 'Profile', component: 'MProfile' },
//     ];

//     const handleMenuClick = (component) => {
//         if (onMenuItemClick) {
//             onMenuItemClick(component); // Notify parent component
//         }
//     };

//     return (
//         <>
//             <div className='xl:hidden fixed top-6  left-2 z-50'>
//                 <button onClick={toggleSidebar} className={`${isSidebarOpen ? 'text-white ' : 'text-[#252941]'}`}>
//                     {isSidebarOpen ? <X size={34} className="text-white" /> : <Menu size={34} />}
//                 </button>
//             </div>
//             <nav className={`
//                 fixed top-0 left-0 h-full z-30 
//                 xl:sticky xl:top-0 xl:left-0
//                 w-64 bg-[#252941] text-white flex flex-col
//                 transform transition-transform duration-300 ease-in-out
//                  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//               `}>
//                 <div className="flex flex-col items-center py-8 space-y-4">
//                     <div className="w-24 h-24 rounded-full overflow-hidden cursor-pointer">
//                         <img
//                             src={image}
//                             alt="profile"
//                             className="w-full h-full object-cover"
//                             onClick={() => document.getElementById("imageUpload").click()}
//                         />
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageUpload}
//                             style={{ display: 'none' }}
//                             id="imageUpload"
//                         />
//                     </div>
//                     <h2 className="text-xl font-semibold">Username</h2>
//                 </div>

//                 <ul className="flex-1 space-y-5  px-6 py-4 justify-center">
//                     {menuItems.map((item, index) => (
//                         <li key={index}>
//                             <button
//                                 onClick={() => handleMenuClick(item.component)}
//                                 className="flex items-center space-x-4 p-2 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
//                             >
//                                 {item.icon}
//                                 <span className="text-lg">{item.label}</span>
//                             </button>
//                         </li>
//                     ))}
//                 </ul>
//             </nav>
//         </>
//     );



// };

// export default MSideBar;

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  Settings,
  LineChart,
  Menu,
  X,
  ClipboardCheck,
  Calendar
} from 'lucide-react';
import MDashboard from './MDashboard';
import MDatabae from './MDatabase';
import MSchedule from './MSchedule';
import MAnalytics from './MAnalytics';
import MAttendance from './MAttendance';
import MProfile from './MProfile';

const MSideBar = ({ onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', component: MDashboard },
    { icon: <Calendar size={20} />, label: 'Schedule status', component: MSchedule },
    { icon: <ClipboardCheck size={20} />, label: 'Attendance & Leave', component: MAttendance },
    { icon: <LineChart size={20} />, label: 'Analytics', component: MAnalytics },
    { icon: <Database size={20} />, label: 'Database', component: MDatabae },
    { icon: <Settings size={20} />, label: 'Profile', component: MProfile },
  ];

  const handleMenuClick = (component) => {
    onMenuItemClick(component);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-8 left-4 z-50 p-2 rounded-lg bg-[#252941] text-white 2xl:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 2xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={`
          fixed top-0 left-0 h-full z-40
          2xl:sticky 2xl:top-0 2xl:left-0
          w-72 bg-[#252941] text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full 2xl:translate-x-0'}
        `}
      >
        <div className="flex flex-col items-center py-8 space-y-4">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src="/profile.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold">Username</h2>
        </div>

        <ul className="flex-1 space-y-4 px-6 py-4">
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
