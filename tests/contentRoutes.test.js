const request = require('supertest');
const app = "http://localhost:3000";
const id = "1";

// ----------------------------VALID REQUESTS------------------------

//GET
const getPaths = ['', '?type=login', '?type=note', `?id=${id}`, `?id=${id}&type=note` ];
const getMessages = ['Get all content.', 'Get all logins.', 'Get all notes.', 
    `Get content with ID ${id}.`, `Get content with ID ${id}.`];

for (let i = 0; i<5; i++){
    request(app).get('/api/content'+getPaths[i])
    .expect(200, {message:`${getMessages[i]}`})
    .end(err=> {
    if (err) throw new Error(`GET api/content${getPaths[i]} failed.` );
    });
}

//POST
request(app).post('/api/content')
.expect(201,{message:"Content successfully created."})
.end(err=> {
    if (err) throw new Error(`POST api/content failed.` );
});

//PUT
request(app).put(`/api/content?id=${id}`)
.expect(200,{message:`Update content with ID ${id}.`})
.end(err=> {
    if (err) throw new Error(`PUT api/content?id=${id} failed.` );
});

//DELETE
request(app).delete(`/api/content?id=${id}`)
.expect(200,{message:`Delete content with ID ${id}.`})
.end(err=> {
    if (err) throw new Error(`DELETE api/content?id=${id} failed.` );
});

//-----------------------------------INVALID REQUESTS------------------------------

request(app).get('/api/content?type=foo')
.expect(400)
.end(err=> {
if (err) throw new Error(`No 400 for GET api/content?type=foo.` );
});

request(app).put('/api/content')
.expect(400)
.end(err=> {
if (err) throw new Error(`No 400 for PUT api/content.` );
});

request(app).put('/api/content?id=')
.expect(400)
.end(err=> {
if (err) throw new Error(`No 400 for PUT api/content?id=.` );
});

request(app).delete('/api/content')
.expect(400)
.end(err=> {
if (err) throw new Error(`No 400 for DELETE api/content.` );
});

