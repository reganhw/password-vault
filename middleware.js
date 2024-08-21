const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statusCode ? res.statusCode: 500;
    switch (statusCode) {
        case 400:
            return res.json({
                title: "Bad request.", 
                message:err.message, 
                stackTrace:err.stack});
        case 401:
            return res.json({
                title: "Unauthorised.",
                message: err.message, 
                stackTrace:err.stack});
        case 403:
            return res.json({
                title: "Forbidden request.",
                message: err.message, 
                stackTrace:err.stack});

        case 404:
            return res.json({
                title: "Not Found.",
                message: err.message, 
                stackTrace:err.stack});
        
        case 500:
            return res.json({
                title:"Server error.", 
                message:err.message,
                stackTrace:err.stack});
            
        default:
            console.log("No errors were found.");
            break;
    }
    
    
}; 

const mongoose = require('mongoose');

async function connectDb(){
    const db = await mongoose.connect(process.env.CONNECTION_STRING).catch(error => errorHandler(error));
    console.log ("Database name: ", db.connection.name);
}
module.exports = {errorHandler, connectDb};