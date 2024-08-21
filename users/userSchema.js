const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    folders:{
        type:[String],
        default:["default"],
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);