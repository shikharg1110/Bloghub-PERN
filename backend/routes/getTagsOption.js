const pool = require("../db")

const getTagsOptions = async(req, res) => {
    try {
        const getTags = await pool.query("SELECT * FROM tags");
        res.send(getTags);
        console.log(getTags);
    }
    catch(err) {
        console.log("Error in fetching all the tags: ",err);
    }
}

module.exports = {getTagsOptions};