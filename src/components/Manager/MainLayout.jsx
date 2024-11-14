import { useSelector } from 'react-redux';
import Dash from './Dash';
import MSchedule from './MSchedule';
import MDatabase from './MDatabase';
import MExpense from './MExpense';
import MSettings from './MSettings';
import MStaff from './MStaff';

const MainLayout = () => {
  const activeComponent = useSelector((state) => state.view.activeComponent);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dash />;
      case 'schedule':
        return <MSchedule />;
      case 'expense':
        return <MExpense />;
      case 'settings':
        return <MSettings />;
      case 'staff':
        return <MStaff />;
      default:
        return <Dash />;
    }
  };

  return (
    <div className="main-layout">
      <MSideBar />
      <div className="content-area">
        {renderComponent()}
      </div>
    </div>
  );
};

export default MainLayout;
