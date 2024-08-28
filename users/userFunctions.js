const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./userSchema");

//@desc Register a user
//@route POST /api/users/register
//@access public

const makeUser = asyncHandler(async(req,res)=>{

    // Ensure both fields are present.
    const {email, password}=req.body; 
    if (!email || !password){
        res.status(400);
        throw new Error("Both fields are required.");
    }
    
    // Check for duplicate email address.
    const emailTaken = await User.findOne({ email }).exec();
    if(emailTaken){
        res.status(400);
        throw new Error("Email already registered.");
    }

    // Create user.
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        email,
        password:hashedPassword,
    });

    // Return created user.
    return res.status(201).json(
        {_id:user.id,
            email: user.email,
            password: user.password
        });

});

//@desc Sign a user in
//@route POST /api/users/signin
//@access public

const signInUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are required.");
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({
            payload:{
                id:user.id,
            },
        },
        process.env.TOKEN,
        {expiresIn: "60m"}
        );
        return res.status(200).json({accessToken});
    }else{
        res.status(401);
        throw new Error("Invalid email and password combination.");
    }
});

//@desc Get a user's description
//@route GET /api/users/account
//@access private

const getUser = asyncHandler(async(req,res) =>{
    const id = req.payload.id; 
    const user = await User.findById(id);
    return res.status(200).json({id:id, email:user.email});
});

//@desc Update a user's description
//@route PUT /api/users/account
//@access private

const updateUser = asyncHandler(async(req, res)=>{
    const id = req.payload.id;
    const {email,password} = req.body;
    if (!password){
        await User.findByIdAndUpdate(id,{email,password});
    }else{
        const hashedPassword = await bcrypt.hash(password,10);
        await User.findByIdAndUpdate(id,{email,password: hashedPassword});
    }
    return res.status(200).json({message:"Account successfully updated."});
});

//@desc Delete account.
//@route DELETE /api/users/account
//@access private
const deleteUser =asyncHandler(async(req, res)=>{
    const id = req.payload.id;

    // Delete items associated with the user.
    const Items = mongoose.connection.db.collection("items");
    await Items.deleteMany({userId:id});

    // Delete user.
    await User.findByIdAndDelete(id);

    return res.status(200).json({message:"Account deleted."});
});

module.exports={makeUser, signInUser, getUser, updateUser, deleteUser};