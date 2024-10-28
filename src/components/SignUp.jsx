import { useRef, useState, useEffect } from "react";
import ArrowButton from '../assets/ArrowButton.svg';
import axios from "axios";
import bg from '../assets/bg.svg'
import eye from '../assets/eye.svg';
import { Link } from "react-router-dom";

const userRegex = /^[A-z][A-z0-9-_]{3,23}$/;
const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
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
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
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
        <div className="flex justify-between">
        <div className="min-h-screen max-w-40% flex items-center">
            <h1 className="w-[176px] h-[49px] absolute top-[93px] left-[84px] opacity-100 
              font-sans text-[40px] font-bold leading-[48.76px] text-left 
              sm:text-[36px] md:text-[32px] lg:text-[40px]">
                Register
            </h1>
            <form onSubmit={handleSubmit} className=" w-[303px] h-[220px] absolute top-[201px] left-[84px] gap-4  flex flex-col border-1.5 p-2">
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
                        border-gray-800 focus:outline-none focus:ring-0 
                        ${userFocus ? 'pb-2' : 'pb-0'}  
                    `}
                />
                <label htmlFor="email"  className={`transform -translate-y-1/2 transition-opacity duration-200 ${emailFocus ? 'opacity-100' : 'opacity-0'
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
                        border-gray-800 focus:outline-none focus:ring-0 
                        ${emailFocus ? 'pb-2' : 'pb-0'}  
                    `}
                />
                <label htmlFor="pwd"  className={`transform -translate-y-1/2 transition-opacity duration-200 ${pwdFocus ? 'opacity-100' : 'opacity-0'
                    } text-24 font-medium text-500`}
                    style={{
                        fontSize: '24px',
                        lineHeight: '26.26px',
                        textAlign: 'left',
                    }}
                    >
                    Password
                </label>
                <input
                    type="password"
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
                        border-gray-800 focus:outline-none focus:ring-0 
                        ${pwdFocus ? 'pb-2' : 'pb-0'}  
                    `}
                />
                <label htmlFor="confirm_pwd"  className={`transform -translate-y-1/2 transition-opacity duration-200 ${matchFocus ? 'opacity-100' : 'opacity-0'
                    } text-24 font-medium text-500`}
                    style={{
                        fontSize: '24px',
                        lineHeight: '26.26px',
                        textAlign: 'left',
                    }}>
                    Confirm Password
                </label>
                <input
                    type="password"
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
                        border-gray-800 focus:outline-none focus:ring-0 
                        ${matchFocus ? 'pb-2' : 'pb-0'}  
                    `}
                />
                <button disabled={!validName || !validEmail || !validPwd || !validMatch ? true : false}
                    className="flex justify-end ">
                    <img src={ArrowButton} alt="arrow button" />
                </button>
            </form>
        </div>
        <img src={bg} alt="bg" />
        </div>
    )
}

export default SignUp;