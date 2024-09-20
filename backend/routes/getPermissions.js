const pool = require('../db');

const getPermissions = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM permissions");
        res.send(result);
    }
    catch(err) {
        console.error("Getting error while fetching permission: ", err);
    }
}

module.exports = {getPermissions};