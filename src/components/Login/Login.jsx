import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/UserSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Verify from "./Verify";
import validator from "validator";
import Lottie from "react-lottie";

const eyeOpenAnimationDataUrl = "/eyeOpen.json";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(String(email).toLowerCase());
  }, []);

  const validatePassword = useCallback((password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?#.&)(^!@#$%^&*()]{8,}$/;
    const isValid = passwordRegex.test(password);
    return isValid;
  }, []);

  const handleInputChange = useCallback(
    (set) => (e) => {
      try {
        const value = e.target.value;
        set(value);
        setErrorMsg("");
      } catch (error) {
        console.error("Input sanitization error:", error);
        setErrorMsg("Invalid input detected");
      }
    },
    []
  );

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

      if (!validatePassword(password)) {
        setErrorMsg("Invalid Password Format");
        return;
      }

      const loginAttempts = JSON.parse(
        localStorage.getItem("loginAttempts") || '{"count": 0, "timestamp": 0}'
      );
      const now = Date.now();

      if (
        loginAttempts.count >= 10 &&
        now - loginAttempts.timestamp < 15 * 60 * 1000
      ) {
        setErrorMsg("Too many login attempts. Please try again in 15 minutes.");
        return;
      }

      const userCredentials = {
        email: email.toLowerCase(),
        password,
      };

      const result = await dispatch(loginUser({ userCredentials, rememberMe }));

      if (loginUser.fulfilled.match(result)) {
        localStorage.setItem(
          "loginAttempts",
          JSON.stringify({ count: 0, timestamp: Date.now() })
        );

        // Use role from the response data
        const { role } = result.payload;
        const roleRoutes = {
          'Admin': '/admin/dashboard',
          'Manager': '/manager/dashboard',
          'Receptionist': '/reception/dashboard',
          'Staff': '/staff/dashboard'
        };

        const redirectPath = roleRoutes[role];
        if (redirectPath) {
          setEmail("");
          setPassword("");
          setErrorMsg("");
          navigate(redirectPath);
        } else {
          throw new Error("Invalid role");
        }
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        switch (error.response.status) {
          case 401:
            setErrorMsg("Invalid email or password");
            break;
          case 429:
            setErrorMsg("Too many login attempts. Please try again later");
            break;
          case 404:
            setErrorMsg("Account not found. Please check your email");
            break;
          default:
            setErrorMsg("An error occurred during login. Please try again");
        }
      } else if (error.message === "Network Error") {
        setErrorMsg("Network error. Please check your connection and try again.");
      } else if (error.message === "Invalid credentials") {
        setErrorMsg("Invalid email or password");
      } else {
        setErrorMsg("An error occurred during login. Please try again");
      }

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
      const resetAttempts = JSON.parse(
        localStorage.getItem("resetAttempts") || '{"count": 0, "timestamp": 0}'
      );
      const now = Date.now();

      if (
        resetAttempts.count >= 3 &&
        now - resetAttempts.timestamp < 60 * 60 * 1000
      ) {
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
      localStorage.setItem("resetAttempts", JSON.stringify(resetAttempts));

      setResetSuccess(true);
      setErrorMsg("Password reset email sent successfully.");
      setShowVerify(true);
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.code === "ECONNABORTED") {
        setErrorMsg("Request timed out. Please try again.");
      } else if (error.response?.status === 429) {
        setErrorMsg("Too many requests. Please try again later.");
      } else if (error.response?.status === 400) {
        setErrorMsg("User doesn't exist, Please check your email.");
      } else {
        setErrorMsg(
          error.message || "Failed to send reset email. Please try again later."
        );
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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    path: eyeOpenAnimationDataUrl,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="font-Montserrat lg:min-h-screen lg:w-full lg:flex lg:justify-center ">
      <div className="w-full h-[45vh] justify-center items-center bg-[#8094D4] lg:hidden">
        <img
          className="w-full h-full object-fill"
          src="/web2 1.svg"
          alt="Login Hero"
        />
      </div>
      {showForgotPassword ? (
        <div className="w-full lg:w-1/2 flex items-center justify-center p-2">
          <div className="space-y-9">
            <form
              className="lg:w-96 w-80 lg:space-y-7 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!resetLoading) {
                  resetMail();
                }
              }}
            >
              <h1 className="text-[45px] font-bold lg:mt-0 mt-5 text-center lg:text-left">
                Forgot Password
              </h1>
              <div className="lg:space-y-4 space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  className={`w-full p-2 text-xl placeholder:text-base pl-4 border-b
                        focus:outline-none focus:ring-0  pr-4 ${
                          errorMsg
                            ? "border-[#99182C] placeholder-[#99182C]"
                            : "border-gray-500 placeholder-gray-500"
                        }`}
                  placeholder="Enter your email to reset password"
                  autoComplete="email"
                />
              </div>
              {errorMsg && (
                <div
                  className="text-[#99182C] text-base text-center lg:text-left  lg:w-40"
                  role="alert"
                >
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setErrorMsg("");
                  }}
                  className=" text-base text-gray-500"
                >
                  Back to Login
                </button>
              </div>
              <button
                type="submit" // Changed from type="button"
                disabled={resetLoading}
                className="w-full h-9 bg-[#5663AC] text-white rounded-lg hover:bg-[#6773AC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetLoading ? (
                  <div className="flex justify-center items-center">
                    <img className="w-6" src="/bouncing-circles.svg" alt="Loading..." />
                  </div>
                ) : (
                  <p className="font-bold">Continue</p>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-1/2 flex justify-center items-center p-2">
          <div className="space-y-9">
            <form
              className="w-full lg:w-96 lg:space-y-7 space-y-4"
              onSubmit={handleSubmit}
            >
              <h1 className="text-[40px] font-bold mt-5 text-center lg:text-left">
                LogIn
              </h1>
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  className={`w-full p-2 text-xl placeholder:text-base pl-4 border-b ${
                    errorMsg
                      ? "border-[#99182C] placeholder-[#99182C]"
                      : "border-gray-500 placeholder-gray-500"
                  } focus:outline-none font-normal font-[open sans]`}
                  placeholder="E-mail"
                  autoComplete="email"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    className={`w-full p-2 pl-4 text-xl placeholder:text-base border-b ${
                      errorMsg
                        ? "border-[#99182C] placeholder-[#99182C]"
                        : "border-gray-500 placeholder-gray-500"
                    } focus:outline-none`}
                    placeholder="Password"
                    autoComplete="current-password"
                    maxLength={24}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <Lottie options={defaultOptions} width={35} height={35} />
                    ) : (
                      <img src="/eyeMP_000.svg" width={35} height={35} />
                    )}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div
                  className="text-[#99182C] text-sm text-center lg:text-left lg:w-40"
                  role="alert"
                >
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-between items-center text-base">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setErrorMsg("");
                  }}
                  className=" text-gray-500"
                >
                  Forgot password?
                </button>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)} 
                  />
                  <label className=" text-gray-500">Remember me</label>
                </div>
              </div>

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
                    <p className="font-bold">Login</p>
                  )}
                </button>
              </div>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">Need an account? </span>
                <button
                  type="button"
                  onClick={() => navigate("/signup", { replace: true })}
                  className="text-sm text-[#5663AC] hover:text-[#6773AC] font-medium"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="w-full lg:flex justify-center items-center bg-[#8094D4] hidden ">
        <img className="w-[90%]" src="/web2 1.svg" alt="Login Hero" />
      </div>
    </div>
  );
};

export default Login;