const bcrypt = require('bcrypt')
const userService = require('../user/user.service')

module.exports = {
    signup,
    login,
}

async function login(username, password) {
    try {
        const user = await userService.getByUsername(username)
        if (!user) return Promise.reject('Invalid username or password')
        const match = await userService.getByPassword(username, password)
        if (!match || !match.length) return Promise.reject('Invalid username or password')
        const userToReturn = _readyUserForSend(user)
        delete userToReturn._id
        // delete userToReturn.password
        return userToReturn;
    } catch (err) {
        console.log('err:', err)
    }
}

async function signup(username, password, fullname) {
    const saltRounds = 10
    if (!username || !password || !fullname) return Promise.reject('fullname, username and password are required!')
    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname })
}

function _readyUserForSend(user) {
    user.tasks = JSON.parse(user.tasks)
    return user;
}