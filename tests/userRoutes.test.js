const request = require('supertest');
const app = require("../app");
const async = require("async");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const id = "hello";
const goodPayload = {email: 'xyz@mymail.com', password: '1234' };
const noEmail = {password: '1234'};
const noPassword = {email: 'xyz@mymail.com'};

it('Test for /api/users/register', function(done) {
    const path = '/api/users/register';
    
    async.series([
        // Valid request
        cb => request(app).post(path).send(goodPayload).expect('Content-Type', /json/).expect(201, cb),
        // Missing fields
        cb => request(app).post(path).send(noEmail).expect('Content-Type', /json/).expect(400, cb),
        cb => request(app).post(path).send(noPassword).expect('Content-Type', /json/).expect(400, cb),
        // Invalid requests(404)
        cb => request(app).get(path).expect(404, cb),
        cb => request(app).put(path).expect(404, cb),
        cb => request(app).delete(path).expect(404, cb),
        
   
    ], done);
});

it('Test for /api/users/login', function(done) {
    const path = '/api/users/login';
    async.series([
        // Valid Requests
        cb => request(app).post(path).send(goodPayload).expect('Content-Type', /json/).expect(200, cb),
        // Missing Fields
        cb => request(app).post(path).send(noEmail).expect('Content-Type', /json/).expect(400, cb),
        cb => request(app).post(path).send(noPassword).expect('Content-Type', /json/).expect(400, cb),
        // Invalid Request (404)
        cb => request(app).get(path).expect(404, cb),
        cb => request(app).put(path).expect(404, cb),
        cb => request(app).delete(path).expect(404, cb),
   
    ], done);
});

it(`Test for /api/users/account/${id}`, function(done) {
    const path = '/api/users/account/'+id;
    async.series([
        // Valid Requests
        cb => request(app).get(path).expect('Content-Type', /json/).expect(200, cb),
        cb => request(app).put(path).expect('Content-Type', /json/).expect(200, cb),
        cb => request(app).delete(path).expect('Content-Type', /json/).expect(200, cb),
        // Invalid Request (404)
        cb => request(app).post(path).expect(404, cb),
   
    ], done);
});