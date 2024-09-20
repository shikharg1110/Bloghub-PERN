import { useContext, useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { getCookie } from "../utility/cookieUtils";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {setUser, setUserRole} = useContext(UserContext);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    const handleLogin = async(e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            alert("Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.");
            return;
        }

        if(email !== "" && password !== "") {
            try {
                const user = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/login`, {
                    email_id: email,
                    user_password: password
                }, {
                    withCredentials: true
                })
                if(user.status === 200) {
                    alert("User login successfully");
                    const sessionId = getCookie('connect.sid');
                    const userRole = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/profile`, {withCredentials: true});
                    console.log("userrole: ", userRole.data.user.role);
                    setUserRole(userRole.data.user.role);
                    setUser(sessionId);
                    navigate('/');
                }
            }
            catch(err) {
                if(err.response.status === 500) {
                    alert("user is not registered");
                    navigate('/signup');
                }
                else {
                    alert("Failed login. Please try again")
                    console.error(err);
                }
            }
        }
        else if(email === "") {
            alert("Email should not be empty");
        }
        else if(password === "") {
            alert("Password should not be empty");
        }

    }

    return (
        <>
            <div className="container mb-3">
                <h1 className="text-center">Login</h1>
                <form id="loginForm">
                    <div className="mb-3">
                        <label htmlFor="loginInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="loginInputEmail1" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="loginInputPassword1" className="form-label">Password</label>
                        <input 
                            type={showPassword ? "text" : "password"}
                            className="form-control" 
                            id="loginInputPassword1" 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                            {showPassword ? <IoEye />: <IoEyeOff />}
                        </span>
                    </div>
                    <button onClick={(e) => handleLogin(e)} className="btn btn-dark mb-3">Submit</button>
                    <a href="/signup" className="text-muted mx-4">Don't have an account! Click here for Sign Up</a>
                </form>
            </div>
        </>
    );
}

export default Login;