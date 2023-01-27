import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { loadBoard } from "../../store/board.action"
import { useSelector } from 'react-redux'
import { GroupList } from "../group/group-list"
import { TaskDetails } from "../task/task-details"
import { boardService } from "../../services/board.service"
import { saveBoard } from "../../store/board.action";
import { showSuccessMsg } from "../../services/event-bus.service"
import { LabelSelect } from '../lable-select';
import { Tab } from "monday-ui-react-core";
import { Home } from "monday-ui-react-core/icons";
import { showErrorMsg } from "../../services/event-bus.service";
import { Button, Flex, IconButton, Menu, MenuButton, MenuTitle, TextField, MenuDivider, DialogContentContainer, Icon } from "monday-ui-react-core";
import { Add, Search, Person, Filter, Sort, Group, Table, DropdownChevronDown, Group as GroupIcon, Item as ItemIcon, Email, Invite} from "monday-ui-react-core/icons";
import { addGroup, removeGroup, saveGroup, saveTask } from "../../store/board.action";
import { loadUserByUsername, loadUsers } from "../../store/user.actions"
import { BoardInviteMenu } from "./board-invite-menu"

export function BoardDetails() {
    let { board } = useSelector((storeState) => storeState.boardModule)
    let { users } = useSelector((storeState) => storeState.userModule)
    const [boardTitle, setBoardTitle] = useState('')
    const [modalState, setModalState] = useState(false)
    const [boardActionsModal, setBoardActionsModal] = useState(false)
    const [inviteModal, setInviteModal] = useState(false)
    const [task, setTask] = useState(null)
    const [group, setGroup] = useState(null)
    const [filterByToEdit, setFilterByToEdit] = useState(boardService.getDefaultGroupFilter())
    const { boardId } = useParams()

    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [isSeachClicked, setIsSeachClicked] = useState(false)

    useEffect(() => {
        onLoadBoard(filterByToEdit)
        onLoadUsers()
        setBoardTitle('')
    }, [])



    useEffect(() => {
        setFilter(filterByToEdit)
        // setFilter.current(filterByToEdit)
    }, [filterByToEdit])

    async function onAddItem(isGroup) {
        try {
            let itemToSave;
            if (isGroup) {
                itemToSave = boardService.getEmptyGroup()
                await addGroup(itemToSave, board)
            }
            else {
                itemToSave = boardService.getEmptyTask()
                itemToSave.title = `New Item`
                await saveTask(board, 0, itemToSave)
            }
        } catch (err) {
            showErrorMsg('Cannot save board')
        }
    }


    function onToggleBoardActionsModal() {
        setBoardActionsModal(!boardActionsModal)
    }
    function toggleModal(board, group, task = '') {
        setTask(task)
        setGroup(group)
        setModalState(!modalState)
    }

    function closeModal() {
        setModalState(!modalState)
    }

    async function onLoadBoard(filterBy) {
        try {
            setBoardTitle(board?.title)
            await loadBoard(boardId, filterBy)
            console.log('Loaded board successfully', board);
        } catch (err) {
            console.log('Couldn\'t load board..', err);
        }
    }

    async function onLoadUsers() {
        try {
            await loadUsers()
            console.log('Loaded user successfully', users);
        } catch (err) {
            console.log('Couldn\'t load users..', err);
        }
    }

    async function getUserByName(username) {
        try {
            const foundUser = await users.find(user => user.username === username)
            console.log('Found user!', foundUser)
        }
        catch (err) {
            console.log('User not found', err)
        }
    }

    function setFilter(filterBy) {
        onLoadBoard(filterBy)
    }

    async function onRenameBoard(event) {
        event.preventDefault()
        if (!board?.title.length) return
        try {
            await saveBoard({ ...board, title: boardTitle })
            setBoardTitle('')
            showSuccessMsg('Board updated')
        } catch (err) {
            console.log('error changing board name', err)
        }
    }

    function handleInputChange(event) {
        setBoardTitle(event.target.value)
    }

    function handleFilterChange({ target }) {
        let { value, name: field } = target
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function handleLableChange(lables) {
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, lables: lables }))
    }

    function toggleNewTaskModal() {
        setIsNewTaskModalOpen(!isNewTaskModalOpen)
    }

    function toggleFilterModal() {
        setIsFilterModalOpen(!isFilterModalOpen)
    }

    function toggleSearchBar(searchState = true) {
        setIsSeachClicked(searchState)
    }

    const infoIcon = 'info.svg'
    const starIcon = 'star.svg'
    const searchIcon = 'search-board.svg'
    const arrowDownWhite = 'arrow-down.png'

    if (!board) return <div>Loading...</div>
    return (
        <section className="board-details">
            <div className="sticky-board-header">


                <div className="board-title-wrap flex">
                    <span
                        className="board-title mobile"
                        style={{
                            width: `${(board?.title?.length - 1.5 || 10)}ch`
                        }}>{boardTitle || board?.title}
                    </span>
                    <form onSubmit={onRenameBoard} >
                        <input
                            className="board-title"
                            style={{
                                width: `${(board.title.length - 1.5 || 10)}ch`
                            }}
                            type="text"
                            value={boardTitle || board.title}
                            onChange={handleInputChange}
                            onBlur={ev => { onRenameBoard(ev) }}
                        />
                    </form>
                    <img className="info-icon title-icon" src={require(`/src/assets/img/${infoIcon}`)} />
                    <img className="star-icon title-icon" src={require(`/src/assets/img/${starIcon}`)} />
                    {inviteModal && <BoardInviteMenu setModalState={setInviteModal} />
                    }

                    <div className="invite-users" onClick={() => {
                        getUserByName('sheilan@gmail.com')
                        setInviteModal(true)
                    }}>
                        <Button className="user-invite-btn" leftIcon={Invite}>
                            {'Invite' + (board.users ? ` / ${board.users.length}` : '')}
                        </Button>
                    </div>
                </div>
                <div>
                    <Tab className='board-details-tab' style={{ color: "  #0070e5" }} icon={Home} active>
                        Main Table
                    </Tab>
                </div>
            </div>

            <GroupList board={board} toggleModal={toggleModal} setFilter={setFilter} />
            <TaskDetails closeModal={closeModal} modalState={modalState} task={task} group={group} board={board} />
        </section >)
}