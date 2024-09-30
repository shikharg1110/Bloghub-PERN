const pool = require("../db");

const createTag = async(req, res) => {
    try {
        const {tag} = req.body;
        console.log(tag);
    
        const response = await pool.query("INSERT INTO tags (tag_name) VALUES($1) RETURNING tag_id", [tag]);
        console.log(response);
        res.status(200).send("Tag Created");
    }
    catch(err) {
        console.log("Error in creating tag: ", err);
        res.status(500).send("Error in creating the tag");
    }
}

module.exports = {createTag};