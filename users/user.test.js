const request = require('supertest');
const assert = require("assert");
const User = require("./userSchema");

const app = require("../app");

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


describe('Invalid requests to makeUser',function(){
    it('Throws appropriate errors', async function() {
        const path = '/api/users/register';
        
            // Missing fields
            await request(app).post(path).send(noEmail).expect('Content-Type', /json/).expect(400);
            await request(app).post(path).send(noPassword).expect('Content-Type', /json/).expect(400);
            // Duplicate email
            await request(app).post(path).send(validUsers[0]);
            await request(app).post(path).send(validUsers[0]).expect('Content-Type', /json/).expect(400);
            await User.findOneAndDelete({email:validUsers[0].email});
            // GET, PUT, DELETE requests
            await request(app).get(path).expect(404);
            await request(app).put(path).expect(404);
            await request(app).delete(path).expect(404);
        });
    });


describe('Valid request to signInUser', function() {
    it('Gives an access token', async function() {
      const path = '/api/users/signin';

      // Create user to test.
      await request(app).post('/api/users/register').send(validUsers[0]);

      // Login.
      const response = await request(app).post(path).send(validUsers[0]).expect('Content-Type', /json/).expect(200);
      // Check that an access token is output.
      const token = response.body.accessToken;
      assert(token);
      
      // Delete created user.
       await User.findOneAndDelete({email:validUsers[0].email});
    });
  });


  
  describe('Invalid requests to signInUser', function() {
    it('Throws appropriate errors', async function() {
      const path = '/api/users/signin';
      
        // Missing fields
        await request(app).post(path).send(noEmail).expect('Content-Type', /json/).expect(400);
        await request(app).post(path).send(noPassword).expect('Content-Type', /json/).expect(400);
        // Email and Password don't match
        await request(app).post(path).send(validUsers[0]);
        await request(app).post(path).send({email:"one@gmail.com",password:"12345"})
        .expect('Content-Type', /json/).expect(401);
        await User.findOneAndDelete({email:validUsers[0].email});
        // Invalid requests(404)
        await request(app).get(path).expect(404);
        await request(app).put(path).expect(404);
        await request(app).delete(path).expect(404);
    });
  });
 

async function makeUsersGetToken(){

    await request(app).post('/api/users/register').send(validUsers[0]);
    const response = await request(app).post('/api/users/signin').send(validUsers[0]);
    const token = response.body.accessToken;

    return token;
};


describe('Valid request to getUser', function() {
    it('Displays current user', async function() {
        const path = '/api/users/account';
        
        // Create user and login, obtain token.
        const token =await makeUsersGetToken();

        // Get user.
        await request(app).get(path).set("Authorization", "Bearer "+token)
        .expect('Content-Type', /json/).expect(200);

        // Delete created user.
        await User.findOneAndDelete({email:validUsers[0].email});
    });
});


describe('Invalid requests to getUser', function() {
it('Throws appropriate errors.', async function() {
    const path = '/api/users/account';
  
    // No header
    await request(app).get(path).expect(400);
    // Invalid header
    await request(app).get(path).set("Authorization", "1234").expect(400);
    // Bad token
    await request(app).get(path).set("Authorization", "Bearer 1234").expect(401);
    });
});


describe('Valid request to deleteUser', function() {
    it('Deletes the current user', async function() {
       const path = '/api/users/account';

       // Make a user and get a token.
       const token = await makeUsersGetToken();
       
       // Delete.
       await request(app).delete(path).set("Authorization", "Bearer "+token)
       .expect('Content-Type', /json/).expect(200);

       // Check that the user was deleted.
       const user = await User.exists({email:validUsers[0].email});
       assert.equal(user,null);
    });
});


describe('Invalid request to deleteUser', function() {
    it('Throws appropriate errors', async function() {
        const path = '/api/users/account';
        
        // No header
        await request(app).delete(path).expect(400),
        // Invalid header
        await request(app).delete(path).set("Authorization", "1234").expect(400),
        // Bad token
        await request(app).delete(path).set("Authorization", "Bearer 1234").expect(401);   
       
    });
});
