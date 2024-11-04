import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/slices/UserSlice";
import axios from "axios";
import Verify from "./Verify";
import validator from 'validator';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(String(email).toLowerCase());
  }, []);



  const handleInputChange = useCallback((set) => (e) => {
    try {
      const sanitizedValue = validator.escape(e.target.value.trim());
      set(sanitizedValue);
      setErrorMsg("");
    } catch (error) {
      console.error("Input sanitization error:", error);
      setErrorMsg("Invalid input detected");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!email || !password) {
        setErrorMsg("All fields are required");
        return;
      }

      if (!validateEmail(email)) {
        setErrorMsg("Please enter a valid email address");
        return;
      }

  
      const loginAttempts = JSON.parse(localStorage.getItem('loginAttempts') || '{"count": 0, "timestamp": 0}');
      const now = Date.now();
      
      if (loginAttempts.count >= 5 && now - loginAttempts.timestamp < 15 * 60 * 1000) {
        setErrorMsg("Too many login attempts. Please try again in 15 minutes.");
        return;
      }

      const userCredentials = { 
        email: email.toLowerCase(),
        password 
      };
      
      const result = await dispatch(loginUser(userCredentials));
      
      if (loginUser.fulfilled.match(result)) {
        localStorage.setItem('loginAttempts', JSON.stringify({"count": 0, "timestamp": now}));
        setEmail("");
        setPassword("");
        setErrorMsg("");
      } else {
        loginAttempts.count += 1;
        loginAttempts.timestamp = now;
        localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
        
        throw new Error(result.error?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(error.response?.data?.message || "Login failed. Please try again.");
      
      setPassword("");
    }
  };

  const resetMail = async () => {
    try {
      if (!email) {
        setErrorMsg("Email is required");
        return;
      }

      if (!validateEmail(email)) {
        setErrorMsg("Please enter a valid email address");
        return;
      }
      const resetAttempts = JSON.parse(localStorage.getItem('resetAttempts') || '{"count": 0, "timestamp": 0}');
      const now = Date.now();
      
      if (resetAttempts.count >= 3 && now - resetAttempts.timestamp < 60 * 60 * 1000) {
        setErrorMsg("Too many reset attempts. Please try again in 1 hour.");
        return;
      }

      setResetLoading(true);
      setResetSuccess(false);
      setErrorMsg("");

      const response = await axios.post(
        "https://hotelcrew-1.onrender.com/api/auth/forget-password/", 
        { email: email.toLowerCase() },
        { timeout: 10000 } 
      );

      resetAttempts.count += 1;
      resetAttempts.timestamp = now;
      localStorage.setItem('resetAttempts', JSON.stringify(resetAttempts));

      setResetSuccess(true);
      setErrorMsg("Password reset email sent successfully.");
      setShowVerify(true);
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.code === 'ECONNABORTED') {
        setErrorMsg("Request timed out. Please try again.");
      } else if (error.response?.status === 429) {
        setErrorMsg("Too many requests. Please try again later.");
      } else {
        setErrorMsg(error.response?.data?.message || "Failed to send reset email. Please try again later.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      setPassword("");
      setEmail("");
    };
  }, []);

  if (showVerify) {
    return <Verify email={email} />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-Montserrat">
      {showForgotPassword ? (
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md space-y-14 mt- p-16">
            <h1 className="text-[40px] font-bold">Forgot Password</h1>
            <form className="w-[311px] relative bottom-4 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                value={email}
                onChange={handleInputChange(setEmail)}
                className={`w-full p-2 text-xs pl-4 border-b ${errorMsg ? 'border-red-500' : 'border-gray-700'} focus:outline-none font-normal font-[open sans]`}
                placeholder="Enter your email to reset password"
                autoComplete="email"
              />
              {errorMsg && (
                <div 
                  className={`text-sm ${resetSuccess ? 'text-green-500' : 'text-red-500'}`}
                  role="alert"
                >
                  {errorMsg}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="relative left-56 text-xs text-gray-500"
              >
                Back to Login
              </button>
              <button
                type="button"
                onClick={resetMail}
                disabled={resetLoading}
                className="w-full lg:w-[88px] h-[88px] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors ml-[215px] top-10 relative disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                ) : (
                  <img src="src/assets/mingcute_arrow-up-fill.svg" alt="Submit" />
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md space-y-14 mt-21 p-16">
            <h1 className="text-[40px] font-bold">LogIn</h1>
            <form className="w-[311px] relative bottom-4 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-8">
                <input
                  type="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  className={`w-full p-2 text-xs pl-4 border-b ${
                    errorMsg === "Invalid Email" || errorMsg === "Enter all fields" 
                      ? 'border-red-500' 
                      : 'border-gray-700'
                  } focus:outline-none font-normal font-[open sans]`}
                  placeholder="E-mail"
                  autoComplete="email"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    className={`w-full p-2 pl-4 text-xs border-b ${
                      errorMsg === "Enter all fields" || errorMsg === "Incorrect password" 
                        ? 'border-red-500' 
                        : 'border-gray-700'
                    } focus:outline-none`}
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <img 
                      src={showPassword ? "src/assets/eye-closed.svg" : "src/assets/eye-open.svg"} 
                      alt={showPassword ? "Hide password" : "Show password"}
                    />
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="text-red-500 text-sm" role="alert">
                  {errorMsg}
                </div>
              )}

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs relative right-3 top-[-1em] text-gray-500"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full lg:w-[88px] h-[88px] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors ml-[215px] top-10 relative disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                ) : (
                  <img src="src/assets/mingcute_arrow-up-fill.svg" alt="Submit" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center w-full max-w-[945px] h-auto bg-[#8094D4]">
        <img className="h-auto" src="src/assets/web2 1.svg" alt="Login Hero" />
      </div>
    </div>
  );
};

export default Login;