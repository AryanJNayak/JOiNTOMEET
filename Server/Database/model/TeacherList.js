const mongoose = require('mongoose');

const teacherListSchema = new mongoose.Schema({
    teacher_Name: {
        type: String,
        require: true,
        trim: true,
    },
    teacher_Email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    }
})

module.exports = teacherListSchema;
