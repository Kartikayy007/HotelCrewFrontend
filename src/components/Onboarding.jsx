
import { useNavigate } from "react-router-dom";

const Onboarding = () => {

    const navigate = useNavigate();
    return (
        <div className="flex justify-between h-screen overflow-hidden items-center">
            <div className="flex justify-center items-center flex-col w-[411px] h-[322px] mx-auto gap-[72px]">
                <div className="h-[210px] flex flex-col">
                    <h1 className=" text-[24px] font-bold leading-[31.2px] text-center">
                        Welcome to HotelCrew
                    </h1>
                    <h2 className="text-[18px] font-semibold leading-[25.2px] text-center text-neutral-950 mb-[48px]">
                        Streamline Your Hotel Operations Today!
                    </h2>
                    <p className="text-[16px] font-semibold leading-[24px] text-center text-[#5B6C78]  p-4">
                    HotelCrew is your all-in-one solution for efficient hotel management. Join us to manage staff, communicate seamlessly, and enhance guest experiences.
                    </p>
                </div>
                <div className="flex flex-row justify-between w-[411px] ">
                <button className="w-[195px] h-[40px] px-[24px] py-[10px] font-semibold rounded-[8px] text-white bg-[#5663AC] opacity-100 hover:bg-[#4a5b9b] transition duration-200">
                
                    Log In
                    </button>
               
                <button className="w-[195px] h-[40px] px-[10px] py-[10px] font-semibold rounded-[8px] text-white bg-[#5663AC] opacity-100 hover:bg-[#4a5b9b] transition duration-200 ml-[10px]" onClick={() => navigate("/SignUp")} >
                    Register
                    </button>

                </div>
            </div>
            <div className="50vw ">
                <img src="src/assets/onboard.svg" alt="onboarding" />
            </div>

        </div>
    )
}

export default Onboarding