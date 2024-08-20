const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, "Please add an email."],
        unique: [true, "An account with this email address already exists."],
    },
    password:{
        type: String,
        required: [true, "Please add a password."],
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);