const pool = require('../db');

const assignPermissions = async(req, res) => {
    const {role_id, permissions} = req.body;
}

module.exports = {assignPermissions};