import React, { useState } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { FiArrowRight, FiMail, FiMapPin } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import {  SiGmail, SiInstagram,  SiLinkedin, SiYoutube } from "react-icons/si";

export const RevealBento = () => {
  return (
        <div className="min-h-screen w-full  px-12 py-12 text-zinc-50 fixed z-50 backdrop-filter backdrop-blur-md bg-white/5">
      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        className="mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4"
      >
        <HeaderBlock />
        <SocialsBlock />
        <EmailListBlock />
      </motion.div>
    </div>
  );
};

const Block = ({ className, ...rest }) => {
  return (
    <motion.div
      variants={{
        initial: {
          scale: 0.5,
          y: 50,
          opacity: 0,
        },
        animate: {
          scale: 1,
          y: 0,
          opacity: 1,
        },
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
      className={twMerge(
        "col-span-4 rounded-lg border text-black p-6",
        className
      )}
      {...rest}
    />
  );
};

const HeaderBlock = () => {
  const navigate = useNavigate();

  return (
    <Block className="col-span-12 row-span-2 md:col-span-6 bg-white shadow-lg">
      <img src="/hotelcrewlogo.svg" alt="" />
      <span></span>
      <h1 className="mb-12 text-4xl font-medium leading-tight text-zinc-900">
      Please
         <span className="text-zinc-500"> Register</span> .{" "}
        <span className="text-zinc-900">
          your Hotel details to Continue.
        </span>
      </h1>
      <button
        onClick={() => navigate('/signup/hoteldetails')}
        className="flex items-center gap-1 text-black hover:underline"
      >
        Register Hotel <FiArrowRight />
      </button>
    </Block>
  );
};

const SocialsBlock = () => (
  <>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-red-500 md:col-span-3 shadow-lg"
    >
      <a
        href="https://youtube.com/@kartikay7289?si=gD2GbzjnYR36hqXx"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <SiYoutube />
      </a>
    </Block>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-purple-500 md:col-span-3 shadow-lg"
    >
      <a
        href="https://www.instagram.com/hotel.crew?igsh=bms4Ym5ybnBkZGN0"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <SiInstagram />
      </a>
    </Block>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-[#FBBC04] md:col-span-3 shadow-lg"
    >
      <a
        href="mailto:hotelcrew.noreply@gmail.com"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <SiGmail />
      </a>
    </Block>
    <Block
      whileHover={{
        rotate: "2.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-blue-600 md:col-span-3 shadow-lg"
    >
      <a
        href="#"
        className="grid h-full place-content-center text-3xl text-white"
      >
        <SiLinkedin />
      </a>
    </Block>
  </>
);

const EmailListBlock = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Open default mail client
    window.location.href = `mailto:Hotelcrew@gmail.com?subject=Contact Request&body=From: ${email}`;
    
    // Clear form
    setEmail('');
  };

  return (
    <Block className=" col-span-full bg-white shadow-lg ">
      <p className="mb-3 text-lg">Have any query?</p>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full rounded border border-zinc-700 bg-white px-3 py-1.5 transition-colors focus:border-red-300 focus:outline-0"
          required
        />
        <button
          type="submit"
          className="flex items-center gap-2 whitespace-nowrap rounded bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-300"
        >
          <FiMail /> contact us
        </button>
      </form>
    </Block>
  );
};
