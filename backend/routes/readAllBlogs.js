const pool = require("../db");

const readAllBlogs = async(req, res) => {
    try {

        const {query, tag, page=1, limit=6} = req.query;
        const offset = (page-1) * limit;

        console.log("Received query: ", query, " Tag: ", tag, " Page: ", page, " Limit: ", limit);

        let blogs;
        if(query && query.length >= 3) {
            // if both query and tags are provided then ->

            if(tag) {
                blogs = await pool.query(
                    "SELECT * FROM blogs WHERE title ILIKE $1 AND tag = $2 LIMIT $3 OFFSET $4",
                    [`%${query}%`, tag, limit, offset]
                );
            }
            else {
                blogs = await pool.query("SELECT * FROM blogs WHERE title ILIKE $1 LIMIT $2 OFFSET $3", [`%${query}%`, limit, offset]);
            }

        }
        else {

            // No query is provided only tag_id
            if(tag) {
                blogs = await pool.query(
                    "SELECT * FROM blogs WHERE tag = $1 LIMIT $2 OFFSET $3",
                    [tag, limit, offset]
                );
            }
            else {
                blogs = await pool.query("SELECT * FROM blogs LIMIT $1 OFFSET $2", [limit, offset]);
            }
        }

        res.status(200).send(blogs.rows);
    } catch (error) {
        console.error("Error while fetching all the blogs from db: ",error);
        res.status(500).json({error: "Server error. Unable to fetch blogs."});
    }
}

module.exports = {readAllBlogs};