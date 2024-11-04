import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Verify = ({ email }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtpInput, setShowOtpInput] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
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
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
      setErrorMessage("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await axios.post("https://hotelcrew-1.onrender.com/api/auth/forget-password/", {
        email,
      });
      console.log("OTP resent");
      setTimeLeft(30);
      setIsResendDisabled(true);
    } catch (err) {
      setErrorMessage("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-Montserrat">
      <div className="flex lg:hidden items-center justify-center h-[45vh] bg-[#8094D4] w-100vw">
      <img className="w-full h-full object-fill" src=" /web2 1.svg" alt="Login Hero" />
    </div>
      {showOtpInput ? (
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md space-y-14 lg:mt-28 p-4 lg:p-16">
            <h2 className="text-[40px] font-bold text-center">Verify OTP</h2>
            <form className="w-[311px] relative bottom-4 text-center space-y-5" onSubmit={handleVerifyOtp}>
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
                    className="w-12 h-12 relative left-9 text-lg border-2 border-transparent rounded-lg 
                             bg-[#D2E0F3] focus:border-[#5663AC] focus:outline-none text-center"
                  />
                ))}
              </div>

              <p className="text-sm text-center font-normal leading-[16.34px]">
                An OTP has been sent to your E-mail
              </p>

              <p className="text-sm text-center">Didn't receive a mail? </p>
              <p className="text-sm">
                {isResendDisabled ? (
                  <span className="text-gray-600 text-center">
                    Resend in {timeLeft} seconds
                  </span>
                ) : (
                  <button
                    type="button"
                    className="text-blue-700 hover:text-blue-900 text-sm text-center"
                    onClick={handleResendOtp}
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                )}
              </p>

              {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full lg:w-[88px] h-[88px] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors ml-[215px] top-10 relative"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                ) : (
                  <img src=" /mingcute_arrow-up-fill.svg" alt="Submit" />
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md space-y-14 mt-21 p-16">
            <h1 className="text-[40px] font-bold text-center lg:text-left">Reset Password</h1>
            <form className="w-full lg:w-[311px] relative bottom-4 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-8">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-3 p-2 text-xs pl-4 border-b border-gray-700 focus:outline-none"
                    placeholder="New Password"
                    value={password}
                  maxLength={20}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={togglePasswordVisibility}
                  >
                    <img
                      src={showPassword ? " /eye-open.svg" : " /eyeClosed.svg"}
                      alt="Toggle Password Visibility"
                    />
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full p-3 p-2 text-xs pl-4 border-b border-gray-700 focus:outline-none"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                  maxLength={20}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <img
                      src={showConfirmPassword ? " /eye-open.svg" : " /eyeClosed.svg"}
                      alt="Toggle Password Visibility"
                    />
                  </button>
                </div>
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <button
                type="submit"
                className="lg:w-[88px] lg:h-[88px] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors lg:ml-[215px] top-10 relative w-[180px] h-[58px] m-auto  disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                ) : (
                  <img src="/mingcute_arrow-up-fill.svg" alt="Submit" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className=" lg:flex w-full lg:w-[95vw] items-center justify-center h-[380px] lg:h-auto bg-[#8094D4]">
        <img className="h-full" src="/web2 1.svg" alt="Login Hero" />
      </div>
    </div>
  );
};

export default Verify;