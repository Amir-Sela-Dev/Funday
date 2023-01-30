import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import { utilService } from './util.service'

const STORAGE_KEY = 'boardDB111'
const USER_KEY = 'userDB'
const BASE_URL = 'board/'

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
// creatBoards()

async function query(filterBy = { title: '' }) {
    const queryParams = `?title=${filterBy.title}`
    console.log(queryParams);
    return httpService.get(BASE_URL + queryParams)
    // try {
    //     let boards = await storageService.query(STORAGE_KEY)
    //     if (filterBy.title) {
    //         const regex = new RegExp(filterBy.title, 'i')
    //         boards = boards.filter(board => regex.test(board.title))
    //     }
    //     return boards
    // } catch (err) {
    //     console.log('cannot load boards', err)
    // }
}

function get(boardId) {
    // return storageService.get(STORAGE_KEY, boardId)
    return httpService.get(BASE_URL + boardId)
}

async function remove(boardId) {
    // await storageService.remove(STORAGE_KEY, boardId)
    return httpService.delete(BASE_URL + boardId)
}

async function save(board) {
    let savedBoard
    if (board._id) {
        console.log('from service', board);
        // savedBoard = await storageService.put(STORAGE_KEY, board)
        savedBoard = await httpService.put(BASE_URL + board._id, board)
    } else {
        // board.owner = userService.getLoggedinUser()
        // savedBoard = await storageService.post(STORAGE_KEY, board)
        console.log('BASE URL', BASE_URL)
        console.log('board posted', board);
        savedBoard = await httpService.post(BASE_URL, board)
    }
    return savedBoard
}

function getDefaultUsers(boardUsers = []) {
    let defaultUsers = [
        { id: 'u001', fullname: 'Amir Yakubov', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674462524/profile_vyll5h.jpg' },
        { id: 'u002', fullname: 'Amir Sela', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674462764/img3_zynodi.jpg' },
        { id: 'u003', fullname: 'Sheilan Shamilov', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674462891/image_1_w0fgmh.png' }
    ]
    if (boardUsers) return defaultUsers.filter(user => !boardUsers.some(boardUser => boardUser?.id === user.id));
    return defaultUsers
}

function getEmptyBoard() {
    return {
        title: 'New board',
        isStarred: false,
        archivedAt: Date.now(),
        activities: [],
        cmpsOrder: ['person', 'status', 'date', 'timeline', 'priority', 'files', 'checkbox'],
        users: [],
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
                        timeline: '',
                        isMark: false
                    },
                    {
                        id: utilService.makeId(5),
                        title: 'item 2',
                        status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        comments: [],
                        persons: [],
                        date: '',
                        timeline: '',
                        isMark: false

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
                        timeline: '',
                        isMark: false

                    },
                    {
                        id: utilService.makeId(5),
                        title: 'item 4',
                        status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                        comments: [],
                        persons: [],
                        date: '',
                        timeline: '',
                        isMark: false

                    }
                ],
                style: { color: '#a559d8' }
            }
        ]
    }
}

