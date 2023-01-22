import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import { utilService } from './util.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    changeScore
}

window.userService = userService


function getUsers() {
    return storageService.query('user')
    // return httpService.get(`user`)
}

async function getById(userId) {
    const user = await storageService.get('user', userId)
    // const user = await httpService.get(`user/${userId}`)
    return user
}

function remove(userId) {
    return storageService.remove('user', userId)
    // return httpService.delete(`user/${userId}`)
}

async function update({ _id, score }) {
    const user = await storageService.get('user', _id)
    user.score = score
    await storageService.put('user', user)

    // const user = await httpService.put(`user/${_id}`, {_id, score})
    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    return user
}

async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username)
    // const user = await httpService.post('auth/login', userCred)
    if (user) {
        // socketService.login(user._id)
        return saveLocalUser(user)
    }
}
async function signup(userCred) {
    userCred.score = 10000
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    const user = await storageService.post('user', userCred)
    // const user = await httpService.post('auth/signup', userCred)
    // socketService.login(user._id)
    return saveLocalUser(user)
}
async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    // socketService.logout()
    // return await httpService.post('auth/logout')
}

async function changeScore(by) {
    const user = getLoggedinUser()
    if (!user) throw new Error('Not loggedin')
    user.score = user.score + by || by
    await update(user)
    return user.score
}


function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl, score: user.score }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

// function createUsers() {
//     let users = utilService.loadFromStorage(USER_KEY)
//     if (!users || !users.length) {
//     }
//     users = [
//         { _id: utilService.makeId(5), fullname: 'Amir Sela', username: 'amir@gmail.com', password: 'amir123', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674231080/img3_iq3nsz.jpg' },
//         { _id: utilService.makeId(5), fullname: 'Amir Yakobuv', username: 'amiryakubov@gmail.com', password: 'amir123', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674231080/img3_iq3nsz.jpg', },
//         { _id: utilService.makeId(5), fullname: 'Sheilan Shamilov', username: 'sheilan@gmail.com', password: 'sheilan123', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674231080/img3_iq3nsz.jpg' }
//     ]
//     utilService.saveToStorage(USER_KEY, boards)
// }


// ; (async () => {
//     await userService.signup({ _id: utilService.makeId(5), fullname: 'Amir Sela', username: 'amir@gmail.com', password: 'amir123', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674231080/img3_iq3nsz.jpg' })
//     await userService.signup({ _id: utilService.makeId(5), fullname: 'Sheilan Shamilov', username: 'sheilan@gmail.com', password: 'sheilan123', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674231080/img3_iq3nsz.jpg' })
//     await userService.signup({ _id: utilService.makeId(5), fullname: 'Amir Yakobuv', username: 'amiryakubov@gmail.com', password: 'amir123', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674231080/img3_iq3nsz.jpg' })
// })()



