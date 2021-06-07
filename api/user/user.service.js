
const dbService = require('../../services/db.service.js')
const logger = require('../../services/logger.service')
const boardService = require('../board/board.service')

module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    try {
        var query = (Object.keys(filter).length) ? `SELECT * FROM user WHERE name LIKE '%${filter}%'` : `SELECT * FROM user`
        const users = await dbService.runSQL(query)
        const usersToReturn = users.map(user => _readyUserForSend(user))
        return usersToReturn;
    } catch (err) {
        console.log('err:', err)
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ '_id': ObjectId(userId) })
        delete user.password

        user.givenBoards = await boardService.query({ byUserId: ObjectId(user._id) })
        user.givenBoards = user.givenBoards.map(board => {
            delete board.byUser
            return board
        })

        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}
async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        // peek only updatable fields!
        const userToSave = {
            _id: ObjectId(user._id),
            username: user.username,
            fullname: user.fullname,
            score: user.score
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ '_id': userToSave._id }, { $set: userToSave })
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}
const user = { name: 'Aviv Zohar', username: 'avivzo9', password: 1234, tasks: [] }
// add(user)
async function add(user) {
    try {
        user.tasks = JSON.stringify(user.tasks)
        var query = `INSERT INTO user
        (name, username, password, tasks) VALUES 
        ('${user.name}', '${user.username}', '${user.password}', '${user.tasks}')`;
        await dbService.runSQL(query)
    } catch (err) {
        console.log('err:', err)
    }
}

function _readyUserForSend(user) {
    user.tasks = JSON.parse(user.tasks)
    return user;
}