import React from "react";
import { useAnimate } from "framer-motion";
import HotelCrewLogo from '/hotelcrewlogo.svg';

const ClipPathLinks = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4 sm:space-y-8">
      <img 
        src={HotelCrewLogo} 
        alt="Hotel Crew Logo" 
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-4 sm:mb-8" 
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-4xl divide-x divide-neutral-900 border border-neutral-900">
        <LinkBox text="404" href="#" />
        <LinkBox text="PAGE" href="#" />
        <LinkBox text="NOT" href="#" className="border-t sm:border-t-0" />
        <LinkBox text="FOUND" href="#" className="border-t sm:border-t-0" />
      </div>
    </div>
  );
};

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE_KEYFRAMES = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

const LinkBox = ({ text, href, className = "" }) => {
  const [scope, animate] = useAnimate();

  const getNearestSide = (e) => {
    const box = e.target.getBoundingClientRect();

    const proximityToLeft = {
      proximity: Math.abs(box.left - e.clientX),
      side: "left",
    };
    const proximityToRight = {
      proximity: Math.abs(box.right - e.clientX),
      side: "right",
    };
    const proximityToTop = {
      proximity: Math.abs(box.top - e.clientY),
      side: "top",
    };
    const proximityToBottom = {
      proximity: Math.abs(box.bottom - e.clientY),
      side: "bottom",
    };

    const sortedProximity = [
      proximityToLeft,
      proximityToRight,
      proximityToTop,
      proximityToBottom,
    ].sort((a, b) => a.proximity - b.proximity);

    return sortedProximity[0].side;
  };

  const handleMouseEnter = (e) => {
    const side = getNearestSide(e);

    animate(scope.current, {
      clipPath: ENTRANCE_KEYFRAMES[side],
    });
  };

  const handleMouseLeave = (e) => {
    const side = getNearestSide(e);

    animate(scope.current, {
      clipPath: EXIT_KEYFRAMES[side],
    });
  };

  return (
    <a
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative grid w-full place-content-center h-24 sm:h-28 md:h-36 p-2 sm:p-4 ${className}`}
    >
      <span className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#5D69F8]">
        {text}
      </span>

      <div
        ref={scope}
        style={{
          clipPath: BOTTOM_RIGHT_CLIP,
        }}
        className="absolute inset-0 grid h-full place-content-center bg-[#252941] text-white"
      >
        <span className="text-3xl sm:text-4xl md:text-6xl font-bold text-white">
          {text}
        </span>
      </div>
    </a>
  );
};

export default ClipPathLinks;