import { useState, useEffect, useRef } from "react";
import arrow from '../assets/arrow.svg';
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/UserSlice"
import { verifyOtp } from "../redux/slices/OtpSlice";
import Frame from '../assets/Frame.svg'
import eye from '../assets/eye.svg';
import eyeClosed from '../assets/eyeClosed.svg';


const SignUp = () => {

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);

    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');

    const [pwd, setPwd] = useState('');
    const [showPwd, setShowPwd] = useState(false)

    const [matchPwd, setMatchPwd] = useState('');
    const [showMatchPwd, setShowMatchPwd] = useState(false)

    const [errorMsg, setErrorMsg] = useState('');
    const [otpErrorMsg, otpSetErrorMsg] = useState('');

    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];
    const [showOtpInput, setShowOtpInput] = useState(false);
    const { loading: otpLoading,  error: otpError } = useSelector((state) => state.otp);

    const handleInputChange = (set) => (e) => {
        set(e.target.value);
        setErrorMsg("");
       
    };

    useEffect(() => {
        if (error) {
            setErrorMsg(error);
        }
    }, [error]);

    useEffect(() => {
        if (otpError) {
            otpSetErrorMsg(otpError);
        }
    }, [otpError]);

    const handleKeyDown = (index, e) => {
            // Move to previous input on backspace if current input is empty
            if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
              inputRefs[index - 1].current.focus();
            }
          };

    const handleChange = (index, value) => {
            
            if (!/^\d*$/.test(value)) return;
        
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            otpSetErrorMsg(""); 
            if (value !== '' && index < 3) {
              inputRefs[index + 1].current.focus();
            }
          };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !email || !pwd || !matchPwd) {
            setErrorMsg("Enter all fields");
            return;
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMsg("Invalid email");
            return;
        }

        if (!(pwd === matchPwd)) {
            setErrorMsg("Passwords do not match");
            return;
        }

        setErrorMsg("");
        const userCredentials = {
            // name:user,
            email: email,
            password: pwd,
            confirm_password: matchPwd
        }
        dispatch(registerUser(userCredentials)).then((result) => {
            if (registerUser.fulfilled.match(result)) {
                console.log('registered');
                setEmail("");
                setUser("");
                setPwd("");
                setMatchPwd("");
                setShowOtpInput(true);
            }
        });
    }
    const handleVerifyOtp = (e) => {
         e.preventDefault();
        if (otp.join('').length < 4) {
            otpSetErrorMsg("Please enter the complete OTP");
            return;
        }
        dispatch(verifyOtp({ email, otp: otp.join('') })).then((result) => {
            if (verifyOtp.fulfilled.match(result)) {
                console.log("OTP verified");
                // Add any additional logic after successful OTP verification here
            } else {
                // Handle error if OTP verification fails
                otpSetErrorMsg(result.payload.message || "OTP verification failed");
            }
        });
      };

    return (
        <div>
                <>
                {showOtpInput ?
                    (
                        <div className="flex flex-col items-center justify-center space-y-6 p-8 max-w-[323px]:">
                        <h2 className="absolute top-[109px] left-[144px] w-[209px] h-[39px] text-[32px] font-semibold leading-[39px] text-left  ">
                            Verify E-mail
                        </h2>
  
                              <form className="absolute top-[208px] left-[84px] w-[323px] h-[118px]  flex flex-col justify-center items-center gap-[19px]" onSubmit={handleVerifyOtp}>
                              <div className="flex space-x-4">
                                {otp.map((digit, index) => (
                                  <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-lg border-2 border-transparent rounded-lg 
                                             bg-[#D2E0F3] focus:border-[#5663AC] focus:outline-none"
                                  />
                                ))}
                              </div>
                        
                              <p className=" text-xs font-normal leading-[16.34px] text-left ">
                                An OTP has been sent to your E-mail
                              </p>
                              
                              <p className="text-xs ">
                                Didn't receive a mail?{' '}
                                
                                
                                {/* {' '}in <span>59</span> seconds */}
                              </p>
                              <button className="text-blue-500 hover:text-blue-600 text-sm">
                                  Resend
                                </button>
                                <button
                        type="submit"
                        disabled={otpLoading}
                        className="w-[88px] h-[88px] rounded-tl-lg flex items-center justify-center
                        bg-[#5663AC] hover:bg-[#6773AC]  text-white transition-opacity duration-300 absolute right-4 top-[208px]" 
                        >
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                        ) : (
                            <img src={arrow} alt="Submit" />
                        )}
                        </button>
                        {otpErrorMsg && <p className="text-red-500 text-xs">{otpErrorMsg}</p>}
                              </form>
                              
                            </div>
                            


                    ) : (
                        <>
                        <div className="min-h-screen w-[34.5vw] flex flex-col items-center justify-center">
                        <div className="flex flex-col items-start w-full max-w-[303px] ">
                <h1 className="w-[176px] h-[49px] absolute top-[93px]  opacity-100 
              text-[40px] font-bold  text-left 
              ">
                    Register
                </h1>
               
                <form onSubmit={handleSubmit} className=" w-[303px] h-[220px] absolute top-[201px]  gap-9 flex flex-col p-1 mb-0">
                    <div className={`relative w-full`}>

                        <input
                            type="text"
                            id="username"
                            placeholder={(errorMsg === "Enter all fields" && !user) ? "Enter Name" : "Name"}
                            autoComplete="off"
                            onChange={handleInputChange(setUser)}
                            value={user}
                            className={`w-full border-b transition duration-200 
                         focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2 ${errorMsg === "Enter all fields" && !user ? 'border-red-500 placeholder-red-500' : 'border-gray-500  placeholder-gray-500'}`}
                        />
                    </div>
                    <div className={`relative w-full`}>

                        <input
                            type="text"
                            id="email"
                            autoComplete="off"
                            placeholder={(errorMsg === "Enter all fields" && !email) ? "Enter E-mail" : "E-mail"}
                            onChange={handleInputChange(setEmail)}
                            value={email}
                            className={`w-full border-b transition duration-200 
                         focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2  ${(errorMsg === "Invalid email" ) || (errorMsg === "Enter all fields" && !email) ? 'border-red-500  placeholder-red-500' : 'border-gray-500  placeholder-gray-500'}`}
                        />
                    </div>

                    <div className="relative w-full">
                        <input
                            type={showPwd ? "text" : "password"}
                            id="pwd"
                            placeholder={(errorMsg === "Enter all fields" && !pwd) ? "Enter Password" : "Password"}
                            onChange={handleInputChange(setPwd)}
                            value={pwd}
                            maxLength={12}
                            className={`w-full border-b transition duration-200 
                        focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2 ${(errorMsg === "Enter all fields" && !pwd) ? 'border-red-500  placeholder-red-500' : 'border-gray-500 placeholder-gray-500'}`}
                        />
                        <span
                            onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-0 top-1/3 transform -translate-y-1/2 cursor-pointer pr-2">
                            <img src={showPwd ? eye : eyeClosed} alt="Toggle Password Visibility" />
                        </span>
                    </div>

                    <div className={`relative w-full `}>


                        <input
                            type={showMatchPwd ? "text" : "password"}
                            id="confirm_pwd"
                            placeholder="Confirm Password"
                            onChange={handleInputChange(setMatchPwd)}
                            value={matchPwd}
                            maxLength={12}
                            className={`w-full border-b transition duration-200 
                       focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2 ${(errorMsg === "Passwords do not match" && pwd !== matchPwd) | (errorMsg === "Enter all fields" && !matchPwd) ? 'border-red-500 placeholder-red-500' : 'border-gray-500 placeholder-gray-500'}`}
                        />
                        <span
                            onClick={() => setShowMatchPwd(!showMatchPwd)}
                            className="absolute right-0 top-1/3 transform -translate-y-1/2 cursor-pointer pr-2 ">
                            <img src={showMatchPwd ? eye : eyeClosed} alt="Toggle Password Visibility" />
                        </span>

                    </div>
                    <div className={`h-[1px] `}>
                        {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-[88px] h-[88px] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors ml-[215px] top-0.2 relative"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-21 w-21 border-b-2 border-white" />
                        ) : (
                            <img src={arrow} alt="Submit" />
                        )}
                    </button>
                </form>
             
                </div>
                </div>
                </>
                    )};
                    </>

            
            <div className="w-[65.5vw] h-full bg-right bg-cover fixed top-0 right-0 ">
                <img src={Frame} alt="bg" className="w-full h-full object-cover" />
            </div>
        </div>
    )
}

export default SignUp;