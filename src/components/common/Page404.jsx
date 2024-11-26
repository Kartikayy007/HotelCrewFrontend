import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

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
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden relative"
      style={{
        backgroundColor: 'white',
        color: '#8094D4'
      }}
    >
      <div className="relative text-center">
       

        <h1
          className="text-[20vw] font-black text-[#5C69F8]/20 leading-none relative select-none"
        >
          404
        </h1>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <div className="marquee-container bottom-marquee whitespace-nowrap text-xl font-bold text-[#5C69F8]/50">
            <div className="marquee-content">
              <span className="mx-4">PAGE NOT FOUND</span>
              <span className="mx-4">PAGE NOT FOUND</span>
              <span className="mx-4">PAGE NOT FOUND</span>
              <span className="mx-4">PAGE NOT FOUND</span>
              <span className="mx-4">PAGE NOT FOUND</span>
              <span className="mx-4">PAGE NOT FOUND</span>
            </div>
            {/* Clone for continuous animation */}
            <div className="marquee-content" aria-hidden="true">
              <span className="mx-4">PAGE NOT FOUND</span>
              <span className="mx-4">PAGE NOT FOUND</span>
              <span className="mx-4">PAGE NOT FOUND</span>
              <span className="mx-4">PAGE NOT FOUND</span>
              <span className="mx-4">PAGE NOT FOUND</span>
              <span className="mx-4">PAGE NOT FOUND</span>
            </div>
          </div>
        </div>
      </div>

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
        <button
          onClick={handleButtonClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            bg-[#5C69F8] text-white px-6 py-3 rounded-full
            flex items-center cursor-pointer gap-2
            transform transition-all duration-300
            ${isHovered ? 'scale-110 shadow-2xl' : 'scale-100 shadow-lg'}
            active:scale-95
          `}
        >
          Return Home
        </button>
      </div>

      <style>{`
        .marquee-container {
          display: flex;
          overflow: hidden;
          position: relative;
        }

        .marquee-content {
          display: flex;
          animation: marquee 20s linear infinite;
          padding-left: 100%;
        }

        .marquee-content-reverse {
          display: flex;
          animation: marquee-reverse 20s linear infinite;
          padding-right: 100%;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes marquee-reverse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        }
      `}</style>
    </div>
  );
};

export default Page404;