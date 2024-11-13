import React from 'react';
import { LayoutDashboard, CalendarClock, Database, Receipt, Settings,LineChart } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminScheduleStatus from './AdminScheduleStatus';
import AdminDataBase from './AdminDataBase';
import AdminPayRoll from './AdminPayRoll';
import AminAnalaytics from './AminAnalaytics';
import AdminSettings from './AdminSettings';

const AdminSidebar = ({ onMenuItemClick }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', component: AdminDashboard },
    { icon: <CalendarClock size={20} />, label: 'Schedule status', component: AdminScheduleStatus },
    { icon: <Database size={20} />, label: 'Database', component: AdminDataBase },
    { icon: <Receipt size={20} />, label: 'Payroll', component: AdminPayRoll },
    { icon: <LineChart size={20} />, label: 'Analytics', component: 
    AminAnalaytics },
    { icon: <Settings size={20} />, label: 'Settings', component: AdminSettings },
  ];

  return (
    <nav className="w-64 bg-[#252941] text-white flex flex-col">
      <div className="flex flex-col items-center py-8 space-y-4">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <img 
            src="/api/placeholder/96/96"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-semibold">Kartikay</h2>
      </div>

      <ul className="flex-1 space-y-4 px-6 py-4">
        {menuItems.map((item, index) => (
          <li key={index}>
            <button 
              href=""
              onClick={() => onMenuItemClick(item.component)}
              className="flex items-center space-x-4 p-2 rounded-lg hover:bg-white/10 transition-colors w-full"
            >
              {item.icon}
              <span className="text-lg">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminSidebar;