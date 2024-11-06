import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, resendOtp } from "../../redux/slices/OtpSlice";
import { registerUser } from "../../redux/slices/UserSlice";
import validator from "validator";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const {
    loading: otpLoading,
    error: otpError,
    otpResent,
  } = useSelector((state) => state.otp);

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showMatchPwd, setShowMatchPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [otpErrorMsg, otpSetErrorMsg] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [otpResentMessage, setOtpResentMessage] = useState('');


  const handleInputChange = (set) => (e) => {
    const sanitizedValue = validator.escape(e.target.value);
    set(sanitizedValue);
    setErrorMsg("");
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (error) {
      setErrorMsg(error);
    }
  }, [error]);
  useEffect(() => {
    if (otpResent) {
      otpSetErrorMsg("");
    }
  }, [otpResent]);
  useEffect(() => {
    if (otpError) {
      otpSetErrorMsg(otpError);
    }
  }, [otpError]);

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    otpSetErrorMsg("");
    setOtpResentMessage("");
    if (value !== "" && index < 3) {
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

    const pwdRegex = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    if (!pwdRegex.test(pwd)) {
      setErrorMsg(
        'The password must be at least 8 characters including a digit,\na letter and a special character'
      );
      return;
    }

    if (pwd !== matchPwd) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setErrorMsg("");
    const userCredentials = {
      user_name: user,
      email: email,
      password: pwd,
      confirm_password: matchPwd,
    };

    localStorage.setItem('userEmail', email);

    dispatch(registerUser(userCredentials)).then((result) => {
      if (registerUser.fulfilled.match(result)) {
        console.log("registered");
        setShowOtpInput(true);
      }
    });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.join("").length < 4) {
      otpSetErrorMsg("Please enter the complete OTP");
      return;
    }
    dispatch(verifyOtp({ email, otp: otp.join("") })).then((result) => {
      if (verifyOtp.fulfilled.match(result)) {
        console.log("OTP verified");
        localStorage.setItem("otpVerified", "true");
        navigate("/signup/hoteldetails");
      } else {
        setOtpResentMessage("");
        otpSetErrorMsg(result.payload.message || "OTP verification failed");
      }
    });
  };

  const handleResendOtp = () => {
    const userCredentials = {
      user_name: user,
      email: email,
      password: pwd,
      confirm_password: matchPwd,
    };
    dispatch(resendOtp(userCredentials))
      .then(() => {
        otpSetErrorMsg(""); 
        setOtpResentMessage("OTP resent successfully");
      })
      .catch(() => {
        setOtpResentMessage(""); 
      });
    setTimeLeft(30);
    setIsResendDisabled(true);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-Montserrat overflow-hidden">
      <div className="flex lg:hidden items-center justify-center h-[45vh] w-100vw">
        <img
          src="/Frame2.svg"
          alt="bg"
          className="w-full h-full object-cover "
        />
      </div>
      {showOtpInput ? (
        <div className="w-full lg:w-[34.5vw] flex items-center justify-center">
          <div className="w-full max-w-md space-y-14 mt-8 lg:p-16">
            <h2 className="text-[32px] font-semibold text-center mb-2">
              Verify E-mail
            </h2>

            <form
              className="flex flex-col justify-center items-center gap-4 lg:gap-6 lg:mt-12 "
              onSubmit={handleVerifyOtp}
            >
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

              <p className="text-sm font-normal leading-[16.34px] text-left">
                An OTP has been sent to your E-mail
              </p>

              <p className="text-sm">Didn't receive a mail? </p>
              <p className="text-sm">
                {isResendDisabled ? (
                  <span className="text-gray-600">
                    Resend in {timeLeft} seconds
                  </span>
                ) : (
                  <button
                    className="text-blue-700 hover:text-blue-900 text-sm"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </p>
              {otpErrorMsg  && (
                <p className="text-[#99182C] text-sm">{otpErrorMsg}</p>
              )}
              {otpResent && !otpErrorMsg && (
                <p className="text-green-500 text-sm">{otpResentMessage || "OTP resent successfully"}</p>
              )}
              {/* <div className="flex justify-center lg:justify-end"> */}
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="lg:w-[88px] lg:h-[88px] w-[180px] h-[58px] fixed lg:top-[88vh] lg:left-[23vw] top-[92vh] left-[30vw]  rounded-lg flex items-center justify-center bg-[#5663AC] hover:bg-[#6773AC] text-white transition-opacity duration-300 "
                >
                  {otpLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  ) : (
                    <img src="/arrow.svg" alt="Submit" />
                  )}
                </button>
              {/* </div> */}

            </form>
          </div>
        </div>
      ) : (
        <div className="lg:w-[28vw] flex flex-col lg:items-center lg:justify-center overflow:hidden">
          <div className="flex flex-col lg:max-w-[301px] w-full lg:mt-21 p-4 ">
            <h1 className="text-[40px] font-bold text-center lg:text-left">
              Register
            </h1>
            <form
              onSubmit={handleSubmit}
              className="w-full relative lg:top-8 justify-center gap-9 flex flex-col p-2 mb-0 "
            >

              <div className="relative w-full">
                <input
                  type="text"
                  id="username"
                  placeholder={
                    errorMsg === "Enter all fields" && !user
                      ? "Enter Name"
                      : "Name"
                  }
                  autoComplete="off"
                  onChange={handleInputChange(setUser)}
                  value={user}
                  className={`w-full border-b transition duration-200 
                         focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2 ${errorMsg === "Enter all fields" && !user
                      ? "border-[#99182C] placeholder-[#99182C]"
                      : "border-gray-500 placeholder-gray-500"
                    }`}
                />
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  id="email"
                  autoComplete="off"
                  maxLength={100}
                  placeholder={
                    errorMsg === "Enter all fields" && !email
                      ? "Enter E-mail"
                      : "E-mail"
                  }
                  onChange={handleInputChange(setEmail)}
                  value={email}
                  className={`w-full border-b transition duration-200 
                         focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2 ${errorMsg === "Invalid email" ||
                      (errorMsg === "Enter all fields" && !email)
                      ? "border-[#99182C] placeholder-[#99182C] text-[#99182C]"
                      : "border-gray-500 placeholder-gray-500"
                    }`}
                />
              </div>

              <div className="relative w-full">
                <input
                  type={showPwd ? "text" : "password"}
                  id="pwd"
                  placeholder={
                    errorMsg === "Enter all fields" && !pwd
                      ? "Enter Password"
                      : "Password"
                  }
                  onChange={handleInputChange(setPwd)}
                  value={pwd}
                  maxLength={24}
                  className={`w-full border-b transition duration-200 
                        focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2 ${(errorMsg === "Enter all fields" && !pwd) ||
                      errorMsg ===
                      "The password must include a digit, a Lowercase and Uppercase character, and a special character"
                      ? "border-[#99182C] placeholder-[#99182C] text-[#99182C]"
                      : "border-gray-500 placeholder-gray-500"
                    }`}
                />
                <span
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer pr-2"
                >
                  <img
                    src={showPwd ? "/eye.svg" : "/eyeClosed.svg"}
                    alt="Toggle Password Visibility"
                  />
                </span>
              </div>

              <div className="relative w-full">
                <input
                  type={showMatchPwd ? "text" : "password"}
                  id="confirm_pwd"
                  placeholder="Confirm Password"
                  onChange={handleInputChange(setMatchPwd)}
                  value={matchPwd}
                  maxLength={24}
                  className={`w-full border-b transition duration-200 
                       focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2 ${(errorMsg === "Passwords do not match" &&
                      pwd !== matchPwd) ||
                      (errorMsg === "Enter all fields" && !matchPwd)
                      ? "border-[#99182C] placeholder-[#99182C] text-[#99182C]"
                      : "border-gray-500 placeholder-gray-500"
                    }`}
                />
                <span
                  onClick={() => setShowMatchPwd(!showMatchPwd)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer pr-2"
                >
                  <img
                    src={showMatchPwd ? "/eye.svg" : "/eyeClosed.svg"}
                    alt="Toggle Password Visibility"
                  />
                </span>
              </div>

              <div className="text-center w-full">
                <span className="text-sm text-gray-500">
                  Already have an account?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-[#5663AC] hover:text-[#6773AC] font-medium"
                >
                  Log in
                </button>
              </div>
              <div className="h-2 w-44 mb-0 text-center lg:text-left p-2">
                {errorMsg && (
                  <div className="text-[#99182C] text-sm">{errorMsg}</div>
                )}
              </div>
              <div className="fixed lg:top-[90vh] lg:left-[22vw] top-[90vh] left-[50vw]">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-[58px] w-[180px] lg:w-[88px] lg:h-[88px] lg:fixed lg:bottom-[15vh] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed fixed bottom-14 "
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  ) : (
                    <img src="/arrow.svg" alt="Submit" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="hidden lg:block lg:w-[65.5vw] w-full h-72 lg:h-full bg-right bg-cover lg:fixed lg:top-0 lg:right-0 mt-4 lg:mt-0">
        <img
          src="/Frame.svg"
          alt="bg"
          className="w-full h-full object-cover object-right lg:object-center"
        />
      </div>
    </div>
  );
};

export default SignUp;
