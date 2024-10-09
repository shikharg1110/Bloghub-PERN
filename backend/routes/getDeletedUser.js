const pool = require("../db")

const getDeletedUser = async(req, res) => {
    try {
        const response = await pool.query("SELECT * FROM users WHERE is_active = FALSE");
        console.log(response.rows);
        res.status(200).send(response.rows);
    }
    catch(err) {
        console.log("Error in fetching inactive user: ", err);
        return res.status(500).send("Error while fetching inactive user: ", err);
    }
}

module.exports = {getDeletedUser};