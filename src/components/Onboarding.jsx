import {useState, useEffect} from "react";
import Features from "./Features";
import RevealLinks from "./RevealLinks";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [rangeValue, setRangeValue] = useState(50);
  const [visibleProfiles, setVisibleProfiles] = useState(2);
  const navigate = useNavigate();

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
    setRangeValue(event.target.value);
  };

  return (
    <page className="font-Montserrat backdrop-blur-lg bg-white bg-opacity-75">
      <nav className="flex justify-between items-center font-bold text-xl backdrop:blur-xl bg-white bg-opacity-75 sticky top-0 z-50">
        <ul className="flex gap-24 items-center px-24 py-4">
          <li>
            <a href="#home">
              <img
                className="w-40 cursor-pointer"
                src="/hotelcrewlogosmall.svg"
              />
            </a>
          </li>
          <li>
            <a href="#about" className="cursor-pointer">
              Home
            </a>
          </li>
          <li>
            <a href="#services" className="cursor-pointer">
              Features
            </a>
          </li>
          <li>
            <a href="#contact" className="cursor-pointer">
              About
            </a>
          </li>
        </ul>
        <ul className="flex justify-evenly items-center gap-20 px-24 py-4">
          <li>
            <button className="cursor-pointer" onClick={() => navigate('/login')}>Login</button>
          </li>
          <li>
            <button className="px-6 py-2 font-medium rounded bg-[#5663AC] text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]" >
              Get Started
            </button>
          </li>
        </ul>
      </nav>

      <section>
        <div className="flex justify-center">
          <div className="text-center w-1/2 mt-12 space-y-12">
            <div>
              <h1 className="text-[64px] font-bold">Welcome to HotelCrew!</h1>
              <h2 className="text-[35px] font-semibold text-[#3D3D3D]">
                Streamline Your Hotel Operations Today!
              </h2>
            </div>

            <p className="text-[22px] text-[#464646]">
              HotelCrew is an all-in-one hotel management platform designed to
              streamline operations, enhance team communication, and elevate
              guest experiences. With dedicated dashboards for admins, managers,
              and staff, it simplifies employee management, task coordination,
              and performance tracking. Join HotelCrew to create a seamless,
              memorable experience for guests and staff alike.
            </p>
            <div className="flex justify-evenly items-center">
              <button className="px-6 py-2 font-medium rounded bg-[#5663AC] text-white transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] w-32 h-12 z-10" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="px-6 py-2 font-medium rounded bg-[#5663AC] text-white transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] w-32 h-12 z-10" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          </div>
        </div>

        <div>
          <img src="/hero2.svg" alt="" className="w-[90%] -mt-48" />
        </div>

        <div className="bg-[#5C69F8] m-24 rounded-2xl h-[80vh]">
          <div className="flex justify-evenly items-center h-full">
            <div className="w-1/2">
              <div>
                <h1 className="text-white text-[44.7px] font-bold w-2/3">
                  Transform your Hotel regardless of your{" "}
                  <span className="text-[#252941]">Hotel size</span> or{" "}
                  <span className="text-[#252941]">Type</span>
                </h1>
              </div>
              <div className="mt-56 mb-4">
                <input
                  type="range"
                  className="w-2/3 cursor-pointer [&::-webkit-slider-thumb]:hover"
                  min="1"
                  max="500"
                  value={rangeValue}
                  onChange={handleRangeChange}
                  style={{accentColor: "#051733"}}
                />
                <br />
                <label htmlFor="" className="text-white text-[40px] font-bold">
                  {rangeValue === "500" ? "0-500+" : `0-${rangeValue}`}
                </label>
                <br />
                <p className="text-white text-[30px] font-semibold">Staff</p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/profile1.svg"
                alt=""
                className={`absolute w-16 h-16 left-[10%] top-[35%] z-10 animate-[float1_3s_ease-in-out_infinite] transition-opacity duration-500 ${
                  visibleProfiles >= 1 ? "opacity-100" : "opacity-0"
                }`}
              />
              <img
                src="/profile2.svg"
                alt=""
                className={`absolute w-16 h-16 left-[25%] top-[10%] z-10 animate-[float2_3s_ease-in-out_infinite_0.5s] transition-opacity duration-500 ${
                  visibleProfiles >= 6 ? "opacity-100" : "opacity-0"
                }`}
              />
              <img
                src="/profile3.svg"
                alt=""
                className={`absolute w-16 h-16 right-[10%] top-[17%] z-10 animate-[float3_3s_ease-in-out_infinite_1s] transition-opacity duration-500 ${
                  visibleProfiles >= 3 ? "opacity-100" : "opacity-0"
                }`}
              />
              <img
                src="/profile4.svg"
                alt=""
                className={`absolute w-16 h-16 right-[15%] bottom-[45%] z-10 animate-[float4_3s_ease-in-out_infinite_1.5s] transition-opacity duration-500 ${
                  visibleProfiles >= 2 ? "opacity-100" : "opacity-0"
                }`}
              />
              <img
                src="/profile7.svg"
                alt=""
                className={`absolute w-16 h-16 left-[20%] bottom-[20%] z-10 animate-[float5_3s_ease-in-out_infinite_2s] transition-opacity duration-500 ${
                  visibleProfiles >= 5 ? "opacity-100" : "opacity-0"
                }`}
              />

              <img
                src="/profile6.svg"
                alt=""
                className={`absolute w-16 h-16 left-[65%] bottom-[15%] z-10 animate-[float1_3s_ease-in-out_infinite_2.5s] transition-opacity duration-500 ${
                  visibleProfiles >= 6 ? "opacity-100" : "opacity-0"
                }`}
              />
              <img src="/hotelbuilding.svg" alt="" className="w-full h-full" />

              <div className="relative top-6 text-center">
              <h1 className="text-5xl font-semibold text-[#252941]">Perfect</h1>
              <p className="text-xl font-semibold mt-5 text-white">Management for your growth.</p>
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
          </div>
        </div>

        <Features />

        <div>
          <div className="bg-[#252941] m-24 rounded-2xl h-[650px]">
            <div className="flex justify-evenly items-center h-full">
              <div className="w-1/2">
                <div className="space-y-12">
                  <h1 className="text-white text-[44.7px] font-bold w-2/3">
                    Optimize managing hotel operations
                  </h1>
                  <p className="text-white text-normal">
                    Efficiently oversee and streamline all hotel operations with
                    our comprehensive system focused on staff management. Our
                    platform enables smooth coordination across departments,
                    ensuring every task is handled with precision and timeliness
                    thereby enhancing the guest experience and optimizing
                    operational efficiency.
                  </p>
                </div>
              </div>
              <img src="/optimse.svg" alt="" />
            </div>
          </div>
        </div>

        


        <div>
          <div className="bg-[#E2E3FF] m-24 rounded-2xl h-[403px] mt-32">
            <div className="flex justify-around items-center h-full ">
              <div className="w-1/2">
                <div className="space-y-3">
                  <h1 className="text-black text-[44.7px] font-bold w-2/3">
                    All-encompassing mobile Apps
                  </h1>
                  <p className="text-black text-normal w-96">
                    Manage travel and expense, keep tabs on spending and
                    collaborate-all from the palm of your hand
                  </p>
                  <img src="/playstore.svg" alt="" />
                </div>
              </div>
              <img
                src="/iPhone 15 Pro - Black Titanium - Portrait.svg"
                alt=""
              />
            </div>
          </div>
        </div>

        <footer>
          <div className="bg-[#47518C] text-white py-8">
            <div className="container mx-auto flex justify-between items-center">
                <RevealLinks />
              <div>
                <img src="/logowhite.svg" alt="HotelCrew Logo" className="w-40" />
                <p className="mt-4">© 2023 HotelCrew. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </page>
  );
};

export default Onboarding;
