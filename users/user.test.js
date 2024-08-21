const request = require('supertest');
const async = require("async");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./userSchema");

const app = require("../app");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const validUsers = [
    {email:"one@gmail.com", password:"1234"},
    {email:"two@gmail.com", password:"1234", extra:"extra"}
];

const noEmail = {password:"233"};
const noPassword = {email:"hello@gmail.com"};

describe('Valid request to makeUser', function() {
    it('Creates valid users', async function() {
        const path = '/api/users/register';

       // Valid request: should create valid user.
       await request(app).post(path).send(validUsers[0]).expect('Content-Type', /json/).expect(201);
       // Extra field: should create valid user.
       await request(app).post(path).send(validUsers[1]).expect('Content-Type', /json/).expect(201);
       // Delete created users.
       await User.findOneAndDelete({email : validUsers[0].email});
       await User.findOneAndDelete({email : validUsers[1].email});
        
    });

});

/*
describe('Invalid requests to makeUser',function(){
    it('Throws appropriate errors', function(done) {
        const path = '/api/users/register';
        async.series([
            // Missing fields
            cb => request(app).post(path).send(noEmail).expect('Content-Type', /json/).expect(400, cb),
            cb => request(app).post(path).send(noPassword).expect('Content-Type', /json/).expect(400, cb),
            // Duplicate email
            cb => request(app).post(path).send(validUsers[0]).expect('Content-Type', /json/).expect(400, cb),
            // GET, PUT, DELETE requests
            cb => request(app).get(path).expect(404, cb),
            cb => request(app).put(path).expect(404, cb),
            cb => request(app).delete(path).expect(404, cb),
        ], done);
    });

});



let tokenOne;
describe('Valid request to signInUser', function() {
    it('Gives an access token', async function() {
      const path = '/api/users/signin';
      await request(app).post(path).send(validUsers[0]).expect('Content-Type', /json/).expect(200)
     .then(res => {
           tokenOne = res.body.accessToken; // set access token
        });
       //await User.findOneAndDelete({email:validUsers[0].email});
    });
  });


  
  describe('INVALID SIGN-IN', function() {
    it('throws appropriate errors', function(done) {
      const path = '/api/users/signin';
      async.series([
        // Missing fields
        cb => request(app).post(path).send(noEmail).expect('Content-Type', /json/).expect(400, cb),
        cb => request(app).post(path).send(noPassword).expect('Content-Type', /json/).expect(400, cb),
        // Email and Password don't match
        cb => request(app).post(path).send({email:"one@gmail.com",password:"12345"}).expect('Content-Type', /json/).expect(401, cb),
        // Invalid requests(404)
        cb => request(app).get(path).expect(404, cb),
        cb => request(app).put(path).expect(404, cb),
        cb => request(app).delete(path).expect(404, cb),
        
   
    ], done);
    });
  });
 

describe('Valid request to getUser', function() {
it('Displays current user', async function() {
    const path = '/api/users/account';
    const res =await request(app).get(path).set("Authorization", "Bearer "+tokenOne)
    .expect('Content-Type', /json/).expect(200)
});
});

describe('Invalid requests to getUser', function() {
it('Throws appropriate errors.', function(done) {
    const path = '/api/users/account';
    async.series([
        // No header
        cb => request(app).get(path).expect(400,cb),
        // Invalid header
        cb => request(app).get(path).set("Authorization", "1234").expect(400,cb),
        // Bad token
        cb => request(app).get(path).set("Authorization", "Bearer 1234").expect(401,cb),
    ], done);
});
});


describe('Valid request to deleteUser', function() {
    it('Deletes the current user', function(done) {
        const path = '/api/users/account';
        async.series([
            // Delete user.
            cb => request(app).delete(path).set("Authorization", "Bearer "+tokenOne)
            .expect('Content-Type', /json/).expect(200, cb),
            // Check subsequent login fails.
            cb => request(app).post('/api/users/signin').send(validUsers[0]).expect(401, cb),          
       
        ], done);
});
});

describe('Invalid request to deleteUser', function() {
    it('Throws appropriate errors', function(done) {
        const path = '/api/users/account';
        async.series([
        // No header
        cb => request(app).delete(path).expect(400,cb),
        // Invalid header
        cb => request(app).delete(path).set("Authorization", "1234").expect(400,cb),
        // Bad token
        cb => request(app).delete(path).set("Authorization", "Bearer 1234").expect(401,cb),   
       
        ], done);
});
});


 */