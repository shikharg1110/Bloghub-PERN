const pool = require('../db')

const createBlog = async(req, res) => {
    try {
        const userId = req.user.user_id;
        const {title, body, tag, img } = req.body;
        const newBlog = await pool.query("INSERT INTO blogs (title, body, tag, img) VALUES ($1, $2, $3, $4) RETURNING *", [title, body, tag, img]
        );
        if(newBlog.rowCount > 0) {
            const user_blogs = await pool.query("INSERT INTO user_blogs (user_id, blog_id) VALUES($1, $2) RETURNING *", [req.user.user_id, newBlog.rows[0].blog_id]);
            res.status(200).send(newBlog);
        }
    } 
    catch (error) {
        console.error(error.message);
    }
}

module.exports = {createBlog};