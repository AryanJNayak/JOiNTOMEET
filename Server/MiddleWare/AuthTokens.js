const mongoose = require('mongoose');
const Student = mongoose.model('Student');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must Log in key not given" });
    }

    const token = authorization.replace("Bearer ", "");
    console.log("this");

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must Log in token invalid" });
        }

        try {
            const { _id } = payload;
            console.log(payload);
            Student.findById(_id).then(studData => {
                req.student = studData;
                next();
            })
        } catch (err) {
            console.log(err);
        }

    })
}