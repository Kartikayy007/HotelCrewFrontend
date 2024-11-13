import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

const SidebarLayout = () => {
    const [image, setImage] = useState('/profile.png');

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    return (
        <section className='font-Montserrat lg:min-h-screen lg:w-full overflow-hidden'>
            <div className='h-screen flex bg-[#e6eef9]'>
                <div className='lg:w-[17.5%] min-w-[253px] bg-[#252941]'>
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
                        <div className="mt-6">User Name</div>
                    </div>
                    <div className='h-[70%] flex flex-col text-[#e6eef9] justify-evenly text-[16px]'>
                        <Link to='/mdashboard'>
                            <div className='flex flex-row'>
                                <img src="/mdash.svg" alt="dash" className='pl-9 pr-9' />
                                Dashboard
                            </div>
                        </Link>
                        <Link to='/mschedule'>
                            <div className='flex flex-row'>
                                <img src="/mschedule.svg" alt="dash" className='pl-9 pr-9' />
                                Schedule Status
                            </div>
                        </Link>
                        <Link to='/mdatabase'>
                            <div className='flex flex-row'>
                                <img src="/mdatabase.svg" alt="dash" className='pl-9 pr-9' />
                                Database
                            </div>
                        </Link>
                        <Link to='/mstaff'>
                            <div className='flex flex-row'>
                                <img src="/mstaff.svg" alt="dash" className='pl-9 pr-9' /> 
                                 Staff Performance
                            </div>
                        </Link>
                        <Link to='/mexpense'>
                            <div className='flex flex-row'>
                                <img src="/mexpense.svg" alt="dash" className='pl-9 pr-9' /> 
                                Expense Tracking
                            </div>
                        </Link>
                        <Link to='/msettings'>
                            <div className='flex flex-row'>
                                <img src="/msettings.svg" alt="dash" className='pl-9 pr-9' /> 
                                Settings
                            </div>
                        </Link>
                    </div>
                </div>
                <div className='flex-1 p-6'>
                    <Outlet />
                </div>
            </div>
        </section>
    );
};

export default SidebarLayout;
