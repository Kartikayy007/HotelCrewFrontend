import React, { useState } from 'react';
import { LayoutDashboard, Settings, Calendar, Menu, X } from 'lucide-react';
import Dashboard from './Dashboard';
import GuestRequest from './GuestRequest';
import RoomManagement from './RoomManagement';
import Schedule from './Schedule';
import Profile from './Profile';

interface SidebarProps {
  onMenuItemClick: (component: React.ComponentType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', component: Dashboard },
    { icon: <img src="/guestreq.svg" alt="" />, label: 'Guest Request', component: GuestRequest },
    { icon: <img src="/roommanagment.svg" alt="" />, label: 'Room Management', component: RoomManagement },
    { icon: <Calendar size={20} />, label: 'Schedule', component: Schedule },
    { icon: <Settings size={20} />, label: 'Profile', component: Profile }
  ];

  const handleMenuClick = (component: React.ComponentType) => {
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
        <div className="flex flex-col items-center py-8 space-y-4">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src=""
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold">User Name</h2>
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

export default Sidebar;