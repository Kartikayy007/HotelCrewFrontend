import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie";

const eyeOpenAnimationDataUrl1 = "/eyeOpen.json";
const eyeOpenAnimationDataUrl2 = "/eyeOpen.json";

const Verify = ({ email }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtpInput, setShowOtpInput] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasInteractedAfterResend, setHasInteractedAfterResend] = useState(false); 
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setShowAnimations(!showAnimations);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
    setShowAnimations(!showAnimations);
  };

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
    setErrorMessage("");
    setSuccessMessage(""); 
    setHasInteractedAfterResend(true); 
    if (value !== "" && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.join("").length < 4) {
      setErrorMessage("Please enter the complete OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/verify-otp/",
        {
          email: email,
          otp: otp.join(""),
        }
      );
      console.log("OTP verified:", response);
      setShowOtpInput(false);
    } catch (err) {
      if (!err.response) {
        setErrorMessage("Network error. Please check your internet connection and try again.");
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      await axios.post("https://hotelcrew-1.onrender.com/api/auth/forget-password/", {
        email,
      });
      console.log("OTP resent");
      setTimeLeft(30);
      setIsResendDisabled(true);
      setSuccessMessage("OTP resent successfully"); 
      setHasInteractedAfterResend(false); 
    } catch (err) {
      if (!err.response) {
        setErrorMessage("Network error. Please check your internet connection and try again.");
      } else {
        setErrorMessage("Failed to resend OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
       const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;


    if (!passwordRegex.test(password)) {
      setErrorMessage("Invalid password format");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await axios.post("https://hotelcrew-1.onrender.com/api/auth/reset-password/", {
        email: email,
        new_password: password,
        confirm_password: confirmPassword
      });
      console.log("Response:", response);
      window.location.reload();
    } catch (err) {
      if (!err.response) {
        setErrorMessage("Network error. Please check your internet connection and try again.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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


  return (
    <div className="font-Montserrat lg:min-h-screen lg:w-full lg:flex lg:justify-center overflow-hidden">
      <div className="w-full h-[45vh] justify-center items-center bg-[#8094D4] lg:hidden">
        <img className="w-full h-full object-fill" src=" /web2 1.svg" alt="Loading..." />
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
              
        {errorMessage && <p className="text-[#99182C] text-base">{errorMessage}</p>}
        {successMessage && !hasInteractedAfterResend && !errorMessage && (
          <p className="text-[#32b550] text-base">
            {successMessage || "OTP resent successfully"}
          </p>
        )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-9 bg-[#5663AC] text-white rounded-lg hover:bg-[#6773AC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
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
            <form className="w-full lg:w-96  lg:space-y-7 space-y-1" onSubmit={handleSubmit}>
            <h1 className="text-[40px] font-bold lg:mt-0 mt-5 text-center lg:text-left">Reset Password</h1>
              <div className="space-y-8">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 text-base pl-4 border-b border-gray-700 focus:outline-none"
                    placeholder="New Password"
                    value={password}
                  maxLength={20}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <Lottie
                        options={defaultOptions1}
                        width={35}
                        height={35}
                      />
                    ) : (
                      <img src="/eyeMP_000.svg" width={35} height={35} />
                    )}
                    {/* <img
                      src={showPassword ? " /eye-open.svg" : " /eyeClosed.svg"}
                      alt="Toggle Password Visibility"
                    /> */}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full p-2 text-base pl-4 border-b border-gray-700 focus:outline-none"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                  maxLength={20}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <Lottie
                        options={defaultOptions2}
                        width={35}
                        height={35}
                      />
                    ) : (
                      <img src="/eyeMP_000.svg" width={35} height={35} />
                    )}
                    {/* <img
                      src={showConfirmPassword ? " /eye-open.svg" : " /eyeClosed.svg"}
                      alt="Toggle Password Visibility"
                    /> */}
                  </button>
                </div>
              </div>
              {errorMessage && <p className="text-[#99182C]">{errorMessage}</p>}

              <div className="flex justify-center lg:justify-end mt-[41.87%]">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-9 bg-[#5663AC] text-white rounded-lg hover:bg-[#6773AC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <img className="w-6" src="/bouncing-circles.svg" alt="" />
                  </div>
                ) : (
                  <p className="font-bold">Reset</p>
                )}
              </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className=" hidden lg:flex w-full lg:w-[95vw] items-center justify-center h-[380px] lg:h-auto bg-[#8094D4]">
        <img className="h-full" src="/web2 1.svg" alt="Login Hero" />
      </div>
    </div>
  );
};

export default Verify;