//#828282

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
                                    { id: 'u001', fullname: 'Amir Yakubov', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674462524/profile_vyll5h.jpg' },
                                    { id: 'u003', fullname: 'Sheilan Shamilov', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674462891/image_1_w0fgmh.png' },
                                ],
                                status: getDefaultLabels()[utilService.getRandomIntInclusive(0, 2)],
                                priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                date: "",
                                timeline: '',
                                comments: [],
                                isMark: false


                            },
                            {
                                id: utilService.makeId(5),
                                title: 'Dogma 1',
                                persons: [
                                    { id: 'u001', fullname: 'Amir Yakubov', imgUrl: 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674462524/profile_vyll5h.jpg' },
                                ],
                                status: getDefaultLabels()[utilService.getRandomIntInclusive(0, 2)],
                                priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                date: "",
                                timeline: '',
                                comments: [],
                                isMark: false


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
                                timeline: '',
                                isMark: false


                            },
                            {
                                id: utilService.makeId(5),
                                title: 'item 2',
                                status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                comments: [],
                                persons: [],
                                date: '',
                                timeline: '',
                                isMark: false

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
                                timeline: '',
                                isMark: false


                            },
                            {
                                id: utilService.makeId(5),
                                title: 'item 4',
                                status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
                                comments: [],
                                persons: [],
                                date: '',
                                timeline: '',
                                isMark: false

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


// boardService
// export async function saveTask(board, groupId, task) {
//     let boardToSave = board
//     let refGroup = boardToSave.groups.find(group => group.id === groupId)
//     console.log(task)
//     if (!task.id) {
//         task.id = utilService.makeId(5)
//         refGroup.tasks.push(task)
//     }
//     else {
//         const taskIdx = refGroup.tasks.findIndex(currTask => currTask.id === task.id)
//         refGroup.tasks.splice(taskIdx, 1, task)
//     }

//     return boardToSave
// }

function getEmptyTask() {
    return {
        title: '',
        persons: '',
        status: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
        date: '',
        comments: [],
        priority: { id: utilService.makeId(5), txt: 'Default', color: 'rgb(185, 185, 185)' },
        isMark: false

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
        'from': '',
        'to': '',
        'type': '',
        'createdAt': '',
        'byMember': {},
        'task': '',
    }
}

function getDefualtBoardColumes() {
    return ['person', 'status', 'date', 'timeline', 'priority', 'files', 'checkbox']
}



// const activity = {
//     'id': makeId(),
//     'txt': 'Changed Color',
//     'createdAt': Date.now(),
//     'byMember': userService.getLoggedinUser(),
//     'task': task
// }

// const user = {
//     '_id': 'u101',
//     'fullname': 'Abi Abambi',
//     'username': 'abi@ababmi.com',
//     'password': 'aBambi123',
//     'imgUrl': 'http://some-img.jpg',
//     'mentions': [{ //optional
//         'id': 'm101',
//         'boardId': 'm101',
//         'taskId': 't101'
//     }]
// }

// // Store - saveTask
// function storeSaveTask(task, activity) {

//     board = boardService.saveTask(boardId, groupId, task, activity)
//     // commit(ACTION) // dispatch(ACTION)
// }

// // boardService
// function saveTask(boardId, groupId, task, activity) {
//     const board = getById(boardId)
//     // PUT /api/board/b123/task/t678

//     // TODO: find the task, and update
//     board.activities.unshift(activity)
//     saveBoard(board)
//     // return board
//     // return task
// }

// const board = {
//     '_id': 'b101',
//     'title': 'Robot dev proj',
//     'isStarred': false,
//     'archivedAt': 1589983468418,
//     'createdBy': {
//         '_id': 'u101',
//         'fullname': 'Abi Abambi',
//         'imgUrl': 'http://some-img'
//     },
//     'style': {},
//     'labels': [
//         {
//             'id': 'l101',
//             'title': 'Done',
//             'color': '#61bd4f'
//         },
//         {
//             'id': 'l102',
//             'title': 'Progress',
//             'color': '#61bd33'
//         }
//     ],
//     'members': [
//         {
//             '_id': 'u101',
//             'fullname': 'Tal Tarablus',
//             'imgUrl': 'https://www.google.com'
//         }
//     ],
//     'groups': [
//         {
//             'id': 'g101',
//             'title': 'Group 1',
//             'archivedAt': 1589983468418,
//             'tasks': [
//                 {
//                     'id': 'c101',
//                     'title': 'Replace logo'
//                 },
//                 {
//                     'id': 'c102',
//                     'title': 'Add Samples'
//                 }
//             ],
//             'style': {}
//         },
//         {
//             'id': 'g102',
//             'title': 'Group 2',
//             'tasks': [
//                 {
//                     'id': 'c103',
//                     'title': 'Do that',
//                     'archivedAt': 1589983468418,
//                 },
//                 {
//                     'id': 'c104',
//                     'title': 'Help me',
//                     'status': 'in-progress', // monday
//                     'priority': 'high',
//                     'description': 'description',
//                     'comments': [
//                         {
//                             'id': 'ZdPnm',
//                             'txt': 'also @yaronb please CR this',
//                             'createdAt': 1590999817436,
//                             'byMember': {
//                                 '_id': 'u101',
//                                 'fullname': 'Tal Tarablus',
//                                 'imgUrl': 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg'
//                             }
//                         }
//                     ],
//                     'checklists': [
//                         {
//                             'id': 'YEhmF',
//                             'title': 'Checklist',
//                             'todos': [
//                                 {
//                                     'id': '212jX',
//                                     'title': 'To Do 1',
//                                     'isDone': false
//                                 }
//                             ]
//                         }
//                     ],
//                     'memberIds': ['u101'],
//                     'labelIds': ['l101', 'l102'],
//                     'dueDate': 16156215211,
//                     'byMember': {
//                         '_id': 'u101',
//                         'username': 'Tal',
//                         'fullname': 'Tal Tarablus',
//                         'imgUrl': 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg'
//                     },
//                     'style': {
//                         'bgColor': '#26de81'
//                     }
//                 }
//             ],
//             'style': {}
//         }
//     ],
//     'activities': [
//         {
//             'id': 'a101',
//             'txt': 'Changed Color',
//             'createdAt': 154514,
//             'byMember': {
//                 '_id': 'u101',
//                 'fullname': 'Abi Abambi',
//                 'imgUrl': 'http://some-img'
//             },
//             'task': {
//                 'id': 'c101',
//                 'title': 'Replace Logo'
//             }
//         }
//     ],

//     'cmpsOrder': ['status-picker', 'member-picker', 'date-picker']
// }


