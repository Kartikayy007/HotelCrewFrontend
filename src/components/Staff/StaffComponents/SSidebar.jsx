import React, { useState } from 'react';
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
import SDashboard from './SDashboard';
import STask from './STask';
import SProfile from './SProfile';
import SSchedule from './SSchedule';

const SSidebar = ({ onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState('/profile.png');
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
    }
}
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', component: 'SDashboard' },
    { icon: <LineChart size={20} />, label: 'Task', component: 'STask' },
    { icon: <Database size={20} />, label: 'Schedule', component: 'SSchedule' },
    { icon: <Receipt size={20} />, label: 'My Profile', component: 'SProfile' },
   
  ];

  const handleMenuClick = (component) => {
    onMenuItemClick(component);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#252941] text-white lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={`
          fixed top-0 left-0 h-full z-40
          lg:sticky lg:top-0 lg:left-0
          w-64 bg-[#252941] text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
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

export default SSidebar;