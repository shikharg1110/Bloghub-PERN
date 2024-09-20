const pool = require('../db');

const editBlog = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, body, tag, img} = req.body;

        const result = await pool.query("UPDATE blogs SET title = $1, body = $2, tag = $3, img = $4 WHERE blog_id = $5", [title, body, tag, img, id]);
        res.status(200).send("Blog edited");
        
    }
    catch(err) {
        console.error(err);
    }
}

module.exports = {editBlog};