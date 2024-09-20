const pool = require('../db');

const deleteBlog = async(req, res) => {
    try {
        const {id} = req.params;

        const result = await pool.query("DELETE FROM blogs WHERE blog_id = $1", [id]);

        if(result.rowCount > 0) {
            res.status(200).send("Delete done");
        }
        else {
            res.status(404).send("blog not found");
        }
    }
    catch(err) {
        console.error(err);
    }
}

module.exports = {deleteBlog};