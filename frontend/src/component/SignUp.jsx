import { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, {Toaster} from 'react-hot-toast';

const SignUp = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }


    const validateFullname = (name) => {
        const fullnameRegex = /^[a-zA-Z\s]{3,}$/;
        return fullnameRegex.test(name);
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    const handleSignUp = async (e) => {
        e.preventDefault();

        if(fullname.length < 3) {
            toast.error("Full name should be at least 3 characters long");
            return;
        }

        if (!validateFullname(fullname)) {
            toast.error("Full name should contain only alphabets and spaces");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address")
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        if (!validatePassword(password)) {
            toast.error("Password must include at least one uppercase letter, one number, and one special character");
            return;
        }

        if (password !== confirmpassword) {
            toast.error("Passwords do not match");
            return;
        }

        if(fullname !== "" && email !== "" && password !== "" && confirmpassword !== "" && password === confirmpassword) {
            try {
                const newUser = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/signup`, {
                    user_name: fullname,
                    email_id: email,
                    user_password: password
                })
                console.log(newUser);
                
                const roleAssgin = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/roleAssignment`, {
                    email_id: email,
                    role_id: 0
                }, {
                    withCredentials: true
                });
    
                console.log("role assignment: ",roleAssgin);

                if(newUser.status === 201) {
                    toast.success("Registered Succeessfully");
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            }
            catch(err) {
                console.error("Error during signup: ",err);
                toast.error("Not registered successfully. Please try again");
            }
        }
    }

    return (
        <>
            <div className="container">
                <h1 className="text-center">Sign Up</h1>
                <form id="signupForm">
                    <div className="mb-3">
                        <label htmlFor="signupInputName" className="form-label">Full Name</label>
                        <input type="text" className="form-control" id="signupInputName"  onChange={(e) => setFullname(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="signupInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="signupInputEmail1" onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="signupInputPassword1" className="form-label">Password</label>
                        <input 
                            type={showPassword ? "text": "password"} 
                            className="form-control"
                            id="signupInputPassword1"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                            {showPassword ? <IoEye />: <IoEyeOff />}
                        </span>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="signupConfirmInputPassword1" className="form-label">Confirm Password</label>
                        <input 
                            type={showConfirmPassword ? "text": "password"} 
                            className="form-control"
                            id="signupConfirmInputPassword1" 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span onClick={toggleConfirmPasswordVisibility} className="password-toggle-icon">
                            {showConfirmPassword ? <IoEye />: <IoEyeOff />}
                        </span>
                    </div>
                    <button onClick={(e) => handleSignUp(e)} className="btn btn-primary mb-3">Submit</button>
                    <a href="/login" className="text-muted mx-4">Already have an account! Click here for login</a>
                </form>
                <Toaster />
            </div>
        </>
    );
}

export default SignUp;