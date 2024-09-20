const pool = require('../db');

const createRole = async(req, res) => {

    try {

        const {roleName, permissions} = req.body;
    
        const result = await pool.query("INSERT INTO roles(role_name) VALUES($1) RETURNING *", [roleName]);
        const roleId = result.rows[0].role_id;
    
        const permissionQueries = permissions.map(permissionId => {
            return pool.query(
                "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)", [roleId, permissionId]
            );
        });
    
        await Promise.all(permissionQueries);
    
        console.log("Role created: ", result.rows[0]);
        console.log("Permissions added: ", permissions);
    
        res.status(200).send("Role and permission created successfully");
    }
    catch(err) {
        console.error("Error creating role and permssions: ", err);
        res.status(500).send("Error while creating role");
    }

}

module.exports = {createRole};