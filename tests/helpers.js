async function makeUserGetToken(userInfo){

    await request(app).post('/api/users/register').send(userInfo);
    const response = await request(app).post('/api/users/signin').send(userInfo);
    const token = response.body.accessToken;

    return token;
};

module.exports = {makeUserGetToken};