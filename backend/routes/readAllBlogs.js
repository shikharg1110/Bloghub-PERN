const pool = require("../db");

const readAllBlogs = async(req, res) => {
    try {
        const blogs = await pool.query("SELECT * FROM blogs");
        res.status(200).send(blogs.rows);
    } catch (error) {
        console.error("Error while fetching all the blogs from db: ",error);
    }
}

module.exports = {readAllBlogs};