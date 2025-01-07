const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        minlength: 6,
        unique: true   /// khong cho phep trung 
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    }
}, { timestamps: true })

module.exports = mongoose.model("User",userSchema)