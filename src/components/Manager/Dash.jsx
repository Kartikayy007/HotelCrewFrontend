import React from 'react'
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Dash = () => {
  return (
    <section className='font-Montserrat lg:min-h-screen lg:w-full overflow-hidden '>
      {/* <div class="bg-gradient-to-r from-[#efefef] to-[#8094D4] h-screen flex"> */}
      <div className='h-screen flex bg-[#e6eef9]'>
        <div className='lg:w-[17.5%] min-w-[253px] bg-[#252941]'>
          <div className='h-[30%] flex flex-col justify-center items-center text-[20px] text-[#e6eef9]'>
            <div
              className="w-[107px] h-[107px] rounded-full overflow-hidden flex items-center justify-center"
            >
              <img
                src="/profile.png"
                alt="circle image"
                className="w-full h-full object-cover"
              />
              </div>
              User Name
            
          </div>
          <div className='h-[70%] bottom-0 flex flex-col text-[#e6eef9] justify-evenly text-[16px]'>
            <Link
              to='#'
            // className="text-[#e6eef9]"
            ><div className='flex flex-row '>
                <img
                  src="/mdash.svg"
                  alt="dash"
                  className='pl-9 pr-9' />
                Dashboard
              </div>
            </Link>
            <Link
              to='#'
            // className="text-[#e6eef9] "
            >
              <div className='flex flex-row'>
                <img
                  src="/mschedule.svg"
                  alt="dash"
                  className='pl-9 pr-9' />
                Schedule Status
              </div>
            </Link>
            <Link
              to='#'
            // className="text-[#e6eef9] "
            >
              <div className='flex flex-row'>
                <img
                  src="/mdatabase.svg"
                  alt="dash"
                  className='pl-9 pr-9' />
                Database
              </div>
            </Link>
            <Link
              to='#'
            // className="text-[#e6eef9] "
            >
              <div className='flex flex-row'>
                <img
                  src="/mstaff.svg"
                  alt="dash"
                  className='pl-9 pr-9' />
                Staff Performance
              </div>
            </Link>
            <Link
              to='#'
            // className="text-[#e6eef9] "
            >
              <div className='flex flex-row'>
                <img
                  src="/mexpense.svg"
                  alt="dash"
                  className='pl-9 pr-9' />
                Expense  Tracking
              </div>
            </Link>
            <Link
              to="#"
            >
              <div className='flex flex-row'>
                <img
                  src="/msettigs.svg"
                  alt="dash"
                  className='pl-9 pr-9' />
                Settings
              </div>
            </Link>
          </div>
        </div>
        <div>
          Dashboard
        </div>
      </div>
    </section>
  )
}

export default Dash;