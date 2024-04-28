const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    phone: {
        type: String,
        require: true,
        maxlength: 10,
        minlength: 10,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
})

module.exports = teacherSchema;