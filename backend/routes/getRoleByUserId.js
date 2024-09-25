const pool = require('../db');

const getRoleByUserId = async(req, res) => {
    try {
        const {id} = req.params;
        const response = await pool.query("SELECT role_id FROM user_roles WHERE user_id = $1", [id]);
        console.log(response);
        res.status(200).send(response);
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = {getRoleByUserId};