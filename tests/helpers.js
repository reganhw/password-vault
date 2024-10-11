const request = require('supertest');
const app = require("../app");
const User = require('../users/userSchema');
const {Login} = require('../items/itemSchema');

//Input: 'user' in the form of {email, password}.
//Output: creates the user in the DB and returns token.
async function makeUserGetToken(user){

    await request(app).post('/api/users/register').send(user);
    const response = await request(app).post('/api/users/signin').send(user);
    const token = response.body.accessToken;

    return token;
};

//Input: 'user' in the form of {email, password}.
//Output: deletes that user.
async function deleteUserForTesting(user){
    await User.findOneAndDelete({email : user.email});
}

//Input: 'user' in the form of {email, password}, loginData.
//Output: creates the login in the DB and returns its ID.
async function createLoginAs(userData, loginData){
    const user = await User.findOne({email:userData.email});
    let login = {...loginData};
    login.userId = user.id;
    await Login.create(login);
    // Retrieve item to get its ID.
    login= await Login.findOne({userId:user.id, title:login.title});
    return login.id;
}

module.exports = {makeUserGetToken, deleteUserForTesting, createLoginAs};