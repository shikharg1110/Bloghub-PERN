const pool = require("../db");

const readAllBlogs = async(req, res) => {
    try {

        const {query} = req.query;
        let blogs;
        if(query && query.length >= 3) {
            blogs = await pool.query("SELECT * FROM blogs WHERE title ILIKE $1", [`%${query}%`]);
        }
        else {
            blogs = await pool.query("SELECT * FROM blogs");
        }

        res.status(200).send(blogs.rows);
    } catch (error) {
        console.error("Error while fetching all the blogs from db: ",error);
        res.status(500).json({error: "Server error. Unable to fetch blogs."});
    }
}

module.exports = {readAllBlogs};