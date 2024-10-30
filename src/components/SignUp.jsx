import { useState, useEffect } from "react";
import arrow from '../assets/arrow.svg';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/slices/UserSlice";
import Frame from '../assets/Frame.svg'
import eye from '../assets/eye.svg';
import eyeClosed from '../assets/eyeClosed.svg';


const SignUp = () => {

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);

    const [user, setUser] = useState('');

    const [email, setEmail] = useState('');


    const [pwd, setPwd] = useState('');
    const [showPwd, setShowPwd] = useState(false)


    const [matchPwd, setMatchPwd] = useState('');
    const [showMatchPwd, setShowMatchPwd] = useState(false)

    const [errorMsg, setErrorMsg] = useState('');

    const handleInputChange = (set) => (e) => {
        set(e.target.value);
        setErrorMsg(""); 
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

        if (!(pwd === matchPwd)) {
            setErrorMsg("Passwords do not match");
            return;
        }

        setErrorMsg("");
        const userCredentials = {
            email: email,
            password: pwd,
            confirm_password: matchPwd
        }
        dispatch(loginUser(userCredentials)).then((result) => {
            if (loginUser.fulfilled.match(result)) {
                setEmail("");
                setUser("");
                setPwd("");
                setMatchPwd("");
                console.log('registered');

            }
        });
    }

    return (
        <div className="min-h-screen w-[34.5vw] flex flex-col items-center justify-center">
            <div className="flex flex-col items-start w-full max-w-[303px] ">
                <h1 className="w-[176px] h-[49px] absolute top-[93px]  opacity-100 
              text-[40px] font-bold  text-left 
              ">
                    Register
                </h1>
                <form onSubmit={handleSubmit} className=" w-[303px] h-[220px] absolute top-[201px]  gap-9 flex flex-col p-1 mb-0">
                    <div className={`relative w-full`}>

                        <input
                            type="text"
                            id="username"
                            placeholder={(errorMsg === "Enter all fields" && !user) ? "Enter Name" : "Name"}
                            autoComplete="off"
                            onChange={handleInputChange(setUser)}
                            value={user}
                            className={`w-full border-b transition duration-200 
                         focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2 ${errorMsg === "Enter all fields" && !user ? 'border-red-500 placeholder-red-500' : 'border-gray-500  placeholder-gray-500'}`}
                        />
                    </div>
                    <div className={`relative w-full`}>

                        <input
                            type="email"
                            id="email"
                            autoComplete="off"
                            placeholder={(errorMsg === "Enter all fields" && !email) ? "Enter E-mail" : "E-mail"}
                            onChange={handleInputChange(setEmail)}
                            value={email}
                            className={`w-full border-b transition duration-200 
                         focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2  ${(errorMsg === "Invalid email" && !email) || (errorMsg === "Enter all fields" && !email) ? 'border-red-500  placeholder-red-500' : 'border-gray-500  placeholder-gray-500'}`}
                        />
                    </div>

                    <div className="relative w-full">
                        <input
                            type={showPwd ? "text" : "password"}
                            id="pwd"
                            placeholder={(errorMsg === "Enter all fields" && !pwd) ? "Enter Password" : "Password"}
                            onChange={handleInputChange(setPwd)}
                            value={pwd}
                            maxLength={12}
                            className={`w-full border-b transition duration-200 
                        focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2 ${(errorMsg === "Enter all fields" && !pwd) ? 'border-red-500  placeholder-red-500' : 'border-gray-500 placeholder-gray-500'}`}
                        />
                        <span
                            onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-0 top-1/3 transform -translate-y-1/2 cursor-pointer pr-2">
                            <img src={showPwd ? eye : eyeClosed} alt="Toggle Password Visibility" />
                        </span>
                    </div>

                    <div className={`relative w-full `}>


                        <input
                            type={showMatchPwd ? "text" : "password"}
                            id="confirm_pwd"
                            placeholder="Confirm Password"
                            onChange={handleInputChange(setMatchPwd)}
                            value={matchPwd}
                            maxLength={12}
                            className={`w-full border-b transition duration-200 
                       focus:outline-none focus:ring-0 text-xs pl-4 pr-4 p-2 ${(errorMsg === "Passwords do not match" && pwd !== matchPwd) | (errorMsg === "Enter all fields" && !matchPwd) ? 'border-red-500 placeholder-red-500' : 'border-gray-500 placeholder-gray-500'}`}
                        />
                        <span
                            onClick={() => setShowMatchPwd(!showMatchPwd)}
                            className="absolute right-0 top-1/3 transform -translate-y-1/2 cursor-pointer pr-2 ">
                            <img src={showMatchPwd ? eye : eyeClosed} alt="Toggle Password Visibility" />
                        </span>

                    </div>
                    <div className={`h-[1px] `}>
                        {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-[88px] h-[88px] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors ml-[215px] top-0.2 relative"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-21 w-21 border-b-2 border-white" />
                        ) : (
                            <img src={arrow} alt="Submit" />
                        )}
                    </button>
                </form>
            </div>
            <div className="w-[65.5vw] h-full bg-right bg-cover fixed top-0 right-0 ">
                <img src={Frame} alt="bg" className="w-full h-full object-cover" />
            </div>
        </div>
    )
}

export default SignUp;