import React, { useEffect,useState } from 'react'
import { Skeleton } from '@mui/material'


const SProfile = ()=>{
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
  }, 500); 
}, []);
  return (
    <section className=" h-screen py-2 mr-1 px-0 font-Montserrat">
      <div className='h-[10%] bg-[#e6efe9] opacity-100  top-3'>
      <h2 className="text-[#252941] text-3xl  my-3 pl-12 ml-5 font-semibold">Profile</h2>
      </div>
      {loading ? (
      <Skeleton variant="rectangular" width="100%" height="85%" sx={{ backgroundColor: 'white', margin:"16px", paddingRight:"16px"}} />
    ) : (
      <div className="bg-white z-10  h-auto xl:mt-1 mt-2  mx-4 pt-2 pb-1 px-7 rounded-lg shadow">

    <div className=" xl:flex-row flex-col  flex  w-full  xl:items-start items-center xl:justify-evenly ">
  <div
    className="relative mt-4 mb-4 md:mb-10 w-48 h-48 lg:w-[320px] lg:h-[320px] lg:top-14 rounded-full border border-gray-400 cursor-pointer "
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
    <div className='relative w-full lg:w-auto  px-3 xl:px-8 mt-4'>
    <h2 className="text-[#000000] text-2xl mt-5 font-semibold">Personal Details</h2>

    <form className='lg:mt-10 mt-8 flex flex-col gap-6 lg:gap-10'>
      <div className='flex lg:flex-row flex-col gap-5'>
      <div className='flex flex-col gap-2'>
      <label htmlFor="firstName" className='font-semibold text-lg'>First Name</label>
      <input type="text"
      id='firstName'
      className='border border-gray-400 rounded-[4px] px-2 text-lg focus:outline-none' />
      </div>
      <div className='flex flex-col gap-2'>
      <label htmlFor="lastName" className='font-semibold text-lg'>Last Name</label>
      <input type="text"
      id='lastName'
      className='border border-gray-400 rounded-[4px] px-2  text-lg focus:outline-none' />
      </div>
      </div>

      
      <div className='flex flex-col gap-2'>
      <label htmlFor="email" className='font-semibold text-lg'>E-mail</label>
      <input type="text"
      id='email'
      className='border border-gray-400 rounded-[4px]  text-lg px-2 focus:outline-none' />
      </div>
      
      <h2 className="text-[#000000] text-2xl  font-semibold">Account Details</h2>
      <div className='flex flex-col gap-2'>
      <label htmlFor="accountNumber" className='font-semibold text-lg'>UPI ID:</label>
      <input type="text"
      id='upiid'
      className='border border-gray-400  text-lg rounded-[4px] px-2 focus:outline-none' />
      </div>

      <div className='flex lg:justify-end justify-center'>
        
      <button 
      type='submit'
      className='xl:mt-10 xl:mb-10 mb-5 w-[195px] rounded-2xl text-lg text-white font-semibold  py-2 bg-[#3F4870]'>
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

export default SProfile;