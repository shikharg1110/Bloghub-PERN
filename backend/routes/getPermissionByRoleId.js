const pool = require('../db');

// it is for the logged in user
const getPermissionsByRoleId = async (req, res) => {
    try {
        const {id} = req.params;
        
        // const result = await pool.query("SELECT role_id FROM user_roles WHERE user_id = $1", [id]);

        // if(result.rows.length === 0) {
        //     return res.status(404).send("role not found for user");
        // }

        // const roleId = result.rows[0].role_id;

        const response = await pool.query("SELECT permission_id FROM role_permissions WHERE role_id = $1", [id])

        if(response.rows.length === 0) {
            return res.status(404).send("Permissions not found for this role");
        }

        const permissions = response.rows.map(row => row.permission_id);

        console.log("permissions: ", permissions);

        res.status(200).send({role_id: id, permissions});
    }
    catch(err) {
        console.error(err);
    }
}

module.exports = {getPermissionsByRoleId};