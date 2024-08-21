const mongoose = require('mongoose');
/*
const connectDb = async() =>{
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database connected: ",
            connect.connection.host,
            connect.connection.name
        );
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};
*/

async function connectDb(){
    const db = await mongoose.connect(process.env.CONNECTION_STRING).catch(error => handleError(error));
    console.log ("Database name: ", db.connection.name);
}
module.exports = connectDb;