import React, { useState } from "react";
import axios from "axios";

const Verify = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setErrorMessage("");

    try {
      const response = await axios.post("https://hotelcrew-1.onrender.com/api/auth/resetpassword/", {
        new_password: password,
        confirm_password: confirmPassword
      });
      console.log("Response:", response);
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-Montserrat">
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md space-y-14 mt-28 p-16">
          <h1 className="text-[32px] font-[600]">Reset Password</h1>
          <form className="w-[311px] relative bottom-4 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full outline-none border-b-2 font-[500] text-[18px] placeholder:text-[12px] placeholder:font-[400]"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword ? "src/assets/eye-open.svg" : "src/assets/eyeClosed.svg"}
                    alt="Toggle Password Visibility"
                  />
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full outline-none border-b-2 font-[500] text-[18px] placeholder:text-[12px] placeholder:font-[400]"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <img
                    src={showConfirmPassword ? "src/assets/eye-open.svg" : "src/assets/eyeClosed.svg"}
                    alt="Toggle Password Visibility"
                  />
                </button>
              </div>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button
              type="submit"
              className="w-full lg:w-[88px] h-[88px] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors ml-[215px] top-10 relative"
            >
              <img src="src/assets/arrow.svg" alt="Submit" />
            </button>
          </form>
        </div>
      </div>

      <div className="flex items-center justify-center w-full max-w-[945px] h-auto bg-[#8094D4]">
        <img className="h-auto" src="src/assets/web2 1.svg" alt="Login Hero" />
      </div>
    </div>
  );
};

export default Verify;