const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const UserModel = require('../models/userModel')
module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.jwt_key)
        id = decoded.userId
        user = await UserModel.findById(id).exec()
        if (user.isAdmin)
            next();
        else{
            throw('aa')
        } 
    }
    catch (error) {
        return res.status(401).json({
            msg: 'Not authorized'
        })
    }
}