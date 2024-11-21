import React, { useEffect,useState } from 'react'
import { Skeleton } from '@mui/material'


const MProfile = ()=>{
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('/profile.png');
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
    }
}
useEffect(() => {
  
  setTimeout(() => {
    setLoading(false);  
  }, 1000); 
}, []);
  return (
    <section className=" h-screen p-2 mr-4 font-Montserrat">
      <h2 className="text-[#252941] text-2xl pl-5 mb-6 mt-4 font-semibold">Profile</h2>
      {loading ? (
      <Skeleton variant="rectangular" width="100%" height="70%" sx={{ backgroundColor: 'white', margin:"16px", paddingRight:"16px"}} />
    ) : (
      <div className="bg-white  lg:mt-1 mt-2  ml-4 mr-2 pt-2 pb-1 pr-7 pl-7 rounded-lg shadow">

    <div className=" lg:flex-row flex-col  flex  w-full  lg:items-start items-center lg:justify-evenly ">
  <div
    className="relative mt-4 w-48 h-48 lg:w-60 lg:h-60 lg:top-14 rounded-full border border-gray-400 cursor-pointer "
    style={{ padding: "6.18px" }}
  >
    
    <img
      src={image}
      alt="profile"
      className="w-full h-full rounded-full object-cover"
      
    />
    <img src="/tabler_edit.svg" 
    alt="edit"
    onClick={() => document.getElementById("imageUpload").click()} 
   className="absolute bottom-3 right-8  lg:w-10 lg:h-10 w-7 h-7 cursor-pointer z-10"
    />
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      style={{ display: "none" }}
      id="imageUpload"
    />
   
  </div>
    <div className='relative w-full lg:w-auto  pl-4 lg:pl-8 mt-4'>
    <h2 className="text-[#000000] text-xl mt-5 font-semibold">Personal Details</h2>

    <form className='lg:mt-10 mt-8 flex flex-col gap-6 lg:gap-10'>
      <div className='flex lg:flex-row flex-col gap-5'>
      <div className='flex flex-col gap-2'>
      <label htmlFor="firstName" className='font-semibold text-sm'>First Name</label>
      <input type="text"
      id='firstName'
      className='border border-gray-400 rounded-[4px] px-2 focus:outline-none' />
      </div>
      <div className='flex flex-col gap-2'>
      <label htmlFor="lastName" className='font-semibold text-sm'>Last Name</label>
      <input type="text"
      id='lastName'
      className='border border-gray-400 rounded-[4px] px-2 focus:outline-none' />
      </div>
      </div>

      
      <div className='flex flex-col gap-2'>
      <label htmlFor="email" className='font-semibold text-sm'>E-mail</label>
      <input type="text"
      id='email'
      className='border border-gray-400 rounded-[4px] px-2 focus:outline-none' />
      </div>
      
      <h2 className="text-[#000000] text-xl  font-semibold">Account Details</h2>
      <div className='flex flex-col gap-2'>
      <label htmlFor="accountNumber" className='font-semibold text-sm'>Account Number</label>
      <input type="text"
      id='accountNumber'
      className='border border-gray-400 rounded-[4px] px-2 focus:outline-none' />
      </div>

      <div className='flex lg:justify-end justify-center'>
        
      <button 
      type='submit'
      className='mt-2 mb-6 w-[195px] rounded-2xl text-white font-semibold  p-1 bg-[#3F4870]'>
        Save Changes
      </button>

      </div>

    </form>
    </div>
</div>

    
      </div>
    )};
    </section>
  );
};

export default MProfile