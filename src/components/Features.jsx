import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const [button, setbutton] = useState('And more...');
  const navigate = useNavigate();


  return (
    <section className="mx-auto mt-32 max-w-screen-2xl px-4 py-12 text-slate-800 font-Montserrat">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end md:px-8">
        <h2 className="max-w-lg text-4xl font-bold md:text-5xl">
          Grow your Hotel faster with our
          <span className="text-slate-400"> Exceptional Services</span>
        </h2>
        <button className="px-6 py-2 font-medium rounded bg-[#5663AC] text-white transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] w-36 h-12"
        onMouseEnter={() => setbutton('Sign Up')}
        onMouseLeave={() => setbutton('And more...')}
        onClick={() => navigate('/signup')}>
              {button}
            </button>
      </div>
      <div className="mb-4 grid grid-cols-12 gap-4">
        <BounceCard className="col-span-12 md:col-span-4">
          <CardTitle>Timely Salary Rollout</CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-violet-400 to-indigo-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-indigo-50">
            Roll out salaries on time with our automated payroll system, ensuring accuracy, reducing errors, and keeping staff satisfied.
            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-8">
          <CardTitle>Effortless staff management:
          </CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-amber-400 to-orange-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-orange-50">
            Effortlessly add, update, or remove staff members to streamline every aspect of staff management, from onboarding and role assignment to daily task tracking and performance reviews. Our system ensures a smooth, organized process for managing personnel changes, reducing administrative burden, and allowing managers to focus on optimizing hotel operations and improving guest experiences.
            </span>
          </div>
        </BounceCard>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <BounceCard className="col-span-12 md:col-span-8">
          <CardTitle>Seamless  Attendance Tracking</CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-green-400 to-emerald-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-emerald-50">
            Easily monitor employee attendance with our intuitive attendance tracking system, designed to provide real-time insights into staff availability, punctuality, and shift adherence. With automated logging and detailed reports, managing attendance becomes seamless, helping you maintain efficiency, reduce absenteeism, and optimize scheduling to ensure smooth hotel operations.

            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-4">
          <CardTitle></CardTitle>
          <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-pink-400 to-red-400 p-4 transition-transform duration-[250ms] group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-red-50">
              
            </span>
          </div>
        </BounceCard>
      </div>
    </section>
  );
};

const BounceCard = ({ className, children }) => {
  return (
    <motion.div
      whileHover={{ scale: 0.95, rotate: "-1deg" }}
      className={`group relative min-h-[300px]  overflow-hidden rounded-2xl bg-slate-100 p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const CardTitle = ({ children }) => {
  return (
    <h3 className="mx-auto text-center text-3xl font-semibold">{children}</h3>
  );
};

export default Features;