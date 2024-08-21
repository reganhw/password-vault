const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./errorHandler");
const mongoose = require("mongoose");
const connectDb = require("./connectDb");
const {Login,Card} = require("./content/contentSchema");


connectDb();
const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;


app.use(express.json());
app.use("/api/users", require("./users/userRoutes"));
app.use("/api/content", require("./content/contentRoutes"));
app.use("/api/folders", require("./folders/folderRoutes"));
app.use(errorHandler);
app.listen(port, () =>{
    console.log(`Server running on port ${port}.`);
});

module.exports = app;
