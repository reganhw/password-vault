const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");


const errorHandler =  (err,req,res,next)=>{
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
            break;
    }
}



async function connectDb(){
    const db = await mongoose.connect(process.env.CONNECTION_STRING).catch(error => errorHandler(error));
    console.log ("Database name: ", db.connection.name);
}
const validId = asyncHandler(async(req,res,next)=>{
    const id = req.params.id;
    if(id.length!=24){
        return res.status(400).json({message:"ID must be 12 bytes."});
    }
    next();
});

const validToken = asyncHandler(async(req,res,next)=>{
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN, (err,decoded) =>{
            if(err){
                return  res.status(401).json({ message: "Not authorised." });
            }
            req.payload = decoded.payload;
            //console.log("Token validated.");
            next();
            
        });
    } else {
        res.status(400);
        throw new Error("Invalid authorisation header.");
    }
});
module.exports = {errorHandler, connectDb, validId, validToken};