const pool = require('../db');

const getUser = async(req, res) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE is_active = TRUE");
        res.status(200).send(user.rows);
    }
    catch(err) {
        console.error("Error while fetching role: ", err);
    }
}

module.exports = {getUser};   
