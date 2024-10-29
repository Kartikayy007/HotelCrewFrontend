import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/slices/UserSlice"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userCredentials = {
      email,
      password
    };
    dispatch(loginUser(userCredentials)).then((result) => {
      if(loginUser.fulfilled.match(result)) {
        setEmail("");
        setPassword("");

        console.log('loggedin');
        // navigate("/");
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-Montserrat">
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md space-y-14 mt-28 p-16">
          <h1 className="text-[40px] font-bold">LogIn</h1>
          <form
            className="w-[311px] relative bottom-4 space-y-5"
            onSubmit={handleSubmit}
          >
            <div className="space-y-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 text-xs pl-4 border-b border-gray-700 focus:outline-none md:placeholder-gray-500 font-normal font-[open sans]"
                placeholder="E-mail"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 pl-4 text-xs border-b border-gray-700 focus:outline-none md:placeholder-gray-500"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <img src="src/assets/eye.svg" alt="Toggle Password Visibility" />
                </button>
              </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="text-right">
              <a href="#" className="text-xs relative right-3 top-[-1em] text-gray-500">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full lg:w-[88px] h-[88px] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors ml-[215px] top-10 relative"
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
      <img
        src="src/assets/login-hero.png"
        className="w-full max-w-[945px] h-auto"
        alt="Login Hero"
      />
    </div>
  );
};

export default Login;