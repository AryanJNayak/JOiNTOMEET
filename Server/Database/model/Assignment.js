const mongoose = require('mongoose');
const assignmentSchema = new mongoose.Schema({
    assignment_Title: {
        type: String,
        require: true,
        trim: true,
    },
    assignment_Instruction: [{
        type: String,
        required: true,
        trim: true,
    }],
    assignment_Deadline: {
        type: String,
        require: true,
        trim: true,
    },
    data:{
        type:Buffer
    }
})

module.exports = assignmentSchema;