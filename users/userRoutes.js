const express = require("express");
const router = express.Router();
const{makeUser, signInUser, getUser, updateUser, deleteUser}=require("./userFunctions");


router.post("/register",makeUser);

router.post("/signin",signInUser);


router.get("/account/:id",getUser);

router.put("/account/:id", updateUser);

router.delete("/account/:id", deleteUser);
module.exports = router;