import React, { useState,useEffect } from 'react';
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
import { useSelector,useDispatch } from 'react-redux';
import MDashboard from './MDashboard';
import MDatabae from './MDatabase';
import MSchedule from './MSchedule';
import MAnalytics from './MAnalytics';
import MAttendance from './MAttendance';
import MProfile from './MProfile';
import { getStaffProfile, selectStaffProfile, selectStaffProfileLoading, selectStaffProfileError, } from '../../redux/slices/StaffProfileSlice';

const MSideBar = ({ onMenuItemClick }) => {
  const dispatch=useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const profile = useSelector(selectStaffProfile);
  const loading = useSelector(selectStaffProfileLoading);
  const error = useSelector(selectStaffProfileError);
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
  useEffect(() => {
    dispatch(getStaffProfile());
  }, [dispatch]);
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
              src={profile?.user_profile||'User Profile'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold">{profile?.user_name}</h2>
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