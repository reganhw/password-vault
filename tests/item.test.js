const request = require('supertest');
const app = require("../app");
const assert = require("assert");

const User = require('../users/userSchema');
const {Login, Card, Note }= require("../items/itemSchema");
const {makeUserGetToken, deleteUserForTesting} = require("./helpers");

const validUsers = [{"email":"0000", "password":"0000"},{"email":"1111", "password":"1111"},
    {"email":"2222", "password":"2222"}];
const loginData = {title: "a login", email:"123@mymail.com", password:"mypw", username: "myusername",
    comments: "Some comments", type:"login"
};
//const cardData = {title:"a card", cardNumber:"12345", CVV:"000", expiryDate:{month:10, year:2026}, type:"card"};
let tokens = [];

// Create users for testing.
before(async function(){
    for(let i = 0; i<validUsers.length; i++){
        tokens.push(await makeUserGetToken(validUsers[i]));
    }
});

describe('Valid request to deleteItem', function(){
    const path = '/api/items/';
    it('Tests the delete items function.', async function() {
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
})

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