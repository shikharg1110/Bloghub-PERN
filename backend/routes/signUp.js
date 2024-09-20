const bcrypt = require('bcrypt');
const pool = require('../db');

// Validation functions
const validateFullname = (name) => {
    const fullnameRegex = /^[a-zA-Z\s]{3,}$/;
    return fullnameRegex.test(name);
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const signUp = async(req, res) => {
    try {
        const { user_name, email_id, user_password} = req.body;

        if(user_name.length < 3) {
            return res.status(400).json({message: "Full name should be at least 3 characters long"})
        }
        if(!validateFullname(user_name)) {
            return res.status(400).json({message: "Full name should contain only alphabets and spaces"})
        }
        if (!validateEmail(email_id)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }
        if(user_password.length < 8) {
            return res.status(400).json({message: "Password must be at least 8 characters long"})
        }
        if (!validatePassword(user_password)) {
            return res.status(400).json({ message: "Password must include at least one uppercase letter, one number, and one special character." });
        }

        const hashPassword = await bcrypt.hash(user_password, 10);
        const role_id = 5; // role_id = 5 for user
        const newUser = await pool.query("INSERT INTO users (user_name, email_id, user_password, role_id) VALUES ($1, $2, $3, $4) RETURNING *", [user_name, email_id, hashPassword, role_id] );
        res.status(201).json({message: "User regiestered successfully", user: newUser});
    }
    catch(err) {
        console.error(err);
    }
}

module.exports = {signUp};