const request = require('supertest');
const app = require("../app");
const async = require('async');
const folderName = "myFolder";
const id = "1";

console.log("Don't run this folder.test.js yet.");

// Path: /api/folders
/*
it('Test for /api/folders', function(done) {
    async.series([
        cb => request(app).get('/api/folders').expect(200, {message:"All folders."}, cb),
        cb => request(app).post('/api/folders').expect(201,{message:"Folder successfully created."}, cb),
        cb => request(app).put('/api/folders').expect(404, cb),
        cb => request(app).delete('/api/folders').expect(404,cb),    
    ], done);
});

it('GET /api/folders/folderName', function(done) {
    async.series([
        // !id & !type
        cb => request(app).get(`/api/folders/${folderName}`)
        .expect(200, {message:`GET ${folderName}.`}, cb),
        // id & !type
        cb => request(app).get(`/api/folders/${folderName}?id=${id}`)
        .expect(200, {message:`Get content with ID ${id}.`}, cb),
        // id & type
        cb => request(app).get(`/api/folders/${folderName}?id=${id}&type=login`)
        .expect(200, {message:`Get content with ID ${id}.`}, cb),
        // !id & valid type
        cb => request(app).get(`/api/folders/${folderName}?type=login`)
        .expect(200, {message:`GET contents of type login in ${folderName}.`}, cb),
        // !id & invalid type 
        cb => request(app).get(`/api/folders/${folderName}?type=logsin`)
        .expect(400, cb),
    ], done);
});

it('PUT /api/folders/folderName', function(done) {
    async.series([
        cb => request(app).put(`/api/folders/${folderName}`).expect(200, {message:`Folder ${folderName} updated.`}, cb),
    ], done);
});

it('DELETE /api/folders/folderName', function(done) {
    async.series([
        cb => request(app).delete(`/api/folders/${folderName}`)
        .expect(200, cb),
    ], done);
});


const statuses = [200,201];
for (let i = 0; i<2;i++){
    request.app.fs[i]('/api/folders')
    .expect(statuses[i])
    .end(err=>{
        if (err) throw new Error("Problem with api/folders.");
    }
    );
}
// GET (Valid)
request(app).get('/api/folders')
.expect(200, {message:"All folders."})
.end(err=> {
  if (err) throw new Error("Error" );
});

// POST (Valid)
request(app).post('/api/folders')
.expect(201, {message:"Folder successfully created."})
.end(err=> {
  if (err) throw new Error("POST api/folders failed." );
});

// PUT (Invalid)

// DELETE (Invalid)
*/