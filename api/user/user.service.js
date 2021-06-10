const dbService = require('../../services/db.service.js')
const logger = require('../../services/logger.service')

module.exports = {
    query,
    getById,
    getByUsername,
    getByPassword,
    remove,
    update,
    addUser
}

async function query() {
    try {
        var query = `SELECT * FROM user`
        const users = await dbService.runSQL(query)
        const usersToReturn = users.map(user => _readyUserForSend(user))
        return usersToReturn;
    } catch (err) {
        console.log('err:', err)
    }
}

async function getById(userId) {
    try {
        var query = `SELECT * FROM user WHERE _id = '${userId}'`;
        var user = await dbService.runSQL(query);
        if (user.length === 1) {
            const userToReturn = _readyForSend(user[0])
            return userToReturn;
        }
        else if (user.length > 1) throw new Error(`multiple id found! ${userId}`);
        throw new Error(`user id ${userId} not found`);
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        var query = `SELECT * FROM user where username = '${username}'`
        const user = await dbService.runSQL(query);
        if (user.length === 1) return user[0]
        else if (user.length > 1) throw err
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function getByPassword(username, password) {
    try {
        var query = `SELECT * FROM user where password = '${password}' and username = '${username}'`
        const user = await dbService.runSQL(query);
        return user;
    } catch (err) {
        logger.error(`while finding user ${password}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        var query = `DELETE FROM user WHERE user._id = ${userId}`;
        const res = await dbService.runSQL(query)
            .then(okPacket => okPacket.affectedRows === 1
                ? okPacket
                : Promise.reject(new Error(`No user deleted - user id ${userId}`)));
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        user.tasks = JSON.stringify(user.tasks)
        var query = `UPDATE user SET
        name = '${user.name}',
        username = '${user.username}',
        password = '${user.password}',
        _id = '${user._id}',
        tasks = '${user.tasks}'
        WHERE user._id = '${user._id}'`;
        var okPacket = await dbService.runSQL(query);
        const userToReturn = _readyUserForSend(user)
        if (okPacket.affectedRows !== 0) return userToReturn;
        throw new Error(`No user updated - user id ${user._id}`);
    } catch (err) {
        console.log('err:', err)
    }
}

async function addUser(user) {
    try {
        user._id = makeId(20)
        user.tasks = JSON.stringify(user.tasks)
        var query = `INSERT INTO user
        (name, username, password, _id, tasks) VALUES 
        ('${user.name}', '${user.username}', '${user.password}', '${user._id}', '${user.tasks}')`;
        await dbService.runSQL(query)
    } catch (err) {
        console.log('err:', err)
    }
}

function _readyUserForSend(user) {
    user.tasks = JSON.parse(user.tasks)
    return user;
}

function makeId(length = 11) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}