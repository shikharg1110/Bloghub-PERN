const pool = require('../db');

const editRole = async(req, res) => {
    try {
        const {selectedRole, permissions}  = req.body;

        const result = await pool.query("DELETE FROM role_permissions WHERE role_id = $1", [selectedRole]);

        const permissionQueries = permissions.map(permissionId => {
            return pool.query(
                "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)", [selectedRole, permissionId]
            );
        });

        await Promise.all(permissionQueries);

        
        console.log("Role created: ", result.rows[0]);
        console.log("Permissions added: ", permissions);
    
        res.status(200).send("Role and permission created successfully");
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = {editRole};