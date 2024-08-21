const request = require('supertest');
const async = require("async");
const bodyParser = require("body-parser");

const app = require("../app");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const goodPayload = {email:"one@gmail.com", password:"1234"};
const extraField = {email:"two@gmail.com", password:"1234", extra:"extra"};
const noEmail = {password:"233"};
const noPassword = {email:"hello@gmail.com"};

/*
it('Test for /api/users/register', function(done) {
    const path = '/api/users/register';
    

    async.series([
        // Valid request: should create valid user.
        cb => request(app).post(path).send(goodPayload).expect('Content-Type', /json/).expect(201, cb),
        // Extra field: should create valid user.
        cb => request(app).post(path).send(extraField).expect('Content-Type', /json/).expect(201, cb),
        // Missing fields
        cb => request(app).post(path).send(noEmail).expect('Content-Type', /json/).expect(400, cb),
        cb => request(app).post(path).send(noPassword).expect('Content-Type', /json/).expect(400, cb),
        // Duplicate email
        cb => request(app).post(path).send(goodPayload).expect('Content-Type', /json/).expect(400, cb),
        // Invalid requests(404)
        cb => request(app).get(path).expect(404, cb),
        cb => request(app).put(path).expect(404, cb),
        cb => request(app).delete(path).expect(404, cb),
        
   
    ], done);
});

*/
let accessToken;
describe('VALID SIGN-IN', function() {
    it('responds with an access token', async function() {
      const path = '/api/users/signin';
      const res =await request(app).post(path).send(goodPayload).expect('Content-Type', /json/).expect(200)
     .then(res => {
           accessToken = res.body.accessToken; // set access token
        });
    });
  });

  /*
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
  */

describe('Valid request to getUser', function() {
it('Displays current user', async function() {
    const path = '/api/users/account';
    const res =await request(app).get(path).set("Authorization", "Bearer "+accessToken)
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