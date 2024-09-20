const uploadImage = (req, res) => {
    try {
        console.log("image uploaded successfully");
        res.send(req.file.filename);
    } 
    catch (error) {
        console.error(error);
    }
}

module.exports = {uploadImage};