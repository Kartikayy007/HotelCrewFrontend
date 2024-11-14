// import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentComponent } from "../../redux/slices/ManagerSlice";
import Dash from './Dash'
import MDatabase from "./MDatabase";
import MExpense from "./MExpense";
import MSchedule from "./MSchedule";
import MStaff from "./MStaff";
import MSettings from "./MSettings";
// import { setActiveComponent } from './redux/actions';
 // Import your Redux action

const MSideBar = () => {
    const [image, setImage] = useState('/profile.png');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const currentComponent = useSelector(state => state.manager.currentComponent);
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
    const renderContent = () => {
        switch (currentComponent) {
            case 'Dashboard': return <Dash />;
            case 'Schedule':console.log("hell"); return <MSchedule />;
            case 'Database': return <MDatabase />;
            case 'Staff': return <MStaff />;
            case 'Expense': return <MExpense />;
            case 'Settings': return <MSettings />;
            default: return <Dash />;
        }
    };


    return (
        <section className='font-Montserrat lg:min-h-screen lg:w-full overflow-hidden'>
            <div className='h-screen flex bg-[#e6eef9]'>
                <div className={`lg:w-[17.5%] h-screen min-w-[253px] bg-[#252941] transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-10`}>

                    <div className='h-[30%] flex flex-col justify-center items-center text-[20px] text-[#e6eef9]'>
                        <div className="w-[107px] h-[107px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
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
                        <div className="mt-6 font-semibold text-2xl">User Name</div>
                    </div>
                    <div className='h-[70%] flex flex-col text-[#e6eef9] justify-evenly text-base'>

                        <div onClick={() => dispatch(setCurrentComponent('Dashboard'))} className='flex flex-row cursor-pointer'>
                            <img src="/mdash.svg" alt="dash" className='pl-9 pr-9' />
                            <div >
                                Dashboard
                            </div>

                        </div>


                        <div onClick={() => {dispatch(setCurrentComponent('Schedule')); console.log("schedule")} } className='flex flex-row cursor-pointer'>
                            <img src="/mschedule.svg" alt="dash" className='pl-9 pr-9' />
                            Schedule Status
                        </div>


                        <div onClick={() => {dispatch(setCurrentComponent('Database'));console.log("data")}} className='flex flex-row cursor-pointer'>
                            <img src="/mdatabase.svg" alt="dash" className='pl-9 pr-9' />
                            Database
                        </div>


                        <div onClick={() => dispatch(setCurrentComponent('Staff'))} className='flex flex-row cursor-pointer'>
                            <img src="/mstaff.svg" alt="dash" className='pl-9 pr-9' />
                            Staff Performance
                        </div>


                        <div onClick={() => dispatch(setCurrentComponent('Expense'))} className='flex flex-row cursor-pointer'>
                            <img src="/mexpense.svg" alt="dash" className='pl-9 pr-9' />
                            Expense Tracking
                        </div>

                        <div onClick={() => dispatch(setCurrentComponent('Settings'))} className='flex flex-row cursor-pointer'>
                            <img src="/msettings.svg" alt="dash" className='pl-9 pr-9' />
                            Settings
                        </div>

                    </div>
                </div>
                <div className='flex-1 p-6'>
                    {renderContent()}
                </div>
                <div className='lg:hidden fixed top-4 left-4 z-20'>
                    <button onClick={toggleSidebar} className={`${isSidebarOpen ? 'text-white' : 'text-[#252941]'}`}>
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default MSideBar;
