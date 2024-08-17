const request = require('supertest');
const app = "http://localhost:3000";
const id = "hello";

// VALID REQUESTS
request(app).post('/api/users/register')
.expect(201, {message:"Registered!"})
.end(err=> {
  if (err) throw new Error("POST api/users/login failed." );
});

request(app).post('/api/users/login')
.expect(200, {message:"User logged in."})
.end(err => {
    if (err) throw new Error("POST api/users/login failed." );
});

request(app).get('/api/users/account/'+id)
.expect(200, {message: `User ${id}.`})
.end(err =>{
    if (err) throw new Error("GET api/users/id failed." );
});

request(app).put('/api/users/account/'+id)
.expect(200, {message: `User ${id} updated.`})
.end(err =>{
    if (err) throw new Error("PUT api/users/id failed." );
});

request(app).delete('/api/users/account/'+id)
.expect(200, {message: `User ${id} deleted.`})
.end(err =>{
    if (err) throw new Error("DELETE api/users/id failed." );
})

// INVALID REQUESTS
const paths = ['/api/users/register', '/api/users/login'];
for (let i = 0; i < 2; i++){

    // GET returns 404
    request(app).get(paths[i])
    .expect(404)
    .end(err =>{
        if (err) throw Error (`No 404 at GET request to ${paths[i]}.`);
    });

    // PUT returns 404
    request(app).put(paths[i])
    .expect(404)
    .end(err =>{
        if (err) throw Error (`No 404 at PUT request to ${paths[i]}.`);
    });

    // DELETE returns 404
    request(app).delete(paths[i])
    .expect(404)
    .end(err =>{
        if (err) throw Error (`No 404 at DELETE request to ${paths[i]}.`);
    });
} 

// POST returns 404
request(app).post('/api/users/account/'+id)
.expect(404)
.end(err =>{
    if (err) throw Error(`No 404 at POST request to api/users/${id}.`);
});
