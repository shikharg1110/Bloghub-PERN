const pool = require('../db');

const getUserById = async(req,res) => {
    try {
        const {id} = req.params;
        console.log("id: ",id);
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
        console.log("User by id: ",user.rows);
        res.status(200).send(user);
    }
    catch(err) {
        console.log("error in get user by id: ",err);
    }
}

module.exports = {getUserById};