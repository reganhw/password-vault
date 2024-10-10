const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../users/userSchema");
const {Login, Card, Note} = require("./itemSchema");


// @desc Helper function that checks if a String "type" is a valid item type.
const validType = (type, res) =>{
    if (!(type=="login"||type=="card"||type=="note")){
        res.status(400);
        throw new Error("Invalid item type.");
    }
}

//@desc Retrieve items.
//@route GET /api/items or api/items?type=type
//@access private

const getManyItems = asyncHandler(async(req,res)=>{

    // User validation.
    const userId = req.payload.id;
    if(!userId){
        res.status(400);
        throw new Error("The user is not logged in.");
    }

    // If ?type=type
    const type = req.query.type;
    if(type){
        validType(type, res);
        let results;
        switch (type) {
            case "login":
                // The type still has to be specified
                results = await Login.find({type, userId}).sort({"title":1});
                break;
            case "card":
                results = await Card.find({type, userId}).sort({"title":1});
                break;
            case "note":
                results = await Note.find({type, userId}).sort({"title":1});
                break;
        
            default:
                break;
        }
        return res.status(200).json(results);
    }

    // No type given.
    const Items = mongoose.connection.db.collection("items");
    const allItems = await Items.find({userId}).sort({"title":1}).toArray(); 
    return res.status(200).json(allItems)
    ;
}
);

//@desc Retrieve a single item.
//@route GET /api/items/:itemID
//@access private

const getItem = asyncHandler(async(req,res)=>{
    const userId = req.payload.id;
    const id = req.params.id;
    const Items = mongoose.connection.db.collection("items");
    const item = await Items.findOne({_id:new mongoose.Types.ObjectId(id)});
    if(!item){
        res.status(404);
        throw new Error ("An item with that ID does not exist.");
    }
    if (item.userId !=userId){
        res.status(401);
        throw new Error("Unauthorised.");
    }
    return res.status(200).json(item);
});

//@desc Makes an item from a request body. Required fields: userId, type.
//@route POST /api/items
//@access private

const makeItem = asyncHandler(async(req,res)=>{
    
    // Check for user ID.
    const userId = req.payload.id;
    if(!userId){
        res.status(400);
        throw new Error("The user is not logged in.");
    }
    
    // Check that type is set.
    const type = req.body.type;
    if(!type){
        res.status(400);
        throw new Error("A valid type must be specified.");
    }

    // Check that type is valid.
    validType(type, res);
    
    // Create item.
    const itemData = structuredClone(req.body);
    itemData.userId = userId; // Set userId to current user's ID.
    
    let item;
    switch (type) {
        case "login":
            item = await Login.create(itemData);
            break;
        case "card":
            item = await Card.create(itemData);
            break;
        case "note":
            item = await Note.create(itemData);
            break;
        default:
            break;
        
    }
    // If the specified folder doesn't exist, create it.

    const folderName = itemData.folder;
    if (folderName){
        const user = await User.findById(userId);
        const folders = user.folders;
        if (!folders.includes(folderName)){
            await User.updateOne({ _id: userId },{ $push: { folders: folderName} });
        }
    }
    
    return res.status(201).json({item});
    
});


//@desc Update item.
//@route PUT /api/items/:itemID
//@access private

const updateItem = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    
    // Check that an item with the ID exists.
    const Items = mongoose.connection.db.collection("items");
    let item = await Items.findOne({_id:new mongoose.Types.ObjectId(id)});
    
    if(!item){
        res.status(404);
        throw new Error("An item with that ID does not exist.");
    }

    // Check authorisation.
    const userId = req.payload.id;
    if(item.userId!=userId){
        res.status(401);
        throw new Error("Unauthorised.");
    }
    // Prevent user ID changing.
    if(req.body.userId &&(req.body.userId!= userId)){
        res.status(400);
        throw new Error("User ID cannot be changed.");
    }
    
    // Prevent type changing.
    if(req.body.type &&(req.body.type!=item.type) ){
        res.status(400);
        throw new Error("The type of an item cannot be changed..");
        
    }

    switch (item.type) {
        case "login":
            await Login.findByIdAndUpdate(id, req.body);
            item = await Login.findById(id);
            break;
        case "card":
            await Card.findByIdAndUpdate(id, req.body);
            item = await Card.findById(id);
            break;

        case "note":
            await Note.findByIdAndUpdate(id,req.body);
            item =await Note.findById(id);
            break;

        default:
            break;
    }
    return res.status(200).json(item);
}
);

//@desc Delete item.
//@route DELETE /api/items/:itemID
//@access private

const deleteItem =asyncHandler(async(req,res)=>{

    const id = req.params.id;
    
    // Check that an item with the ID exists.
    const Items = mongoose.connection.db.collection("items");
    let item = await Items.findOne({_id:new mongoose.Types.ObjectId(id)});
    
    if(!item){
        res.status(404);
        throw new Error("An item with that ID does not exist.");
    }

    // Check authorisation.
    const userId = req.payload.id;
    if(item.userId!=userId){
        res.status(401);
        throw new Error("Unauthorised.");
    }

    await Items.findOneAndDelete({_id:new mongoose.Types.ObjectId(id)});
   
    return res.status(200).json({message:`Deleted item with ID ${req.params.id}.`});
});

module.exports = {validType, getManyItems, getItem,  makeItem, updateItem, deleteItem};