const request = require('supertest');
const app = require("../app");
const User = require('../users/userSchema');

async function makeUserGetToken(user){

    await request(app).post('/api/users/register').send(user);
    const response = await request(app).post('/api/users/signin').send(user);
    const token = response.body.accessToken;

    return token;
};

async function deleteUserForTesting(user){
    await User.findOneAndDelete({email : user.email});
}

module.exports = {makeUserGetToken, deleteUserForTesting};