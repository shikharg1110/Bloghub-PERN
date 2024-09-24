import { useContext, useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { getCookie } from "../utility/cookieUtils";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast, {Toaster} from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {setUser, userRole, setUserRole, setHasPermission} = useContext(UserContext);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

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
            toast.error("Please enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        if (!validatePassword(password)) {
            toast.error("Password must include at least one uppercase letter, one number, and one special character.");
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
                    toast.success("User login successfully");

                    const sessionId = getCookie('connect.sid');
                    const userRole = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/profile`, {withCredentials: true});
                    console.log("userrole: ", userRole.data.user.role);
                    // console.log("userrole info: ", userRole.data.user.id);
                    setUserRole(userRole.data.user.role);
                    // setUser(sessionId);
                    setUser(userRole.data.user.id);
                    handleRolePermission(userRole.data.user.role);

                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                }
            }
            catch(err) {
                if(err.response) {

                    const statusCode = err.response.status;
                    const message = err.response.data.message;

                    if(statusCode === 404) {
                        toast.error("User not found: "+ message);
                    }
                    else if(statusCode === 401) {
                        toast.error("Incorrect password: " + message);
                    }
                    else {
                        toast.error(message)
                        console.error(err);
                    }
                }
                else {
                    toast.error("Network or server error. Please try again later");
                }
            }
        }
    }

    const handleRolePermission = async(userroleid)=>{
        try {
            console.log("userRole: ",userroleid);
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getPermissionsByRoleId/${userroleid}`);
            // console.log(response.data.permissions);
            setHasPermission(response.data.permissions);
        }
        catch(err) {
            console.log(err);
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
                <Toaster />
            </div>
        </>
    );
}

export default Login;