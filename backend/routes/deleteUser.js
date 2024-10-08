const pool = require("../db");

const deleteUser = async(req, res) => {
    try {
        const{ userId } = req.body;
        console.log(userId);
        const response = await pool.query("UPDATE users SET is_active = FALSE WHERE user_id = $1", [userId]);
        if(response.rowCount > 0)
            res.status(200).send("user successfully deactivated");
        else
            res.status(404).send("user not deleted");
    }
    catch(err) {
        console.log("Error in deactivating the user: ", err);
        return res.status(500).send("Error in deactivating the user");
    }
}

module.exports = {deleteUser};