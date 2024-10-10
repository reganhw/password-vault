const User = require('../users/userSchema');
async function makeUserGetToken(userInfo){

    await request(app).post('/api/users/register').send(userInfo);
    const response = await request(app).post('/api/users/signin').send(userInfo);
    const token = response.body.accessToken;

    return token;
};

async function deleteUserByEmail(userEmail){
    await User.findOneAndDelete({email : validUsers[1].email});
}

module.exports = {makeUserGetToken, deleteUserByEmail};