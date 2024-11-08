import {useState, useRef, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {verifyOtp, resendOtp} from "../../redux/slices/OtpSlice";
import {registerUser} from "../../redux/slices/UserSlice";
import validator from "validator";
import {useNavigate} from "react-router-dom";
import Lottie from "react-lottie";

const eyeOpenAnimationDataUrl1 = "/eyeOpen.json";
const eyeOpenAnimationDataUrl2 = "/eyeOpen.json";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error} = useSelector((state) => state.user);
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
  const [otpResentMessage, setOtpResentMessage] = useState("");
  const [hasInteractedAfterResend, setHasInteractedAfterResend] =
    useState(false);

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
    setErrorMsg("");
    setOtpResentMessage("");
    setHasInteractedAfterResend(true);

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

    const pwdRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?#.&)(^!@#$%^&*()]{8,}$/;
    if (!pwdRegex.test(pwd)) {
      setErrorMsg("Invalid Password format");
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

    localStorage.setItem("userEmail", email);

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
    dispatch(verifyOtp({email, otp: otp.join("")})).then((result) => {
      if (verifyOtp.fulfilled.match(result)) {
        console.log("OTP verified");
        localStorage.setItem("otpVerified", "true");
        navigate("/signup/hoteldetails");
      } else {
        setOtpResentMessage("");
        otpSetErrorMsg(result.payload.error || "OTP verification failed");
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
        setHasInteractedAfterResend(false);
      })
      .catch(() => {
        setOtpResentMessage("");
      });
    setTimeLeft(30);
    setIsResendDisabled(true);
  };

  const defaultOptions1 = {
    loop: true,
    autoplay: true,
    path: eyeOpenAnimationDataUrl1,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    path: eyeOpenAnimationDataUrl2,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const toggleAnimations = () => {
    setShowPwd(!showPwd);
    setShowMatchPwd(!showMatchPwd);
    setShowAnimations(!showAnimations);
  };

  return (
    <div className="font-Montserrat lg:min-h-screen lg:w-full lg:flex lg:justify-center">
      <div className="w-full h-[45vh] justify-center items-center bg-[#8094D4] lg:hidden">
        <img
          src="/Frame2.svg"
          alt="bg"
          className="w-full h-full object-cover object-right"
        />
      </div>
      {showOtpInput ? (
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="space-y-6">
            <form
              className="w-full lg:space-y-3 space-y-4 "
              onSubmit={handleVerifyOtp}
            >
              <h2 className="text-[40px] font-bold lg:mt-0 mt-5 text-center">
                Verify E-mail
              </h2>
              <div className="flex flex-col justify-center items-center gap-4 lg:gap-5">
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

                <p className="text-base font-normal leading-[16.34px] text-left">
                  An OTP has been sent to your E-mail
                </p>
                <div className="text-center">
                  <p className="text-base">Didn't receive a mail? </p>
                  <p className="text-base">
                    {isResendDisabled ? (
                      <span className="text-gray-600">
                        Resend in {timeLeft} seconds
                      </span>
                    ) : (
                      <button
                        className="text-blue-700 hover:text-blue-900 text-base"
                        onClick={handleResendOtp}
                      >
                        Resend OTP
                      </button>
                    )}
                  </p>
                </div>
                {otpErrorMsg && (
                  <p className="text-[#99182C] text-base">{otpErrorMsg}</p>
                )}
                {otpResent && !hasInteractedAfterResend && !otpErrorMsg && (
                  <p className="text-[#32b550] text-base">
                    {otpResentMessage || "OTP resent successfully"}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full h-9 bg-[#5663AC] text-white rounded-lg hover:bg-[#6773AC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpLoading ? (
                    <div className="flex justify-center items-center">
                      <img className="w-6" src="/bouncing-circles.svg" alt="" />
                    </div>
                  ) : (
                    <p className="font-bold">Verify</p>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="space-y-9">
            <form
              onSubmit={handleSubmit}
              className="w-full lg:w-96  lg:space-y-7 space-y-1"
            >
                Register
              <h2 className="text-[40px] font-bold lg:mt-0 mt-5 text-center lg:text-left">
              </h2>
              <div className="lg:space-y-4 space-y-2">
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
                  className={`w-full p-2 text-xl placeholder:text-base pl-4 border-b
                        focus:outline-none focus:ring-0  pr-4 ${
                          errorMsg === "Enter all fields" && !user
                            ? "border-[#99182C] placeholder-[#99182C]"
                            : "border-gray-500 placeholder-gray-500"
                        }`}
                />
                <div className="relative">
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
                        focus:outline-none focus:ring-0 text-xl placeholder:text-base pl-4pr-4 p-2 ${
                          errorMsg === "Invalid email" ||
                          (errorMsg === "Enter all fields" && !email)
                            ? "border-[#99182C] placeholder-[#99182C] text-[#99182C]"
                            : "border-gray-500 placeholder-gray-500"
                        }`}
                  />
                </div>

                <div className="relative">
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
                    className={`w-full p-2 pl-4 text-xl placeholder:text-base border-b  
                        focus:outline-none focus:ring-0  pr-4 ${
                          (errorMsg === "Enter all fields" && !pwd) ||
                          errorMsg === "Invalid Password format"
                            ? "border-[#99182C] placeholder-[#99182C] text-[#99182C]"
                            : "border-gray-500 placeholder-gray-500"
                        }`}
                  />
                  <button
                    type="button"
                    onClick={toggleAnimations}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    aria-label={
                      showMatchPwd ? "Hide password" : "Show password"
                    }
                  >
                    {showPwd ? (
                      <Lottie
                        options={defaultOptions1}
                        width={35}
                        height={35}
                      />
                    ) : (
                      <img src="/eyeMP_000.svg" width={35} height={35} />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showMatchPwd ? "text" : "password"}
                    id="confirm_pwd"
                    placeholder="Confirm Password"
                    onChange={handleInputChange(setMatchPwd)}
                    value={matchPwd}
                    maxLength={24}
                    className={`w-full border-b transition duration-200 
                      focus:outline-none focus:ring-0 text-xl placeholder:text-base pl-4 pr-4 p-2 ${
                        (errorMsg === "Passwords do not match" &&
                          pwd !== matchPwd) ||
                        (errorMsg === "Enter all fields" && !matchPwd)
                          ? "border-[#99182C] placeholder-[#99182C] text-[#99182C]"
                          : "border-gray-500 placeholder-gray-500"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={toggleAnimations}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    aria-label={
                      showMatchPwd ? "Hide password" : "Show password"
                    }
                  >
                    {showMatchPwd ? (
                      <Lottie
                        options={defaultOptions2}
                        width={35}
                        height={35}
                      />
                    ) : (
                      <img src="/eyeMP_000.svg" width={35} height={35} />
                    )}
                  </button>
                </div>

                {errorMsg && (
                  <div
                    className="text-[#99182C] text-sm text-center lg:text-left lg:top-[55%] top-[72.1%] lg:w-40"
                    role="alert"
                  >
                    {errorMsg}
                  </div>
                )}

                <div className="flex justify-end items-center text-base">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <label className=" text-gray-500">Remember me</label>
                  </div>
                </div>
                <div className="text-center ">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-9 bg-[#5663AC] text-white rounded-lg hover:bg-[#6773AC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <img
                          className="w-6"
                          src="/bouncing-circles.svg"
                          alt=""
                        />
                      </div>
                    ) : (
                      <p className="font-bold">Register</p>
                    )}
                  </button>
                </div>

                <div className="text-center mt-4">
                  <span className="text-sm text-gray-500">
                    Already have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-[#5663AC] hover:text-[#6773AC] font-medium"
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="w-full lg:flex justify-center items-center bg-[#8094D4] hidden">
        <img
          src="/Frame.svg"
          alt="bg"
          className="w-full h-full object-cover object-right"
        />
      </div>
    </div>
  );
};

export default SignUp;
