const mongoose = require('mongoose');
const errorHandler = require("./errorHandler");

async function connectDb(){
    const db = await mongoose.connect(process.env.CONNECTION_STRING).catch(error => errorHandler(error));
    console.log ("Database name: ", db.connection.name);
}
module.exports = connectDb;