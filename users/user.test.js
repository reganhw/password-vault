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