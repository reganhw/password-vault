const express = require("express");
const dotenv = require("dotenv").config();

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

app.use(express.json());
app.listen(port, () =>{
    console.log(`Server running on port ${port}.`);
})
