const request = require('supertest');
const app = require("../app");
const assert = require("assert");

const User = require('../users/userSchema');
const {Login, Card, Note }= require("../items/itemSchema");
const {makeUserGetToken, deleteUserForTesting} = require("./helpers");

const validUsers = [{"email":"0000", "password":"0000"},{"email":"1111", "password":"1111"},
    {"email":"2222", "password":"2222"}];
let tokens = [];

const loginData = {title: "a login", email:"123@mymail.com", password:"mypw", username: "myusername",
    comments: "Some comments", type:"login"};
const cardData = {title:"a card", cardNumber:"12345", CVV:"000", expiryDate:{month:10, year:2026}, type:"card"};
const noteData = {title:"a note", comments:"this is a note!", type:"note"};



// Create users for testing.
before(async function(){
    for(let i = 0; i<validUsers.length; i++){
        tokens.push(await makeUserGetToken(validUsers[i]));
    }
});

describe('Valid request to makeItem', function(){
    const path = '/api/items/';
    let loginId;
    let cardId;
    let noteId;
    it('makes a login upon valid request', async function(){
        // Make login.
        const login = await request(app).post(path).send(loginData).set("Authorization", "Bearer "+tokens[0]);
        loginId = login._body.item._id;

        // Check that it exists.
        const loginRetrieved = await Login.findById(loginId);
        assert(loginRetrieved.title==loginData.title);        
    });
    
    it('makes a card upon valid request', async function(){
        // Make card.
        const card = await request(app).post(path).send(cardData).set("Authorization", "Bearer "+tokens[0]);
        cardId = card._body.item._id;

        // Check that it exists.
        const cardRetrieved = await Card.findById(cardId);
        assert(cardRetrieved.title==cardData.title);
    });
    it('makes a note upon valid request', async function(){
        // Make note.
        const note = await request(app).post(path).send(noteData).set("Authorization", "Bearer "+tokens[0]);
        noteId = note._body.item._id;

        // Check that it exists.
        const noteRetrieved = await Note.findById(noteId);
        assert(noteRetrieved.title==noteData.title);
    });
    after(async function(){
        // Delete items.
        await Login.findByIdAndDelete(loginId);
        await Card.findByIdAndDelete(cardId);
        await Note.findByIdAndDelete(noteId);
    });
    
});

describe('Invalid request to makeItem', function(){
    const path = '/api/items';
    it('throws 401 when user the token is bad.', async function(){
        await request(app).post(path).send(loginData).set("Authorization", "Bearer "+"123").expect(401);
    })
    it('throws 400 when the type is invalid.', async function(){
        const badLogin = {...loginData};
        badLogin.type = "foo";
        await request(app).post(path).send(badLogin).set("Authorization", "Bearer "+tokens[0]).expect(400);
    });
})

describe('Valid request to deleteItem', function(){
    const path = '/api/items/';
    it('deletes items upon valid request.', async function() {
        // Retrieve user data.
        const userZero = await User.findOne({email:validUsers[0].email});
        const userId = userZero.id;

        // Create item.
        const login = {...loginData};
        login.userId = userId;
        await Login.create(login);
        // Retrieve item to get its ID.
        const item = await Login.findOne({userId, title:login.title});

        // Delete item.
        await request(app).delete(path+item.id).set("Authorization", "Bearer "+tokens[0]);
        // Check that it was deleted.
        const deleted = await Login.findOne({userId, title:login.title});
        assert(!deleted);
    });
});

// Delete users made for testing.
after(async function(){
    for(let i = 0; i<validUsers.length; i++){
        await deleteUserForTesting(validUsers[i]);
    }
});

/*
// ----------------------------VALID REQUESTS------------------------

//GET
const getPaths = ['', '?type=login', '?type=note', `?id=${id}`, `?id=${id}&type=note` ];
const getMessages = ['Get all content.', 'Get all logins.', 'Get all notes.', 
    `Get content with ID ${id}.`, `Get content with ID ${id}.`];

for (let i = 0; i<5; i++){
    request(app).get('/api/content'+getPaths[i])
    .expect(200, {message:`${getMessages[i]}`})
    .end(err=> {
    if (err) throw new Error(`GET api/content${getPaths[i]} failed.` );
    });
}

//POST
request(app).post('/api/content')
.expect(201,{message:"Content successfully created."})
.end(err=> {
    if (err) throw new Error(`POST api/content failed.` );
});

//PUT
request(app).put(`/api/content?id=${id}`)
.expect(200,{message:`Update content with ID ${id}.`})
.end(err=> {
    if (err) throw new Error(`PUT api/content?id=${id} failed.` );
});

//DELETE
request(app).delete(`/api/content?id=${id}`)
.expect(200,{message:`Delete content with ID ${id}.`})
.end(err=> {
    if (err) throw new Error(`DELETE api/content?id=${id} failed.` );
});

//-----------------------------------INVALID REQUESTS------------------------------

request(app).get('/api/content?type=foo')
.expect(400)
.end(err=> {
if (err) throw new Error(`No 400 for GET api/content?type=foo.` );
});

request(app).put('/api/content')
.expect(400)
.end(err=> {
if (err) throw new Error(`No 400 for PUT api/content.` );
});

request(app).put('/api/content?id=')
.expect(400)
.end(err=> {
if (err) throw new Error(`No 400 for PUT api/content?id=.` );
});

request(app).delete('/api/content')
.expect(400)
.end(err=> {
if (err) throw new Error(`No 400 for DELETE api/content.` );
});

*/