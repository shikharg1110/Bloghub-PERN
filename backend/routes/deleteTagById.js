const pool = require("../db");

const deleteTagById = async(req, res) => {
    try {
        const{ tagId } = req.body;
        console.log(tagId);
        const response = await pool.query("DELETE FROM tags WHERE tag_id = $1", [tagId]);
        console.log(response);
        if(response.rowCount > 0)
            res.status(200).send("successfully deleted");
        else
            res.status(404).send("not deleted");
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = {deleteTagById};