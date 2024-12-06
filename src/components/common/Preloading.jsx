import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

function Preloading() {
  const preloadingRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      top: '100vh',
      transition: { duration: 2, delay: 2.3, ease: 'easeInOut' }
    });

    controls.start(i => ({
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, delay: i * 0.1 }
    }));
  }, [controls]);

  return (
    <motion.div
      ref={preloadingRef}
      className='bg-[#5D69F8] z-50 fixed h-screen w-screen flex flex-col justify-end'
      initial={{ top: '0' }}
      animate={controls}
    >
      <div className='flex overflow-hidden h-28 md:h-56'>
        {['H', 'O', 'T', 'E', 'L'].map((letter, index) => (
          <motion.span
            key={index}
            custom={index}
            initial={{ y: 145, opacity: 1 }}
            animate={controls}
            className='text-[#252941] text-[100px] md:text-[200px] font-semibold'
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <div className='relative flex h-36 md:h-72 -top-10 md:-top-20 overflow-hidden'>
        {['C', 'R', 'E', 'W'].map((letter, index) => (
          <motion.span
            key={index + 5}
            custom={index + 5}
            initial={{ y: 190, opacity: 1 }}
            animate={controls}
            className='text-white text-[125px] md:text-[250px] font-semibold'
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default Preloading;