const pool = require("../db");

const readAllBlogs = async(req, res) => {
    try {

        const {query, page=1, limit=6} = req.query;
        const offset = (page-1) * limit;

        let blogs;
        if(query && query.length >= 3) {
            blogs = await pool.query("SELECT * FROM blogs WHERE title ILIKE $1 LIMIT $2 OFFSET $3", [`%${query}%`, limit, offset]);
        }
        else {
            blogs = await pool.query("SELECT * FROM blogs LIMIT $1 OFFSET $2", [limit, offset]);
        }

        res.status(200).send(blogs.rows);
    } catch (error) {
        console.error("Error while fetching all the blogs from db: ",error);
        res.status(500).json({error: "Server error. Unable to fetch blogs."});
    }
}

module.exports = {readAllBlogs};