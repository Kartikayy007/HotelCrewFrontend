import { useRef, useState, useEffect } from "react";
import ArrowButton from '../assets/ArrowButton.svg';
import axios from "axios";
import bg from '../assets/bg.svg'
import eye from '../assets/eye.svg';
import { Link } from "react-router-dom";

const userRegex = /^[A-z][A-z0-9-_]{3,23}$/;
const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,12}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_URL = '/register';

const SignUp = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [showPassword,setShowPassword]=useState(false)
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [showMatchPassword,setShowMatchPassword]=useState(false)
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(userRegex.test(user));
    }, [user])

    useEffect(() => {
        setValidEmail(emailRegex.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(pwdRegex.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, email, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "https://jsonplaceholder.typicode.com/posts",
                {
                    user: user,
                    email: email,
                    password: pwd,
                }
            );

            console.log(response);
            console.log(response.data);

            setEmail("");
            setPassword("");
        } catch (error) {
            console.log(error);
            setError("Login failed");
        }

    }

    return (
        <div className="min-h-screen w-[34.5vw] flex flex-col items-center justify-center">
            <div className="flex flex-col items-start w-full max-w-[303px] ">
                <h1 className="w-[176px] h-[49px] absolute top-[93px]  opacity-100 
              text-[40px] font-bold  text-left 
              sm:text-[36px] md:text-[32px] lg:text-[40px]">
                    Register
                </h1>
                <form onSubmit={handleSubmit} className=" w-[303px] h-[220px] absolute top-[201px]  gap-1 flex flex-col p-1 ">
                    <label htmlFor="username" className={`transform -translate-y-1/2 transition-opacity duration-200 ${userFocus ? 'opacity-100' : 'opacity-0'
                        } text-24 font-medium text-500`}
                        style={{
                            fontSize: '24px',
                            lineHeight: '26.26px',
                            textAlign: 'left',
                        }}
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
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                        value={user}
                        required
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                        className={`w-full border-b-2 transition duration-200 
                         focus:outline-none focus:ring-0 
                        ${userFocus ? 'pb-2' : 'pb-0'}  
                    `}
                    />
                    <label htmlFor="email" className={`transform -translate-y-1/2 transition-opacity duration-200 ${emailFocus ? 'opacity-100' : 'opacity-0'
                        } text-24 font-medium text-500`}
                        style={{
                            fontSize: '24px',
                            lineHeight: '26.26px',
                            textAlign: 'left',
                        }}
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        autoComplete="off"
                        placeholder={emailFocus ? "" : "Email"}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={validEmail ? "false" : "true"}
                        // aria-describedby="uidnote"
                        value={email}
                        required
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        className={`w-full border-b-2 transition duration-200 
                         focus:outline-none focus:ring-0 
                        ${emailFocus ? 'pb-2' : 'pb-0'}  
                    `}
                    />
                    
                    <label htmlFor="pwd" className={`transform -translate-y-1/2 transition-opacity duration-200 ${pwdFocus ? 'opacity-100' : 'opacity-0'
                        } text-24 font-medium text-500`}
                        style={{
                            fontSize: '24px',
                            lineHeight: '26.26px',
                            textAlign: 'left',
                        }}
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
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        className={`w-full border-b-2 transition duration-200 
                        focus:outline-none focus:ring-0 
                        ${pwdFocus ? 'pb-2' : 'pb-0'}  
                    `}
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer pr-2">
                        <img src={eye} alt="Toggle Password Visibility" />
                    </span>
                    </div>
                    <label htmlFor="confirm_pwd" className={`flex justify-between transform -translate-y-1/2 transition-opacity duration-200 ${matchFocus ? 'opacity-100' : 'opacity-0'
                        } text-24 font-medium text-500`}
                        style={{
                            fontSize: '24px',
                            lineHeight: '26.26px',
                            textAlign: 'left',
                        }}>
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
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                        className={`w-full border-b-2 transition duration-200 
                       focus:outline-none focus:ring-0 
                        ${matchFocus ? 'pb-2' : 'pb-0'}  
                    `}
                    />
                    <span
                        onClick={() => setShowMatchPassword(!showMatchPassword)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer pr-2">
                        <img src={eye} alt="Toggle Password Visibility" />
                    </span>
                    </div>
                    <button disabled={!validName || !validEmail || !validPwd || !validMatch ? true : false}
                        className="flex justify-end mt-20 ">
                        <img src={ArrowButton} alt="arrow button" />
                    </button>
                </form>
            </div>
            <div className="w-[65.5vw] h-full bg-right bg-cover fixed top-0 right-0 ">
                <img src={bg} alt="bg" className="w-full h-full object-cover" />
            </div>
        </div>
    )
}

export default SignUp;