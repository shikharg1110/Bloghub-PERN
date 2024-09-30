const pool = require("../db");

const editTag = async(req, res) => {
    const {tagId, tagName} = req.body;
    console.log(tagId, tagName);

    try {
        const result = await pool.query("UPDATE tags SET tag_name = $1, updated_at = CURRENT_TIMESTAMP WHERE tag_id = $2", [tagName, tagId]);
    
        if(result.rowCount > 0) {
            res.status(200).send("Tag updated successfully");
        }
        else {
            res.status(404).send("Tag not found");
        }
    }
    catch(err){
        console.error("Error updating tags: ", err);
        res.status(500).send("Server Error");
    }
}

module.exports = {editTag};