import { storageService } from './async-storage.service'
import { utilService } from './util.service'

const STORAGE_KEY = 'boardDB'

export const boardService = {
    query,
    get,
    save,
    remove,
    saveTask,
    getEmptyBoard,
    getEmptyTask,
    creatBoards,
    getDefaultLabels
}

window.cs = boardService
creatBoards()

async function query(filterBy = { title: '' }) {
    // return httpService.get(STORAGE_KEY, filterBy)
    return storageService.query(STORAGE_KEY)
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
        // board.owner = userService.getLoggedinUser()
        savedBoard = await storageService.post(STORAGE_KEY, board)
        // savedBoard = await httpService.post('board', board)
    }
    return savedBoard
}

function getEmptyBoard() {
    return {
        _id: '',
        title: 'New board',
        isStarred: false,
        archivedAt: Date.now(),
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
                        title: 'item 1'
                    },
                    {
                        id: utilService.makeId(5),
                        title: 'item 2'
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
                        title: 'item 3'
                    },
                    {
                        id: utilService.makeId(5),
                        title: 'item 4'
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
                _id: utilService.makeId(5),
                title: 'Robot dev proj',
                isStarred: false,
                archivedAt: Date.now(),
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
                                // TODO: Add minimal user suport
                                // for now we use persons as count and render icons
                                persons: utilService.getRandomIntInclusive(1, 3),
                                status: getDefaultLabels()[utilService.getRandomIntInclusive(0, 2)],
                                date: utilService.randomTime()
                            },
                            {
                                id: utilService.makeId(5),
                                title: 'Dogma 1',
                                persons: utilService.getRandomIntInclusive(1, 3),
                                status: getDefaultLabels()[utilService.getRandomIntInclusive(0, 2)],
                                date: utilService.randomTime()
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
                                title: 'item 1'
                            },
                            {
                                id: utilService.makeId(5),
                                title: 'item 2'
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
                                title: 'item 3'
                            },
                            {
                                id: utilService.makeId(5),
                                title: 'item 4'
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
export async function saveTask(board, groupId, task) {
    let boardToSave = board
    if (!task.id) task.id = utilService.makeId(5)
    let refGroup = boardToSave.groups.find(group => group.id === groupId)

    refGroup.tasks.push(task)

    return boardToSave
}

function getEmptyTask() {
    return {
        title: '',
        persons: 0,
        status: {},
        date: utilService.randomTime(),
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

