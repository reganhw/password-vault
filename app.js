const express = require("express");
const dotenv = require("dotenv").config();
const {errorHandler, connectDb} = require("./middleware");

connectDb();
const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;


app.use(express.json());
app.use("/api/users", require("./users/userRoutes"));
app.use("/api/items", require("./items/itemRoutes"));
app.use("/api/folders", require("./folders/folderRoutes"));
app.use(errorHandler);
app.listen(port, () =>{
    console.log(`Server up.`);
});

module.exports = app;
