const request = require('supertest');
const app = require("../app");
const assert = require("assert");

const User = require('../users/userSchema');
const {Login, Card, Note }= require("../items/itemSchema");
const {makeUserGetToken, deleteUserForTesting, createLoginAs} = require("./helpers");

const validUsers = [{"email":"0000", "password":"0000"},{"email":"1111", "password":"1111"},
    {"email":"2222", "password":"2222"}];
let tokens = [];

const loginData = {title: "a login", email:"123@mymail.com", password:"mypw", username: "myusername",
    comments: "Some comments", type:"login"};
const cardData = {title:"a card", cardNumber:"12345", CVV:"000", expiryDate:{month:10, year:2026}, type:"card"};
const noteData = {title:"a note", comments:"this is a note!", type:"note"};

const path = '/api/items/';

// Create users for testing.
before(async ()=>{
    for(let i = 0; i<validUsers.length; i++){
        tokens.push(await makeUserGetToken(validUsers[i]));
    }
});

describe('Valid request to makeItem', ()=>{
    let loginId;
    let cardId;
    let noteId;
    
    it('makes a login upon valid request', async ()=>{
        // Make login.
        const login = await request(app).post(path).send(loginData).set("Authorization", "Bearer "+tokens[0]);
        loginId = login._body._id;
        
        // Check that it exists.
        const loginRetrieved = await Login.findById(loginId);
        assert(loginRetrieved.title==loginData.title);    
    });
    
    it('makes a card upon valid request', async ()=>{
        // Make card.
        const card = await request(app).post(path).send(cardData).set("Authorization", "Bearer "+tokens[0]);
        cardId = card._body._id;

        // Check that it exists.
        const cardRetrieved = await Card.findById(cardId);
        assert(cardRetrieved.title==cardData.title);
    });
    
    it('makes a note upon valid request', async ()=>{
        // Make note.
        const note = await request(app).post(path).send(noteData).set("Authorization", "Bearer "+tokens[0]);
        noteId = note._body._id;

        // Check that it exists.
        const noteRetrieved = await Note.findById(noteId);
        assert(noteRetrieved.title==noteData.title);
    });
    after(async ()=>{
        // Delete items.
        await Login.findByIdAndDelete(loginId);
        await Card.findByIdAndDelete(cardId);
        await Note.findByIdAndDelete(noteId);
    });
    
    
});

describe('Invalid request to makeItem', ()=>{
    it('throws 401 when user the token is bad.', async ()=>{
        await request(app).post(path).send(loginData).set("Authorization", "Bearer "+"123").expect(401);
    })
    it('throws 400 when the type is invalid.', async ()=>{
        const badLogin = {...loginData};
        badLogin.type = "foo";
        await request(app).post(path).send(badLogin).set("Authorization", "Bearer "+tokens[0]).expect(400);
    });
})

describe('Valid request to deleteItem', ()=>{
    it('deletes items upon valid request.', async ()=> {

        const loginId = await createLoginAs(validUsers[0],loginData);
        // Delete item.
        await request(app).delete(path+loginId).set("Authorization", "Bearer "+tokens[0]);
        // Check that it was deleted.
        const deleted = await Login.findById(loginId);
        assert(!deleted);
    });
});

describe('Invalid request to deleteItem', ()=>{
    it('throws 400 at request with bad ID', async ()=>{
        await request(app).delete(path+"111").set("Authorization", "Bearer "+tokens[0]).expect(400);
    });
    it('throws 400 at request with non-existent item', async ()=>{
        const badId = "111111111111111111111111"
        await request(app).delete(path+badId).set("Authorization", "Bearer "+tokens[0]).expect(404);
    });
    it('does not let an unauthorised user delete an item', async ()=>{
        // Create login as user0.
        const loginId = await createLoginAs(validUsers[0], loginData);
        // Try deleting as user1.
        await request(app).delete(path+loginId).set("Authorization", "Bearer "+tokens[1]).expect(401);
        // Delete item.
        await Login.findByIdAndDelete(loginId);
    });

});

// Delete users made for testing.
after(async ()=>{
    for(let i = 0; i<validUsers.length; i++){
        await deleteUserForTesting(validUsers[i]);
    }
});
