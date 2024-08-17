const request = require('supertest');
const app = "http://localhost:3000";
const id = "7";

request(app).post('/api/users/register')
.expect(201, {message:"Registered!"})
.end(function(err) {
  if (err) throw new Error("POST api/users/login failed." );
});

request(app).post('/api/users/login')
.expect(200, {message:"User logged in."})
.end(function(err) {
    if (err) throw new Error("POST api/users/login failed." );
});

request(app).get('/api/users/'+id)
.expect(200, {message: `User ${id}.`})
.end(function (err){
    if (err) throw new Error("GET api/users/id failed." );
});

request(app).put('/api/users/'+id)
.expect(200, {message: `User ${id} updated.`})
.end(function (err){
    if (err) throw new Error("PUT api/users/id failed." );
});

request(app).delete('/api/users/'+id)
.expect(200, {message: `User ${id} deleted.`})
.end(function(err){
    if (err) throw new Error("DELETE api/users/id failed." );
})