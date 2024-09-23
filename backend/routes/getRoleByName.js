const pool = require('../db');

const getRoleByName = async (req, res) => {
    try {
        const {name} = req.params;
        const role = await pool.query("SELECT * FROM roles WHERE role_name = $1", [name]);
        console.log(role);
        res.status(200).send(role);
    }
    catch(err) {
        console.error(err);
    }
}

module.exports = {getRoleByName};