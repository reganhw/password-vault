const request = require("supertest");
const assert = require("assert");


const app = require("../app");
const User = require("../users/userSchema");

const validUsers = [
    {email:"one@gmail.com", password:"1234"},
    {email:"two@gmail.com", password:"1234", extra:"extra"}
];

const noEmail = {password:"233"};
const noPassword = {email:"hello@gmail.com"};

describe('Valid request to makeUser', function() {
    const path = '/api/users/register';
    it('creates a valid user upon valid input.', async function(){
        // Valid request: should create valid user.
       await request(app).post(path).send(validUsers[0]).expect('Content-Type', /json/).expect(201);
       // Delete created user.
       await User.findOneAndDelete({email : validUsers[0].email});
    });
    it('creates a valid user upon valid input with extra field.', async function() {
       // Extra field: should create valid user.
       await request(app).post(path).send(validUsers[1]).expect('Content-Type', /json/).expect(201);
       // Delete created user.
       await User.findOneAndDelete({email : validUsers[1].email});
        
    });
});


describe('Invalid requests to makeUser',function(){
    const path = '/api/users/register';
    it('throws 400 when no email is given.', async function(){
        await request(app).post(path).send(noEmail).expect('Content-Type', /json/).expect(400);
    });
    it('throws 400 when no password is given.', async function(){
        await request(app).post(path).send(noPassword).expect('Content-Type', /json/).expect(400);
    });
    it('throws 400 when duplicate email is given.', async function(){
        await request(app).post(path).send(validUsers[0]);
        await request(app).post(path).send(validUsers[0]).expect('Content-Type', /json/).expect(400);
        await User.findOneAndDelete({email:validUsers[0].email});
    });
    it('throws 404 for GET request.', async function(){
        await request(app).get(path).expect(404);
    });
    it('throws 404 for PUT request.', async function(){
        await request(app).put(path).expect(404);
    });
    it('throws 404 for DELETE request.', async function() {
        await request(app).delete(path).expect(404);
    });
});


describe('Valid request to signInUser', function() {
    const path = '/api/users/signin';
    it('Gives an access token', async function() {
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
    const path = '/api/users/signin';
    it('throws 400 when no email is given.', async function(){
        await request(app).post(path).send(noEmail).expect('Content-Type', /json/).expect(400);
    });

    it('throws 400 when no password is given.', async function(){
        await request(app).post(path).send(noPassword).expect('Content-Type', /json/).expect(400);
    });
    it('throws 401 when email and password do not match.', async function(){
        await request(app).post(path).send(validUsers[0]);
        await request(app).post(path).send({email:"one@gmail.com",password:"12345"})
        .expect('Content-Type', /json/).expect(401);
        await User.findOneAndDelete({email:validUsers[0].email});
    });
    it('throws 404 at GET request.', async function(){
        await request(app).get(path).expect(404);
    });
    it('throws 404 at PUT request.', async function(){
        await request(app).put(path).expect(404);
    });
    it('throws 404 at DELETE request.', async function(){
        await request(app).delete(path).expect(404);
    });
  });
 

// Helper function that makes a user, signs it in, and returns a token.
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

describe('Valid request to updateUser', function() {
    it('Updates the user', async function() {
       const path = '/api/users/account';
       const changedUser = {email:"xyz@gmail.com", password:"11111"};

       // Make a user and get a token.
       const token = await makeUsersGetToken();
       let user = await User.findOne({email:validUsers[0].email});
       const id = user.id;
       const hashedPassword = user.password;
       const folders = user.folders;

       // Change email. 
       await request(app).put(path).set("Authorization", "Bearer "+token)
       .send({email:changedUser.email})
       .expect('Content-Type', /json/).expect(200);
       
       user = await User.findById(id);
       assert(user.email===changedUser.email); // Email was changed.
       assert(user.password===hashedPassword); // Password was unchanged.
       assert(user.folders.length === folders.length); // Folders were unchanged.

       // Change password.
       await request(app).put(path).set("Authorization", "Bearer "+token)
       .send({password:changedUser.password})
       .expect('Content-Type', /json/).expect(200);

       // See if signing in is possible with new credentials.
       await request(app).post('/api/users/signin').send(changedUser).expect(200);

       // Delete created user.
       await User.findByIdAndDelete(id);

    });
});

describe('Invalid request to updateUser', function() {
    it('Throws appropriate errors', async function() {
        const path = '/api/users/account';
        
        // No header
        await request(app).put(path).expect(400);
        // Invalid header
        await request(app).put(path).set("Authorization", "1234").expect(400);
        // Bad token
        await request(app).put(path).set("Authorization", "Bearer 1234").expect(401);   
       
        // Attempt to change Id doesn't work.
       const token = await makeUsersGetToken();
       let user = await User.findOne({email:validUsers[0].email});
       const id = user.id;
       await request(app).put(path).set("Authorization", "Bearer "+token).send({_id:"111"});
       user = await User.findOne({email:validUsers[0].email});
       assert(user.id===id);
       
       // ADD duplicate email checking.

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
