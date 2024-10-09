const pool = require("../db");

const myBlog = async(req, res) => {
    try {
        const {user} = req.query;
        const {query = "", tag = null, page = 1, limit = 6} = req.query;
        const offset = (page-1)*limit;

        const blogIdsResponse = await pool.query("SELECT blog_id FROM user_blogs WHERE user_id = $1", [user]);
        
        const blogIds = blogIdsResponse.rows.map((row) => row.blog_id);
        console.log(blogIds);

        if(blogIds.length > 0) {
            let sql = `SELECT * FROM blogs WHERE blog_id = ANY($1::int[])`;
            const queryParams =[blogIds];

            if(query) {
                sql += ` AND (title ILIKE $${queryParams.length + 1})`;
                queryParams.push(`%${query}%`);
            }

            if(tag) {
                sql += ` AND tag = $${queryParams.length + 1}`;
                queryParams.push(tag);
            }

            sql += ` LIMIT $${queryParams.length+1} OFFSET $${queryParams.length + 2}`;
            queryParams.push(limit, offset);

            const blogsResponse = await pool.query(sql , queryParams);
            res.status(200).json(blogsResponse.rows);
        }
        else {
            res.status(200).send({message: "no blogs found for this user"});
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).send({error: "Server error"});
    }
}

module.exports = {myBlog};