const pool = require('../db');

const viewBlog = async(req, res) => {
    try {
        const {id} = req.params;
        const blog = await pool.query("SELECT * FROM blogs WHERE blog_id = $1" , [parseInt(id)]);    
        console.log(blog.rows);
        res.status(200).send(blog.rows);
    } 
    catch (error) {
        console.error(error);
    }
}

module.exports = {viewBlog};