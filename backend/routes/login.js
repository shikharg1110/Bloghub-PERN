
const passport = require('passport');

const login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) =>{
        if(err) {
            console.log("Error logging in: ", err);
            return next(err);
        }
        if(!user) return res.status(401).json({message: 'Authentication Failed'});

        req.logIn(user, err => {
            console.log("User session after login: ", req.session);
            if(err) return next(err);
            req.session.save(() => {
                return res.status(200).json({message: "Login successful", user});
            })
        }) 
    })(req, res, next);
};

module.exports = {login};