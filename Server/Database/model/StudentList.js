const mongoose = require('mongoose');

const studentListSchema = new mongoose.Schema({
    student_Name: {
        type: String,
        require: true,
        trim: true,
    },
    student_Email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    student_RollNo: {
        type: String,
        require: true,
        unique: true,
        trim: true
    }
})

module.exports = studentListSchema;
