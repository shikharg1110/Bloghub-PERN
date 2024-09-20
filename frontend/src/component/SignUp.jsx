import { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

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

        if (!validateFullname(fullname)) {
            alert("Full name should be at least 3 characters long and contain only alphabets and spaces.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            alert("Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.");
            return;
        }

        if (password !== confirmpassword) {
            alert("Passwords do not match.");
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
                if(newUser.status === 201) {
                    alert("Register Succeessfully");
                    navigate('/login');
                }
            }
            catch(err) {
                console.error("Error during signup: ",err);
                alert("Not registered successfully. Please try again");
            }
        }
        else if(fullname === "") {
            alert("Full name should not be empty");
        }
        else if(email === "") {
            alert("Email should not be empty");
        }
        else if(password === "") {
            alert("Password should not be empty");
        }
        else if(confirmpassword === "") {
            alert("Confirm Password should not be empty");
        }
        else if(confirmpassword !== password)    {
            alert("Confirm Passoword and Password are not the same");
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
                            type={showPassword ? "text": "password"} 
                            className="form-control"
                            id="signupConfirmInputPassword1" 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                            {showPassword ? <IoEye />: <IoEyeOff />}
                        </span>
                    </div>
                    <button onClick={(e) => handleSignUp(e)} className="btn btn-primary mb-3">Submit</button>
                    <a href="/login" className="text-muted mx-4">Already have an account! Click here for login</a>
                </form>
            </div>
        </>
    );
}

export default SignUp;