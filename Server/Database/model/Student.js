const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
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

//just before saving
studentSchema.pre('save', async function (next) {
    const student = this;

    if (!student.isModified('password')) {
        return next();
    }

    student.password = await bcrypt.hash(student.password, 8);

    next();
})

const Student = new mongoose.model("Student", studentSchema);

module.exports = Student;