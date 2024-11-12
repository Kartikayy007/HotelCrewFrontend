import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function Preloading() {
  const preloadingRef = useRef(null);
  const spansRef = useRef([]);
  const spansRef1 = useRef([]); 

  useEffect(() => {
    gsap.fromTo(preloadingRef.current, { top: '0' }, { top: '100vh', duration: 2, delay: 2.3, ease: 'power3.inOut' })
    const timeline = gsap.timeline();
    timeline
      .fromTo(spansRef.current, { opacity: 1, y: 145 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.5 })
      .fromTo(spansRef1.current, { opacity: 1, y: 190 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1}); 
  }, []);

  return (
    <div ref={preloadingRef} className='bg-[#5D69F8] z-50 fixed h-screen w-screen flex flex-col justify-end'>
      <div className='flex overflow-hidden h-28 md:h-56'>
        {['H', 'O', 'T', 'E', 'L'].map((letter, index) => (
          <span key={index} ref={el => spansRef.current[index] = el} className='text-[#252941] text-[100px] md:text-[200px] font-semibold'>
            {letter}
          </span>
        ))}
      </div>
      <div className='relative flex h-36 md:h-72 -top-10 md:-top-20 overflow-hidden'>
        {['C', 'R', 'E', 'W'].map((letter, index) => (
          <span key={index + 5} ref={el => spansRef1.current[index] = el} className='text-white text-[125px] md:text-[250px] font-semibold'>
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Preloading;