const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
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
    const userId = req.payload.id;
    // Type given.
    const type = req.query.type;
    if(type){
        validType(type, res);
        let results;
        switch (type) {
            case "login":
                results = await Login.find({type});
                break;
            case "card":
                results = await Card.find({type});
                break;
            case "note":
                results = await Note.find({type});
                break;
        
            default:
                break;
        }
        return res.status(200).json(results);
    }

    // No type.
    const allItems = await Note.find({}); // For some reason, this finds the logins and cards too.
    return res.status(200).json(allItems);
}
);

//@desc Retrieve item.
//@route GET /api/items/:itemID
//@access private

const getItem = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const Items = mongoose.connection.db.collection("items");
    const item = await Items.findOne({_id:new mongoose.Types.ObjectId(id)});
    if(!item){
        res.status(404);
        throw new Error ("An item with that ID does not exist.");
    }
    return res.status(200).json(item);
});

//@desc Make item.
//@route POST /api/items
//@access private

const makeItem = asyncHandler(async(req,res)=>{
    type = req.body.type;

    // Check that type is set.
    if(!type){
        res.status(400);
        throw new Error("A valid type must be specified.");
    }

    // Check that type is valid.
    validType(type, res);

    // Create item.
    let item;
    switch (type) {
        case "login":
            item = await Login.create(req.body);
            break;
        case "card":
            item = await Card.create(req.body);
            break;
        case "note":
            item = await Note.create(req.body);
            break;
        default:
            break;
        
    }
    // Add later: if the specified folder doesn't exist, create it.
    
    return res.status(201).json(item);
});


//@desc Update item.
//@route PUT /api/items/:itemID
//@access private

const updateItem = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    // Ensure ID is provided.
    if (!id){
        res.status(400);
        throw new Error("Please provide the ID of the item to update.");
    }


    // Check that an item with the ID exists.
    const Items = mongoose.connection.db.collection("items");
    let item = await Items.findOne({_id:new mongoose.Types.ObjectId(id)});
    
    if(!item){
        res.status(404);
        throw new Error("An item with that ID does not exist.");
    }
    
    // Prevent type changing.
    if(req.body.type &&(req.body.type!=item.type) ){
        res.status(400);
        throw new Error("You can't change the type of an item.");
        
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
    let id = req.params.id;
    if (!id){
        res.status(400);
        throw new Error("Please provide the ID of the item to delete.");
    }

    id = new mongoose.Types.ObjectId(req.params.id);

    const Items = mongoose.connection.db.collection("items");
    const item = await Items.findOne({_id:id});
    if(!item){
        res.status(404);
        throw new Error("An item with that ID doesn't exist.");
    }
    await Items.findOneAndDelete({_id:id});
   
    return res.status(200).json({message:`Deleted item with ID ${req.params.id}.`});
});

module.exports = {validType, getManyItems, getItem,  makeItem, updateItem, deleteItem};