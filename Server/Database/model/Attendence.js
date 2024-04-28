const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    subject: String,
    name: String,
    email:String,
    date: {
        type: Date,
        default: function () {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
            const day = String(currentDate.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
            // return `2024-04-06`;
        },
    },
    attendance: [
        {
            studentEmail: String,
        },
    ],
})

module.exports = attendanceSchema;
