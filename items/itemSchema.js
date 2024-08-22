const mongoose = require("mongoose");

const loginSchema = mongoose.Schema({
    userId:{
        type: String,
        required: [true, "Please add associated user."],
    },

    title:{
        type: String,
        required: true,
    },

    username:{
        type:String,
        default:"",

    },
    email:{
        type:String,
        default:"",
        
    },
    password:{
        type:String,
        default:"",
        

    },
    comments:{
        type:String,
        default:"",
    
    },
    type:{
        type:String,
        required:true,
    },
    folder:{
        type:String,
        required:true,
        default:"default"
    }
   
},
{ 
    collection: 'items'
 },
{
    timestamps: true
},
);

const cardSchema = mongoose.Schema({
    
    userId:{
        type: String,
        required: [true, "Please add associated user."],
    },
    
    title:{
        type: String,
        required: [true, "Please add the title of the object."],
        
    },

    cardNumber:{
        type:String, // Change to number?
        default:"",
        
    },
    
    CVV:{
        type:String, // Change to number?
        default:"",
        
    },
    expiryDate:{
        month:{type: Number, default: 0},
        year: {type:Number, default:0},
        
    },
    PIN:{
        type:String, // Change to number?
        default:"",
        
    },
    comments:{
        type:String, 
        default:"",
    },
    type:{
        type:String,
        required:true,
    },
    folder:{
        type:String,
        required:true,
        default:"default"
    }
},
{ 
    collection: 'items' 
},
{
    timestamps: true
},
);

const noteSchema = mongoose.Schema({
    
    userId:{
        type: String,
        required: [true, "Please add associated user."],
    },
    
    title:{
        type: String,
        required: [true, "Please add the title of the object."],
    },
    comments:{
        type:String,
        default:""
    },
    type:{
        type:String,
        required:true,
    },
    folder:{
        type:String,
        required:true,
        default:"default",
    }
},
{ 
    collection: 'items' 
},
{
    timestamps:true

},);

const Login = mongoose.model("Login", loginSchema);
const Card = mongoose.model("Card", cardSchema);
const Note = mongoose.model("Note", noteSchema);

module.exports = {Login, Card, Note};