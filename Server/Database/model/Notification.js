//announcements

const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    notification: {
        type: String,
        require: true,
        trim: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
})

module.exports = notificationSchema;