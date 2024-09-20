const bcrypt = require('bcrypt');
const pool = require('../db');

const signUp = async(req, res) => {
    try {
        const { user_name, email_id, user_password} = req.body;
        const hashPassword = await bcrypt.hash(user_password, 10);
        const role_id = 5; // role_id = 5 for user
        const newUser = await pool.query("INSERT INTO users (user_name, email_id, user_password, role_id) VALUES ($1, $2, $3, $4) RETURNING *", [user_name, email_id, hashPassword, role_id] );
        res.status(201).json({message: "USER regiestered successfully", user: newUser});
    }
    catch(err) {
        console.error(err);
    }
}

module.exports = {signUp};