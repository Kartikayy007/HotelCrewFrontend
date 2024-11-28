import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Database,
  Receipt,
  Settings,
  LineChart,
  Menu,
  X,
  ClipboardCheck,
  Calendar
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import DataBase from '../../common/DataBase';
import AdminPayRoll from './AdminPayRoll';
import AdminAnalaytics from './AdminAnalaytics';
import AdminLeaveManagment from './AdminLeaveManagment';
import AdminSettings from './AdminSettings';
import AdminScheduleStatus from './AdminScheduleStatus';
import { selectUserProfile, selectUserProfileLoading, fetchUserProfile } from '../../../redux/slices/userProfileSlice';

const ProfileSkeleton = () => (
  <div className="flex flex-col items-center py-8 space-y-4">
    <div className="w-24 h-24 rounded-full bg-gray-700/50 animate-pulse" />
    <div className="h-6 w-32 bg-gray-700/50 rounded animate-pulse" />
  </div>
);

const ProfilePreviewModal = ({ imageUrl, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div 
        className="relative z-50 max-w-3xl w-full animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imageUrl || "/default-profile.png"}
          alt="Profile Preview"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

const AdminSidebar = ({ onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const isLoading = useSelector(selectUserProfileLoading);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', component: AdminDashboard },
    { icon: <LineChart size={20} />, label: 'Analytics', component: AdminAnalaytics },
    { icon: <Database size={20} />, label: 'Database', component: DataBase },
    { icon: <Receipt size={20} />, label: 'Payroll', component: AdminPayRoll },
    { icon: <Calendar size={20} />, label: 'Schedule status', component: AdminScheduleStatus },
    { icon: <ClipboardCheck size={20} />, label: 'Leave management', component: AdminLeaveManagment },
    { icon: <Settings size={20} />, label: 'Settings', component: AdminSettings },
  ];

  const handleMenuClick = (component) => {
    onMenuItemClick(component);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#252941] text-white 2xl:hidden"
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
          w-64 bg-[#252941] text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full 2xl:translate-x-0'}
        `} 
      >
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <div className="flex flex-col items-center py-8 space-y-4">
            <div 
              className="w-24 h-24 rounded-full overflow-hidden bg-gray-700  hover:opacity-90 transition-opacity"
              onClick={() => setIsPreviewOpen(true)}
            >
              <img
                src={userProfile?.user_profile || "/default-profile.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">
              {userProfile?.user_name || 'User'}
            </h2>
          </div>
        )}

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
      <ProfilePreviewModal 
        imageUrl={userProfile?.user_profile}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
};

export default AdminSidebar;