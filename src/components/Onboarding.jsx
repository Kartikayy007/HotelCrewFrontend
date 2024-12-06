import {useState, useEffect} from "react";
import Features from "./Features";
import RevealLinks from "./RevealLinks";
import {Link} from "react-router-dom";
import {Menu, X} from "lucide-react";
import Preloading from "./common/Preloading";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import FloatingPhone from "./common/FloatingPhone";
import { Helmet } from 'react-helmet-async';

gsap.registerPlugin(ScrollTrigger);

const Onboarding = () => {
  const [rangeValue, setRangeValue] = useState(50);
  const [visibleProfiles, setVisibleProfiles] = useState(2);  

  useEffect(() => {
    if (rangeValue <= 50) {
      setVisibleProfiles(2);
    } else if (rangeValue <= 100) {
      setVisibleProfiles(3);
    } else if (rangeValue <= 200) {
      setVisibleProfiles(4);
    } else if (rangeValue <= 300) {
      setVisibleProfiles(5);
    } else {
      setVisibleProfiles(6);
    }
  }, [rangeValue]);

  const handleRangeChange = (event) => {
    setRangeValue(Number(event.target.value));
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    gsap.fromTo(
      ".animate-on-scroll",
      { y: 200, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: ".animate-on-scroll",
          start: "top 130%",
          end: "top 90%",
          scrub: 2,
        },
      }
    );

    gsap.fromTo(
      ".animate-on-scroll1",
      { y: 200, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: ".animate-on-scroll1",
          start: "top 130%",
          end: "top 90%",
          scrub: 2,
        },
      }
    );

    gsap.fromTo(
      ".animation3",
      { y: 100, opacity: 0.5 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: ".animation3",
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        }
      }
    )

    gsap.to(".parallax", {
      y: -50, 
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax",
        start: "top 75%", 
        end: "top 30%", 
        scrub: 1,
      },
    });
  }, []);


  return (
    <>
      <Helmet>
        <title>Hotel Registration | HotelCrew</title>
        <meta name="description" content="Complete your hotel registration process. Register your hotel details, set up your account, and get started with HotelCrew's hotel management system." />
        <meta name="keywords" content="hotel registration, hotel management system, hotelcrew, hotel setup, hotel onboarding" />
        
        <meta property="og:title" content="Hotel Registration | HotelCrew" />
        <meta property="og:description" content="Complete your hotel registration process and get started with HotelCrew's hotel management system." />
        <meta property="og:type" content="website" />
        
        <link rel="canonical" href={window.location.href} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Preloading />
      <div className="font-Montserrat backdrop-blur-xl bg-white bg-opacity-75">
        <nav className="font-bold text-xl backdrop-blur-xl bg-white bg-opacity-75 sticky top-0 z-50">
          <div className="max-w-full mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex items-center px-4 py-4 lg:px-8">
                  <Link to="/">
                    <img
                      className="w-32 lg:w-40 cursor-pointer"
                      src="/hotelcrewlogosmall.svg"
                      alt="HotelCrew Logo"
                    />
                  </Link>
                </div>

                <div className="hidden md:flex space-x-8 lg:space-x-12 px-4 lg:px-8">
                  <Link
                    to="/"
                    className="cursor-pointer hover:text-[#5663AC] transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/#features"
                    className="cursor-pointer hover:text-[#5663AC] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Features
                  </Link>
                  <Link
                    to="/#contact"
                    className="cursor-pointer hover:text-[#5663AC] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Contact
                  </Link>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-6 lg:space-x-8 px-4 lg:px-8">
                <Link
                  to="/login"
                  className="cursor-pointer hover:text-[#5663AC] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 font-medium rounded bg-[#5663AC] text-white transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>

              <div className="md:hidden flex items-center px-4">
                <button
                  onClick={toggleMenu}
                  className="text-gray-700 hover:text-[#5663AC] transition-colors"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            <div
              className={`${
                isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
              } md:hidden backdrop-blur-xl border-t transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col px-4 py-2 space-y-2">
                <Link
                  to="/"
                  className="py-2 hover:text-[#5663AC] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/#services"
                  className="py-2 hover:text-[#5663AC] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link
                  to="/#about"
                  className="py-2 hover:text-[#5663AC] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/login"
                  className="py-2 hover:text-[#5663AC] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-block px-6 py-2 font-medium rounded bg-[#5663AC] text-white transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] text-center mb-2  w-[10.3rem]"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <section>
          <div className="relative min-h-screen overflow-hidden">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="text-center w-full sm:w-4/5 lg:w-2/3 mx-auto mt-8 sm:mt-10 lg:mt-12 space-y-6 sm:space-y-8 lg:space-y-12 max-w-4xl">
                <div className="space-y-2 sm:space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold leading-tight">
                    Welcome to HotelCrew!
                  </h1>
                  <h2 className="text-2xl sm:text-3xl lg:text-[35px] font-semibold text-[#3D3D3D] leading-tight">
                    Streamline Your Hotel Operations Today!
                  </h2>
                </div>

                <p className="text-base sm:text-lg lg:text-[22px] text-[#464646] leading-relaxed px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                  HotelCrew is an all-in-one hotel management platform designed
                  to streamline operations, enhance team communication, and
                  elevate guest experiences. With dedicated dashboards for
                  admins, managers, and staff, it simplifies employee
                  management, task coordination, and performance tracking. Join
                  HotelCrew to create a seamless, memorable experience for
                  guests and staff alike.
                </p>

                <div className="flex justify-center items-center gap-8 sm:gap-16 lg:gap-44 pt-4">
                  <Link
                    to="/login"
                    className="px-8 py-3 font-semibold rounded bg-[#5663AC] text-white transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] min-w-[128px] z-10 flex items-center justify-center w-64 h-14 lg:text-2xl text-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-8 py-3 font-semibold rounded bg-[#5663AC] text-white transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] min-w-[128px] w-64 h-14 z-10 flex items-center justify-center lg:text-2xl text-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative parallax">
              <img
                src="/Mask group.svg"
                alt="Hotel Staff Illustration"
                class="w-full md:w-4/5 lg:w-[90%] mt-10"
              />
            </div>
          </div>

          <div className="bg-[#5C69F8] m-4 md:m-12 lg:m-24 rounded-2xl min-h-[80vh] flex items-center animate-on-scroll">
            <div className="flex flex-col lg:flex-row justify-center items-center w-full gap-8 lg:gap-16 py-8 lg:py-0">
              <div className="w-full lg:w-1/2 px-6 lg:px-8 xl:px-16 flex flex-col justify-center ">
                <div>
                  <h1 className="text-white text-3xl md:text-4xl lg:text-[44.9px] font-bold lg:w-full">
                    Transform your Hotel regardless of your{" "}
                    <span className="text-[#252941]">Hotel size</span> or{" "}
                    <span className="text-[#252941]">Type</span>
                  </h1>
                  <br />
                  <p className="text-white text-xl">
                    Elevate your hotel experience with a solution that adapts
                    seamlessly to any hotel size or type, driving efficiency and
                    excellence across your operations.
                  </p>
                </div>
                <div className="mt-8 lg:mt-56 mb-4">
                  <input
                    type="range"
                    className="w-full lg:w-2/3 cursor-pointer"
                    min="1"
                    max="500"
                    value={rangeValue}
                    onChange={handleRangeChange}
                    style={{accentColor: "#051733"}}
                  />
                  <br />
                  <label className="text-white text-2xl md:text-3xl lg:text-[40px] font-bold">
                    {rangeValue === 500 ? "0-500+" : `0-${rangeValue}`}
                  </label>
                  <br />
                  <p className="text-white text-xl md:text-2xl lg:text-[30px] font-semibold">
                    Staff
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="relative w-full max-w-lg">
                  <img
                    src="/profile1.svg"
                    alt="Profile 1"
                    className={`absolute w-12 md:w-16 h-12 md:h-16 left-[10%] top-[35%] z-10 animate-[float1_3s_ease-in-out_infinite] transition-opacity duration-500 ${
                      visibleProfiles >= 1 ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <img
                    src="/profile2.svg"
                    alt="Profile 2"
                    className={`absolute w-12 md:w-16 h-12 md:h-16 left-[25%] top-[10%] z-10 animate-[float2_3s_ease-in-out_infinite_0.5s] transition-opacity duration-500 ${
                      visibleProfiles >= 6 ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <img
                    src="/profile3.svg"
                    alt="Profile 3"
                    className={`absolute w-12 md:w-16 h-12 md:h-16 right-[10%] top-[17%] z-10 animate-[float3_3s_ease-in-out_infinite_1s] transition-opacity duration-500 ${
                      visibleProfiles >= 3 ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <img
                    src="/profile4.svg"
                    alt="Profile 4"
                    className={`absolute w-12 md:w-16 h-12 md:h-16 right-[15%] bottom-[45%] z-10 animate-[float4_3s_ease-in-out_infinite_1.5s] transition-opacity duration-500 ${
                      visibleProfiles >= 2 ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <img
                    src="/profile7.svg"
                    alt="Profile 7"
                    className={`absolute w-12 md:w-16 h-12 md:h-16 left-[20%] bottom-[20%] z-10 animate-[float5_3s_ease-in-out_infinite_2s] transition-opacity duration-500 ${
                      visibleProfiles >= 5 ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <img
                    src="/profile6.svg"
                    alt="Profile 6"
                    className={`absolute w-12 md:w-16 h-12 md:h-16 left-[65%] bottom-[15%] z-10 animate-[float1_3s_ease-in-out_infinite_2.5s] transition-opacity duration-500 ${
                      visibleProfiles >= 6 ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <img
                    src="/hotelbuilding.svg"
                    alt="Hotel building"
                    className="w-full h-full p-6"
                  />

                  <div className="relative top-6 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#252941]">
                      Perfect
                    </h1>
                    <p className="text-lg md:text-xl font-semibold mt-5 text-white">
                      Management for your growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <style>
              {`
          @keyframes float1 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes float2 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes float3 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          @keyframes float4 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-9px); }
          }
          @keyframes float5 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-11px); }
          }
        `}
            </style>
          </div>

          <Features />

          <div>
            <div className="bg-[#252941] mx-4 md:mx-12 lg:m-24 rounded-2xl min-h-[450px] lg:h-[650px] animate-on-scroll1">
              <div className="flex flex-col lg:flex-row justify-evenly items-center h-full py-8 lg:py-0 px-6 lg:px-0">
                <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:ml-12">
                  <div className="space-y-6 lg:space-y-12">
                    <h1 className="text-white text-3xl md:text-4xl lg:text-[44.7px] font-bold lg:w-2/3">
                      Optimize managing hotel operations
                    </h1>
                    <p className="text-white text-sm md:text-base lg:text-normal lg:w-5/6">
                      Efficiently oversee and streamline all hotel operations
                      with our comprehensive system focused on staff management.
                      Our platform enables smooth coordination across
                      departments, ensuring every task is handled with precision
                      and timeliness thereby enhancing the guest experience and
                      optimizing operational efficiency.
                    </p>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 flex justify-center lg:mr-12">
                  <img
                    src="/optimse.svg"
                    alt="Optimize operations illustration"
                    className="w-full max-w-md lg:max-w-full h-96"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#252941] mx-4 md:mx-12 lg:m-24 rounded-2xl min-h-[450px] lg:h-[650px] animate-on-scroll1">
  <iframe
    width="100%"
    height="100%"
    src="https://www.youtube.com/embed/ldk7CG7oMRU"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    className="rounded-2xl"
  ></iframe>
</div>

          <div className="p-1">
            <div className="bg-[#E2E3FF] mx-4 md:mx-12 lg:m-24 rounded-2xl min-h-[300px] lg:h-[403px] mt-8 lg:mt-32">
              <div className="flex flex-col lg:flex-row justify-around items-center h-full py-8 lg:py-0 px-6 lg:px-0">
                <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:ml-40">
                  <div className="space-y-3 lg:space-y-3">
                    <h1 className="text-black text-3xl md:text-4xl lg:text-[44.7px] font-bold lg:w-2/3">
                      Comprehensive mobile app
                    </h1>
                    <p className="text-black text-sm md:text-base lg:text-normal w-full lg:w-96">
                      Simplify hotel operations with our mobile app, built to
                      unify team efforts while optimizing overall efficiency
                      across departments.
                    </p>
                    <div className="flex justify-start ">
                      <img
                        src="/playstore.svg"
                        alt="Play Store download"
                        className="h-auto w-32 md:w-auto cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-96 flex justify-center lg:justify-end lg:mr-40 animation3">
        <FloatingPhone />
      </div>
              </div>
            </div>
          </div>

          <footer>
            <div className="bg-[#47518C] text-white py-8">
              <div className="container mx-auto flex-col justify-center items-center text-center">
                <img
                  src="/logowhite.svg"
                  alt="HotelCrew Logo"
                  className="w-40 mx-auto"
                />
                <RevealLinks />
                <p className="mt-4">©️ 2024 HotelCrew. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </>
  );
};

export default Onboarding;