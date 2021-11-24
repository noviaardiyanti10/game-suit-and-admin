const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { fail } = require('../controllers/responseBuilder');
require("dotenv").config();


const authToken = (req, res, next) => {

    try {
        const verified = jwt.verify(req.headers['authorization'], process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(req.user);
        next();
    } catch (err) {
        res.status(401).json({
            status: 'Fail',
            message: "Invalid token"
        })
    }
}



module.exports = authToken;