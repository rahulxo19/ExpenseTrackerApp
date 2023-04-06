const jwt = require("jsonwebtoken")
const User = require("../model/signup")

exports.Auth = async (req, res, next) => {
    try{
        const token = req.header("Auth");
        const user = jwt.verify(token, "d037087c3bb218554282")
        req.user = user;
        next();
    } catch(err) {
        console.log("auth error");
        res.json({ message: ' error in auth '})
    }
    
}