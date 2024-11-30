import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import ClipPathLinks from './ClipPathLinks';

const Page404 = () => {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      gsap.to(buttonRef.current, {
        x: e.clientX - 75,
        y: e.clientY - 25,
        duration: 0.2,
        ease: 'power1.out'
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleButtonClick = () => {
    window.location.href = '/'; 
  };

  return (
    <div >
      
        <ClipPathLinks />

      <div
        ref={buttonRef}
        className="fixed"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50
        }}
      >
        {/* <button
          onClick={handleButtonClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`bg-[#5C69F8] text-white px-6 py-3 rounded-full flex items-center cursor-pointer gap-2 transform transition-all duration-300 ${isHovered ? 'scale-110 shadow-2xl' : 'scale-100 shadow-lg'} active:scale-95`}
        >
          Return Home
        </button> */}
      </div>
    </div>
  );
};

export default Page404;