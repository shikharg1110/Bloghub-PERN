const passport = require('passport');

// Validation functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const login = async (req, res, next) => {
    const {email_id, user_password} = req.body;

    if(!validateEmail(email_id)) {
        return res.status(400).json({message: "Please enter a valid email id"});
    }

    if(!validatePassword(user_password)) {
        return res.status(400).json({message: "Please enter a valid password"});
    }

    passport.authenticate('local', (err, user, info) =>{
        if(err) {
            console.log("Error logging in: ", err);
            return res.status(500).json({message: "Internal Server Error"});
        }
        if(!user) {
            const statusCode = info?.statusCode || 401;
            return res.status(statusCode).json({message: 'Authentication Failed'});
        }

        req.logIn(user, err => {
            console.log("User session after login: ", req.session);
            if(err) {
                return res.status(500).json({message: "Error logging in"});
            } 
            req.session.save(() => {
                return res.status(200).json({message: "Login successful", user});
            })
        }) 
    })(req, res, next);
};

module.exports = {login};