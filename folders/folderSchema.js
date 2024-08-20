const mongoose = require("mongoose");

const folderSchema = mongoose.Schema({
    /*
    user_id:{
        type: String,
        required: [true, "Please add associated user."],
        unique: [true, "An account with this email address already exists."],
    },
    */
    folderName:{
        type: String,
        required: [true, "Please add the name of the folder."],
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("Folder", folderSchema);