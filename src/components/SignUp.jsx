import { useRef, useState, useEffect } from "react";
import arrow from '../assets/arrow.svg';
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/UserSlice"
import Frame from '../assets/Frame.svg'
import eye from '../assets/eye.svg';



const SignUp = () => {
    const userRef = useRef();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);
    const [user, setUser] = useState('');
   
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [showMatchPassword, setShowMatchPassword] = useState(false)
    const [matchFocus, setMatchFocus] = useState(false);

    const [showError, setShowError] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userCredentials = {
            email: email,
            password: pwd,
            confirm_password: matchPwd
        }
        dispatch(registerUser(userCredentials)).then((result) => {
            if (registerUser.fulfilled.match(result)) {
                setEmail("");
                setPwd("");

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
                <form onSubmit={handleSubmit} className=" w-[303px] h-[220px] absolute top-[201px]  gap-2 flex flex-col p-1 ">
                    <div className={`relative w-full ${userFocus ? 'shift-up' : ''}`}>
                        <label htmlFor="username" className={`transform -translate-y-1/2 transition-opacity duration-200 ${userFocus ? 'opacity-100' : 'opacity-0'
                            } text-[24px] font-medium text-left`}
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder={userFocus ? "" : "Name"}
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                            className={`w-full border-b-2 transition duration-200 
                         focus:outline-none focus:ring-0 
                        ${userFocus ? 'pb-2' : 'pb-0'}  
                    `}
                        />
                    </div>
                    <div className={`relative w-full ${emailFocus ? 'shift-up' : ''}`}>
                        <label htmlFor="email" className={`transform -translate-y-1/2 transition-opacity duration-200 ${emailFocus ? 'opacity-100' : 'opacity-0'
                            } text-[24px] font-medium text-left`}
                     
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="off"
                            placeholder={emailFocus ? "" : "Email"}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                            className={`w-full border-b-2 transition duration-200 
                         focus:outline-none focus:ring-0 
                        ${emailFocus ? 'pb-2 mt-4' : 'pb-0 mt-0'}   
                    `}
                        />
                    </div>
                    <div className={`relative w-full ${pwdFocus ? 'shift-up' : ''}`}>
                        <label htmlFor="pwd" className={`transform -translate-y-1/2 transition-opacity duration-200 ${pwdFocus ? 'opacity-100' : 'opacity-0'
                            } text-[24px] font-medium text-left`}

                        >
                            Password
                        </label>
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="pwd"
                                placeholder={pwdFocus ? "" : "Password"}
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                                className={`w-full border-b-2 transition duration-200 
                        focus:outline-none focus:ring-0 
                        ${pwdFocus ? 'pb-2' : 'pb-0'}  
                    `}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-1/3 transform -translate-y-1/2 cursor-pointer pr-2">
                                <img src={eye} alt="Toggle Password Visibility" />
                            </span>
                        </div>
                    </div>
                    <div className={`relative w-full ${matchFocus ? 'shift-up' : ''}`}>
                        <label htmlFor="confirm_pwd" className={`transform -translate-y-1/2 transition-opacity duration-200 ${matchFocus ? 'opacity-100' : 'opacity-0'
                            } text-[24px] text-left font-medium  `}
                            >
                            Confirm Password
                        </label>
                        <div className="relative w-full">
                            <input
                                type={showMatchPassword ? "text" : "password"}
                                id="confirm_pwd"
                                placeholder={matchFocus ? "" : "Confirm Password"}
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                required
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                                className={`w-full border-b-2 transition duration-200 
                       focus:outline-none focus:ring-0 
                        ${matchFocus ? 'pb-2' : 'pb-0'}  
                    `}
                            />
                            <span
                                onClick={() => setShowMatchPassword(!showMatchPassword)}
                                className="absolute right-0 top-1/3 transform -translate-y-1/2 cursor-pointer pr-2">
                                <img src={eye} alt="Toggle Password Visibility" />
                            </span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full lg:w-[88px] h-[88px] bg-[#5663AC] text-white rounded-lg flex items-center justify-center hover:bg-[#6773AC] transition-colors ml-[215px] top-10 relative"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
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