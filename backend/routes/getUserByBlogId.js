const pool = require('../db');

const getUserByBlogId = async(req, res) => {
    try {
        const {id} = req.params;
        console.log("blog_id: ",id);
        const response = await pool.query("SELECT user_id FROM user_blogs WHERE blog_id = $1", [id]);
        console.log(response);
        res.status(200).send(response);
    }
    catch(err) {
        console.log("error while getting user from blog id: ",err);
    }
}
module.exports = {getUserByBlogId};