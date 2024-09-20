const getHere = async(req, res)=> {
    try{
        res.send("This is plain text res");
    }
    catch(err){
        console.error(err.message);
    }
}

module.exports = {getHere}