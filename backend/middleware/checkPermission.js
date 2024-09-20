const pool = require('../db');

const checkPermission = (permissionID) => {
    return async(req, res, next) => {
        const userId = req.user.user_id;
        
        try {
            const userRoleQuery = await pool.query("SELECT role_id FROM user_roles WHERE user_id = $1", [userId]);

            if(userRoleQuery.rows.length === 0) 
                return res.status(404).json({message: "User not found"});
            
            const roleId = userRoleQuery.rows[0].role_id; 

            const rolePermissionQuery = await pool.query("SELECT permission_id FROM role_permissions WHERE role_id = $1", [roleId]);

            if(rolePermissionQuery.rows.length === 0)
                return res.status(403).json({message: "Forbidden: No permission is assigned to this role"});
            
            const permissionIds = rolePermissionQuery.rows.map(row => row.permission_id);

            if( permissionIds.includes(permissionID))
                return next();
            else    
                return res.status(403).json({message: "Forbidden: you do not have permission"});
        }
        catch(err) {
            console.error("Error while fetching user role data: ",err);
            return res.status(500).json({message: "internal sever error"});
        }
    }
}

module.exports = checkPermission;