import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/slices/UserSlice";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Enter all fields");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg("Invalid Email");
      return;
    }

    const userCredentials = { email, password };
    dispatch(loginUser(userCredentials)).then((result) => {
      if (loginUser.fulfilled.match(result)) {
        setEmail("");
        setPassword("");
        setErrorMsg("");
        console.log("loggedin");
        // navigate("/");
      } else {
        setErrorMsg("Incorrect password");
      }
    });
  };

  const resetMail = async () => {
    if (!email) {
      setErrorMsg("Enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Invalid Email");
      return;
    }

    setResetLoading(true);
    setResetSuccess(false);
    setErrorMsg("");

    try {
      console.log("Sending request with email:", email);
      const response = await axios.post("https://hotelcrew-1.onrender.com/api/auth/forgetpassword/", { email });
      console.log("Response:", response);
      setResetSuccess(true);
      setErrorMsg("Password reset email sent successfully.");

      // navigate("/");
    } catch (error) {
      setErrorMsg("Something went wrong. Try again later.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-Montserrat overflow-hidden">
      <div className="flex lg:hidden items-center justify-center h-[45vh] bg-[#8094D4] w-100vw">
      {/* Mobile Layout for Image Above Form */}
      <img className="w-full h-full object-fill" src="src/assets/web2 1.svg" alt="Login Hero" />
    </div>
      {showForgotPassword ? (
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md space-y-14 lg:mt-28 mt-8 lg:p-16">
            <h1 className="text-[40px] font-bold text-center lg:text-left">Forgot Password</h1>
            <form className="w-[311px] relative bottom-4 space-y-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 text-xs pl-4 border-b ${errorMsg ? 'border-red-500' : 'border-gray-700'} focus:outline-none font-normal font-[open sans]`}
                placeholder="Enter your email to reset password"
              />
              {errorMsg && <div className={`text-sm ${resetSuccess ? 'text-green-500' : 'text-red-500'}`}>{errorMsg}</div>}
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
                className="lg:w-[88px] lg:h-[88px] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors lg:ml-[215px] top-10 relative w-[180px] h-[58px] m-auto"
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
          <div className="w-full max-w-md space-y-14 lg:mt-28 mt-8 p-4 lg:p-16">
            <h1 className="text-[40px] font-bold text-center lg:text-left">LogIn</h1>
            <form className="w-full lg:w-[311px] relative bottom-4 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-8">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-2 text-xs pl-4 border-b ${errorMsg === "Invalid Email" || errorMsg === "Enter all fields" ? 'border-red-500' : 'border-gray-700'} focus:outline-none font-normal font-[open sans]`}
                  placeholder="E-mail"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-2 pl-4 text-xs border-b ${errorMsg === "Enter all fields" || errorMsg === "Incorrect password" ? 'border-red-500' : 'border-gray-700'} focus:outline-none`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <img src={showPassword ? "src/assets/eye-closed.svg" : "src/assets/eye-open.svg"} alt="Toggle Password Visibility" />
                  </button>
                </div>
                
              </div>

              {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}

              <div className="text-right">
                <a href="#" onClick={() => setShowForgotPassword(true)} className="text-xs  relative right-3 top-[-1em] text-gray-500">Forgot password?</a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="lg:w-[88px] lg:h-[88px] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors lg:ml-[215px] top-10 relative w-[180px] h-[58px] m-auto"
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
      <div className="hidden lg:flex w-full lg:w-[95vw] items-center justify-center h-[380px] lg:h-auto bg-[#8094D4]">
      <img className="h-auto w-full lg:h-full" src="src/assets/web2 1.svg" alt="Login Hero" />
    </div>
    </div>
  );
};

export default Login;