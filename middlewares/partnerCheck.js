const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.jwt_key)
        req.UserData = decoded;
        const user = await userModel.findById(decoded.userId)
        if (user.role === 'partner')
            next();
        else
            return res.status(401).json({
                msg: 'Not authorized'
            })
    }
    catch (error) {
        return res.status(401).json({
            msg: 'Not authorized'
        })
    }
}