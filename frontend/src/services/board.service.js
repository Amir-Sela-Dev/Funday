import { storageService } from './async-storage.service'
import { utilService } from './util.service'

const STORAGE_KEY = 'boardDB'
const USER_KEY = 'userDB'

export const boardService = {
    query,
    get,
    save,
    remove,
    getEmptyBoard,
    getEmptyTask,
    creatBoards,
    getDefaultLabels,
    getEmptyGroup,
    getDefaultBoardFilter,
    getDefaultGroupFilter,
    getDefaultComment,
    getDefaultUsers,
    getDefaultPriorities,
    getEmptyActivity,
    getDefualtBoardColumes

}

window.cs = boardService
creatBoards()

async function query(filterBy = { title: '' }) {
    // return httpService.get(STORAGE_KEY, filterBy)
    try {
        let boards = await storageService.query(STORAGE_KEY)
        if (filterBy.title) {
            const regex = new RegExp(filterBy.title, 'i')
            boards = boards.filter(board => regex.test(board.title))
        }
        return boards
    } catch (err) {
        console.log('cannot load boards', err)
    }
}

function get(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
    // return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
    await storageService.remove(STORAGE_KEY, boardId)
    // return httpService.delete(`board/${boardId}`)
}

async function save(board) {
    let savedBoard
    if (board._id) {
        savedBoard = await storageService.put(STORAGE_KEY, board)
        // savedBoard = await httpService.put(`board/${board._id}`, board)
    } else {
        savedBoard = await storageService.post(STORAGE_KEY, board)
        // savedBoard = await httpService.post('board', board)
    }
    return savedBoard
}

function getDefaultUsers(boardUsers = []) {
    let defaultUsers = [
        { id: 'u001', fullname: 'Amir Yakubov', imgUrl: '001.jpg' },
        { id: 'u002', fullname: 'Amir Sela', imgUrl: '002.jpg' },
        { id: 'u003', fullname: 'Sheilan Shamilov', imgUrl: '003.jpg' }
    ]
    if (boardUsers) return defaultUsers.filter(user => !boardUsers.some(boardUser => boardUser?.id === user.id));
    return defaultUsers
}

