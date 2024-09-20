const passport = require('passport');

const logout = (req, res, next) => {
    
    if(req.isAuthenticated()) {
        req.logout((err) => {
            if(err)  {
                console.log("Error during log out:", err);
                return next(err);
            }

            req.session.destroy((err)=> {
                if(err) {
                    console.log("Error during destroying the session: ", err);
                    return next(err);
                }
                console.log("log out successfully");
                res.status(200).json({message: "Logged out successfully"});
            })
        })
    }
    else {
        console.log("not authenticated");
        res.status(401).json({message: "Not authenticated"});
    }
}

module.exports = {logout};