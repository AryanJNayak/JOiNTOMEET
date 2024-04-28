const mongoose = require('mongoose');
const sheduleSchema = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
        trim: true,
    },
    start: {
        type: Date,
        require: true,
        trim: true,
    },
    end: {
        type: Date,
        require: true,
        trim: true,
    },
    name: {
        type: String,
        require: true,
        trim: true,
    }, 
    email: {
        type: String,
        require: true,
        trim: true,
    }
})

module.exports = sheduleSchema;