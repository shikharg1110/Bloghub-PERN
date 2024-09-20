const pool = require('../db');

const getRole = async (req, res) => {
    try {
        const role = await pool.query("SELECT * FROM roles");
        res.status(200).send(role.rows);
    }
    catch(err) {
        console.error("Error while fetching role: ", err);
    }
}

module.exports = {getRole};