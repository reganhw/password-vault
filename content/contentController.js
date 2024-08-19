const getContent = (req,res)=>{
    // If an ID is specified, get content with that ID. The TYPE parameter has no effect.
    if(req.query.id){
        return res.status(200).json({message:`Get content with ID ${req.query.id}.`});
    }

    // If there is no ID but there is a type.
    const type = req.query.type;
    if(type){
        validType(type, res);
        return res.status(200).json({message: `Get all ${type}s.`});
    }
    // If there is no ID and no type. Note: Didn't consider the case where there's some other parameter.
    return res.status(200).json({message:"Get all content."});
}
const validType = (type, res) =>{
    if (!(type=="login"||type=="card"||type=="note")){
        return res.status(400).json({message:"Invalid content type."});
    }
}

const makeContent =(req,res)=>{
    return res.status(201).json({message:"Content successfully created."});
}

const updateContent = (req,res)=>{
    if (!req.query.id){
        return res.status(401).json({message:"Please provide the ID of the content to update."});
    }
    return res.status(200).json({message:`Update content with ID ${req.query.id}.`});
}

const deleteContent =(req,res)=>{
    if (!req.query.id){
        return res.status(401).json({message:"Please provide the ID of the content to delete."});
    }
    return res.status(200).json({message:`Delete content with ID ${req.query.id}.`});
}

module.exports = {getContent, validType, makeContent, updateContent, deleteContent};