function getEmptyBoard() {
    return {
        _id: '',
        title: 'New board',
        isStarred: false,
        archivedAt: Date.now(),
        activities: [],
        cmpsOrder: ['person', 'status', 'date', 'timeline', 'priority', 'files', 'checkbox'],
        status: [
            { id: utilService.makeId(5), txt: 'Working on it', color: '#FDAB3D' },
            { id: utilService.makeId(5), txt: 'Done', color: '#00C875' },
            { id: utilService.makeId(5), txt: 'Stuck', color: '#E2445C' },
            { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' }
        ],
        priority: [
            { id: utilService.makeId(5), txt: 'Critical', color: 'rgb(51, 51, 51)' },
            { id: utilService.makeId(5), txt: 'High', color: 'rgb(64, 22, 148)' },
            { id: utilService.makeId(5), txt: 'Medium', color: 'rgb(85, 89, 223)' },
            { id: utilService.makeId(5), txt: 'Low', color: 'rgb(87, 155, 252)' },
            { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' }
        ],
        createdBy: {
            _id: utilService.makeId(5),
            fullname: '',
            imgUrl: '',
        },
        groups: [
            {
                id: utilService.makeId(5),
                title: 'Demo data',
                archivedAt: Date.now(),
                tasks: [
                    {
                        id: utilService.makeId(5),
                        title: 'item 1',
                        status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        comments: [],
                        persons: [],
                        date: '',
                    },
                    {
                        id: utilService.makeId(5),
                        title: 'item 2',
                        status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        comments: [],
                        persons: [],
                        date: '',
                    }
                ],
                style: { color: '#e2445c' }
            },
            {
                id: utilService.makeId(5),
                title: 'Another style',
                archivedAt: Date.now(),
                tasks: [
                    {
                        id: utilService.makeId(5),
                        title: 'item 3',
                        status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        comments: [],
                        persons: [],
                        date: '',
                    },
                    {
                        id: utilService.makeId(5),
                        title: 'item 4',
                        status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        comments: [],
                        persons: [],
                        date: '',
                    }
                ],
                style: { color: '#a559d8' }
            }
        ]
    }
}


function creatBoards() {
    let boards = utilService.loadFromStorage(STORAGE_KEY)
    if (!boards || !boards.length) {
        boards = [
            {
                _id: 'uPD5q',
                title: 'Robot dev proj',
                isStarred: false,
                archivedAt: Date.now(),
                activities: [],
                cmpsOrder: ['person', 'status', 'date', 'timeline', 'priority', 'files', 'checkbox'],
                status: [
                    { id: utilService.makeId(5), txt: 'Working on it', color: '#FDAB3D' },
                    { id: utilService.makeId(5), txt: 'Done', color: '#00C875' },
                    { id: utilService.makeId(5), txt: 'Stuck', color: '#E2445C' },
                    { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' }
                ],
                priority: [
                    { id: utilService.makeId(5), txt: 'Critical', color: 'rgb(51, 51, 51)' },
                    { id: utilService.makeId(5), txt: 'High', color: 'rgb(64, 22, 148)' },
                    { id: utilService.makeId(5), txt: 'Medium', color: 'rgb(85, 89, 223)' },
                    { id: utilService.makeId(5), txt: 'Low', color: 'rgb(87, 155, 252)' },
                    { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' }
                ],
                createdBy: {
                    _id: utilService.makeId(5),
                    fullname: 'Abi Abambi',
                    imgUrl: '',
                },
                groups: [
                    {
                        id: utilService.makeId(5),
                        title: 'Group 1',
                        archivedAt: Date.now(),
                        tasks: [
                            {
                                id: utilService.makeId(5),
                                title: 'Mashu tov',
                                persons: [
                                    { id: 'u001', fullname: 'Amir Yakubov', imgUrl: '001.jpg' },
                                    { id: 'u003', fullname: 'Sheilan Shamilov', imgUrl: '003.jpg' },
                                ],
                                status: getDefaultLabels()[utilService.getRandomIntInclusive(0, 2)],
                                priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                date: "2023-01-19",
                                comments: []

                            },
                            {
                                id: utilService.makeId(5),
                                title: 'Dogma 1',
                                persons: [
                                    { id: 'u001', fullname: 'Amir Yakubov', imgUrl: '001.jpg' },
                                ],
                                status: getDefaultLabels()[utilService.getRandomIntInclusive(0, 2)],
                                priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                date: "2023-01-12",
                                comments: []

                            }
                        ],
                        style: { color: '#579bfc' }
                    },
                    {
                        id: utilService.makeId(5),
                        title: 'Demo data',
                        archivedAt: Date.now(),
                        tasks: [
                            {
                                id: utilService.makeId(5),
                                title: 'item 1',
                                status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                comments: [],
                                persons: [],
                                date: '',

                            },
                            {
                                id: utilService.makeId(5),
                                title: 'item 2',
                                status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                comments: [],
                                persons: [],
                                date: '',
                            }
                        ],
                        style: { color: '#e2445c' }
                    },
                    {
                        id: utilService.makeId(5),
                        title: 'Another style',
                        archivedAt: Date.now(),
                        tasks: [
                            {
                                id: utilService.makeId(5),
                                title: 'item 3',
                                status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                comments: [],
                                persons: [],
                                date: '',

                            },
                            {
                                id: utilService.makeId(5),
                                title: 'item 4',
                                status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                comments: [],
                                persons: [],
                                date: '',
                            }
                        ],
                        style: { color: '#a559d8' }
                    }
                ]
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, boards)
    }
}

function getEmptyTask() {
    return {
        title: '',
        persons: '',
        status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
        date: '',
        comments: [],
        priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
    }
}

function getDefaultLabels() {
    return [
        { id: utilService.makeId(5), txt: 'Working on it', color: '#FDAB3D' },
        { id: utilService.makeId(5), txt: 'Done', color: '#00C875' },
        { id: utilService.makeId(5), txt: 'Stuck', color: '#E2445C' },
        { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' }
    ]
}


function getDefaultPriorities() {
    return [
        { id: utilService.makeId(5), txt: 'Critical', color: 'rgb(51, 51, 51)' },
        { id: utilService.makeId(5), txt: 'High', color: 'rgb(64, 22, 148)' },
        { id: utilService.makeId(5), txt: 'Medium', color: 'rgb(85, 89, 223)' },
        { id: utilService.makeId(5), txt: 'Low', color: 'rgb(87, 155, 252)' },
        { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' }
    ]
}



function getEmptyGroup() {
    return {
        id: utilService.makeId(5),
        title: 'New group',
        archivedAt: Date.now(),
        tasks: [

        ],
        style: { color: '#e2445c' }
    }
}

function getDefaultBoardFilter() {
    return { title: '', isStared: false }
}

function getDefaultGroupFilter() {
    return { title: '', lables: [] }
}

function getDefaultComment() {
    return {
        id: utilService.makeId(5),
        txt: '',
        createdAt: '',
        byMember: {
            _id: 'u101',
            'fullname': 'Guest',
            imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg'
        }
    }
}

function getEmptyActivity() {

    return {
        'id': utilService.makeId(),
        'txt': '',
        'type': '',
        'createdAt': '',
        'byMember': {},
        'task': ''
    }
}

function getDefualtBoardColumes() {
    return ['person', 'status', 'date', 'timeline', 'priority', 'files', 'checkbox']
}


