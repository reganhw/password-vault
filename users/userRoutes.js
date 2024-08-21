const express = require("express");
const router = express.Router();
const{makeUser, signInUser, showUser, updateUser, deleteUser}=require("./userFunctions");


router.post("/register",makeUser);

router.post("/signin",signInUser);


router.get("/account/:id",showUser);

router.put("/account/:id", updateUser);

router.delete("/account/:id", deleteUser);
module.exports = router;