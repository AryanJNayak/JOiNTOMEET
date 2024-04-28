const mongoose = require('mongoose');
const collegeSchema = new mongoose.Schema({
    college_Name: {
        type: String,
        require: true,
        trim: true,
    },
    admin_Name: {
        type: String,
        require: true,
        trim: true,
    },
    admin_Mail: {
        type: String,
        require: true,
        trim: true,
    }
})
const College = new mongoose.model("College", collegeSchema);
module.exports = College;