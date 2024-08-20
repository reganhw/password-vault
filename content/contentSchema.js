const mongoose = require("mongoose");

const loginSchema = mongoose.Schema({
    /*
    user_id:{
        type: String,
        required: [true, "Please add associated user."],
    },
    */
    name:{
        type: String,
        required: [true, "Please add the name of the object."],
    },

    username:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,

    },
    comments:{
        type:String,
    },
    type:"login",
},
{
    timestamps: true,
});

const cardSchema = mongoose.Schema({
    /*
    user_id:{
        type: String,
        required: [true, "Please add associated user."],
    },
    */
    name:{
        type: String,
        required: [true, "Please add the name of the object."],
    },

    cardNumber:{
        type:String, // Change to number?
    },
    
    CVV:{
        type:Number,
    },
    expiryDate:{
        month: Number,
        year: Number,
    },
    PIN:{
        type:Number,
    },
    comments:{
        type:String,
    },
    type: "card",
},
{
    timestamps: true,
});

const noteSchema = mongoose.Schema({
    /*
    user_id:{
        type: String,
        required: [true, "Please add associated user."],
    },
    */
    name:{
        type: String,
        required: [true, "Please add the name of the object."],
    },
    comments:{
        type:String,
    },
    type:"note",
},
{
    timestamps: true,
});

const Login = mongoose.model("Login", loginSchema);
const Card = mongoose.model("Card", cardSchema);
const Note = mongoose.model("Note", noteSchema);

module.exports = {Login, Card, Note};