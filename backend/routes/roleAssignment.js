const pool = require('../db');

const roleAssignment = async (req, res) => {
    const {email_id, role_id} = req.body;
    console.log("email: ", email_id," role: ", role_id);

    try {
        const userprofile = await pool.query("SELECT user_id FROM users WHERE email_id = $1", [email_id]);
        const userId = userprofile.rows[0].user_id;
        console.log("user id: ", userId);
        const check = await pool.query("SELECT * FROM user_roles WHERE user_id = $1", [userId]);
        console.log("check: ", check.rows);
        if(check.rows.length >0) {
            const result = await pool.query("UPDATE user_roles SET role_id = $1 WHERE user_id = $2", [role_id, userId]);
            res.status(200).send("Role Updated successfully");
        }
        else {
            const result = await pool.query("INSERT INTO user_roles (user_id,role_id) VALUES ($1, $2) RETURNING *", [userId, role_id]);
            console.log("Result: ",result);
            res.status(200).send("Role Updated successfully");
        }
    }
    catch(err) {
        console.error("Error while assigning role: ", err);
    }
}

module.exports = {roleAssignment};