const request = require("supertest");
const assert = require("assert");

const app = require("../app");
const User = require("../users/userSchema");
const {makeUserGetToken, deleteUserForTesting} = require("./helpers");

const validUser = {email:"one@gmail.com", password:"1234"};
const extraField = {email:"two@gmail.com", password:"1234", extra:"extra"};
const noEmail = {password:"233"};
const noPassword = {email:"hello@gmail.com"};

describe('Valid request to makeUser', function() {
    const path = '/api/users/register';
    it('creates a valid user upon valid input.', async function(){
        // Valid request: should create valid user.
       await request(app).post(path).send(validUser).expect('Content-Type', /json/).expect(201);
       // Delete created user.
       await deleteUserForTesting(validUser);
    });

    it('creates a valid user upon valid input with extra field.', async function() {
       // Extra field: should create valid user.
       await request(app).post(path).send(extraField).expect('Content-Type', /json/).expect(201);
       // Delete created user.
       await deleteUserForTesting(extraField);

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
        await request(app).post(path).send(validUser);
        await request(app).post(path).send(validUser).expect('Content-Type', /json/).expect(400);
        await User.findOneAndDelete({email:validUser.email});
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
      await request(app).post('/api/users/register').send(validUser);
      // Login.
      const response = await request(app).post(path).send(validUser).expect('Content-Type', /json/).expect(200);
      // Check that an access token is output.
      const token = response.body.accessToken;
      assert(token);
    // Delete created user.
    await deleteUserForTesting(validUser);
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
        await request(app).post(path).send(validUser);
        await request(app).post(path).send({email:"one@gmail.com",password:"12345"})
        .expect('Content-Type', /json/).expect(401);
        await User.findOneAndDelete({email:validUser.email});
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

describe('Valid request to getUser', function() {
    const path = '/api/users/account';
    it('Displays current user', async function() {        
        // Create user and login, obtain token.
        const token =await makeUserGetToken(validUser);

        // Get user.
        await request(app).get(path).set("Authorization", "Bearer "+token)
        .expect('Content-Type', /json/).expect(200);

        // Delete created user.
        await deleteUserForTesting(validUser);
    });
});


describe('Invalid requests to getUser', function() {
    const path = '/api/users/account';
    it('throws 400 when no header is given.', async function(){
        await request(app).get(path).expect(400);
    });
    it('throws 400 when invalid header is given.', async function(){
        await request(app).get(path).set("Authorization", "1234").expect(400);
    });
    it('throws 401 when bad token is given.', async function(){
        await request(app).get(path).set("Authorization", "Bearer 1234").expect(401);
    });

});

describe('Valid request to updateUser', function() {
    const path = '/api/users/account';
    it('updates user upon valid request.', async function() {
       const changedUser = {email:"xyz@gmail.com", password:"11111"};

       // Make a user and get a token.
       const token = await makeUserGetToken(validUser);
       let user = await User.findOne({email:validUser.email});
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
       await deleteUserForTesting(changedUser);

    });
});

describe('Invalid request to updateUser', function() {
    const path = '/api/users/account';
    it('throws 400 when there is no header.', async function(){
        await request(app).delete(path).expect(400);
    });
    it('throws 400 at invalid header.', async function(){
        await request(app).delete(path).set("Authorization", "1234").expect(400);
    });
    it('throws 401 at bad token.', async function(){
        await request(app).delete(path).set("Authorization", "Bearer 1234").expect(401);
    });
    it('attempt to change _id does not work.', async function(){
       // Create a user and get a token.
       const token = await makeUserGetToken(validUser);
       
       // Attempt to change ID.
       let user = await User.findOne({email:validUser.email});
       const id = user.id;
       await request(app).put(path).set("Authorization", "Bearer "+token).send({_id:"111"});

       // Check the ID wasn't changed.
       user = await User.findOne({email:validUser.email});
       assert(user.id===id);

       // Delete created user.
       await deleteUserForTesting(validUser);

    });
});

describe('Valid request to deleteUser', function() {
    const path = '/api/users/account';
    it('performs deletion upon valid request.', async function() {
       // Make a user and get a token.
       const token = await makeUserGetToken(validUser);
       
       // Delete.
       await request(app).delete(path).set("Authorization", "Bearer "+token)
       .expect('Content-Type', /json/).expect(200);

       // Check that the user was deleted.
       const user = await User.exists({email:validUser.email});
       assert.equal(user,null);
    });
});


describe('Invalid request to deleteUser', function() {
    const path = '/api/users/account';
    it('throws 400 when there is no header.', async function(){
        await request(app).delete(path).expect(400);
    });
    it('throws 400 at invalid header.', async function(){
        await request(app).delete(path).set("Authorization", "1234").expect(400);
    });
    it('throws 401 at bad token.', async function(){
        await request(app).delete(path).set("Authorization", "Bearer 1234").expect(401);
    });
});
