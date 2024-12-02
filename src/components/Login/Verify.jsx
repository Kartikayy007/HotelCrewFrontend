import React, {useState, useRef, useEffect} from "react";
import axios from "axios";
import Lottie from "react-lottie";
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const eyeOpenAnimationDataUrl = "/eyeOpen.json";

const Verify = ({email}) => {
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
  const [hasInteractedAfterResend, setHasInteractedAfterResend] =
    useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const isOtpComplete = (otpArray) => {
    return otpArray.every(digit => digit !== '');
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const isComplete = isOtpComplete(otp);
      
      if (!isComplete) {
        setErrorMessage('Please enter complete OTP');
        return;
      }
      
      handleVerifyOtp();
    } else if (e.key === 'Backspace') {
      if (index > 0 && !otp[index]) {
        setTimeout(() => {
          inputRefs[index - 1].current?.focus();
        }, 0);
      }
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

  const handleVerifyOtp = async () => {
    if (!isOtpComplete(otp)) {
      setErrorMessage('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/verify-otp/",
        {
          email: email,
          otp: otp.join(""),
        }
      );
      setShowOtpInput(false);
    } catch (err) {
      console.log('Raw backend response:', err.response?.data);
      
      if (!err.response) {
        setErrorMessage(
          "Network error."
        );
      } else {
        // Extract and display the exact error message from backend
        const errorMessage = err.response.data.error?.[0] || err.response.data.error || "Verification failed";
        setErrorMessage(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/forget-password/",
        {
          email,
        }
      );
       ("OTP resent");
      setTimeLeft(30);
      setIsResendDisabled(true);
      setSuccessMessage("OTP resent successfully");
      setHasInteractedAfterResend(false);
    } catch (err) {
      if (!err.response) {
        setErrorMessage(
          "Network error."
        );
      } else {
        setErrorMessage("Failed to resend OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://hotelcrew-1.onrender.com/api/auth/reset-password/',
        {
          email,
          new_password: password,
          confirm_password: confirmPassword
        }
      );

      setSnackbar({
        open: true,
        message: 'Password changed successfully! Redirecting...',
        severity: 'success'
      });

      setTimeout(() => {
        navigate('/login', { replace: true });
        window.location.reload();
      }, 2000);

    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    path: eyeOpenAnimationDataUrl,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const validatePassword = (password) => {
    if (!passwordRegex.test(password)) {
      if (password.length < 8) {
        return 'Password must be at least 8 characters long';
      }
      if (!/(?=.*[a-z])/.test(password)) {
        return 'Password must include at least one lowercase letter';
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        return 'Password must include at least one uppercase letter';
      }
      if (!/(?=.*\d)/.test(password)) {
        return 'Password must include at least one number';
      }
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
    
    if (confirmPassword) {
      setPasswordMatchError(newPassword !== confirmPassword);
    }
  };
  
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    
    if (password) {
      setPasswordMatchError(password !== newConfirmPassword);
    }
  };
  
  const handlePasswordBlur = () => {
    if (password && confirmPassword) {
      setPasswordMatchError(password !== confirmPassword);
    }
  };
  
  const handleConfirmBlur = () => {
    if (password && confirmPassword) {
      setPasswordMatchError(password !== confirmPassword);
    }
  };

  return (
    <div className="font-Montserrat lg:min-h-screen lg:w-full lg:flex lg:justify-center overflow-hidden">
      <div className="w-full h-[45vh] justify-center items-center bg-[#8094D4] lg:hidden">
        <img
          className="w-full h-full object-fill"
          src=" /web2 1.svg"
          alt="Loading..."
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

                {errorMessage && (
                  <p className="text-[#99182C] text-base">{errorMessage}</p>
                )}
                {successMessage &&
                  !hasInteractedAfterResend &&
                  !errorMessage && (
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
            <form
              className="w-full lg:w-96 lg:space-y-7 space-y-8"
              onSubmit={handleSubmit}
            >
              <h1 className="text-[40px] font-bold lg:mt-0 mt-5 text-center lg:text-left">
                Reset Password
              </h1>
              <div className="space-y-8">
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className={`w-full p-2 pl-4 text-xl placeholder:text-base border-b ${
                      passwordError || passwordMatchError ? 'border-[#99182C]' : 'border-gray-700'
                    } focus:outline-none`}
                    placeholder="New Password"
                    autoComplete="new-password"
                    maxLength={24}
                    onBlur={handlePasswordBlur}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords ? (
                      <Lottie options={defaultOptions} width={35} height={35} />
                    ) : (
                      <img src="/eyeMP_000.svg" width={35} height={35} />
                    )}
                  </button>
                </div>
                

                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`w-full p-2 pl-4 text-xl placeholder:text-base border-b ${
                      passwordMatchError ? 'border-[#99182C]' : 'border-gray-700'
                    } focus:outline-none`}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    maxLength={24}
                    onBlur={handleConfirmBlur}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords ? (
                      <Lottie options={defaultOptions} width={35} height={35} />
                    ) : (
                      <img src="/eyeMP_000.svg" width={35} height={35} />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && <p className="text-[#99182C]">{errorMessage}</p>}
              {passwordError && (
                  <p className="text-[#99182C] mt-1">{passwordError}</p>
                )}
              <div className="">
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
                    <p className="font-bold">Continue</p>
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Verify;
