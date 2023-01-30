import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { loadBoard } from "../../store/board.action"
import { useSelector } from 'react-redux'
import { GroupList } from "../group/group-list"
import { TaskDetails } from "../task/task-details"
import { boardService } from "../../services/board.service"
import { saveBoard } from "../../store/board.action";
import { showSuccessMsg } from "../../services/event-bus.service"
import { LabelSelect } from '../lable-select';
import { Tab, TabList } from "monday-ui-react-core";
import { Home } from "monday-ui-react-core/icons";
import { showErrorMsg } from "../../services/event-bus.service";
import { Button, TextField, Flex, IconButton, Menu, MenuButton, MenuDivider, DialogContentContainer, Icon } from "monday-ui-react-core";
import { Add, Search, Person, Filter, Sort, Group, Table, DropdownChevronDown, Group as GroupIcon, Invite, Info, Favorite } from "monday-ui-react-core/icons";
import { addGroup, removeGroup, saveGroup, saveTask } from "../../store/board.action";
import { Droppable } from 'react-beautiful-dnd';
import { socketService, SOCKET_EMIT_LOAD_BOARD, SOCKET_EMIT_SET_TOPIC, SOCKET_EVENT_ADD_MSG, SOCKET_EVENT_BOARD_UPDATED } from "../../services/socket.service"
import { BoardInviteMenu } from "./board-invite-menu"
import { loadUsers } from "../../store/user.actions"

import { KanbansGroupList } from "../kanban/kanban-group-list"
import { BoardListMenu } from "./board-list-menu"

export function BoardDetails({ setBoardToDrag, board }) {
    // let { board } = useSelector((storeState) => storeState.boardModule)
    let { users } = useSelector((storeState) => storeState.userModule)
    const [boardTitle, setBoardTitle] = useState('')
    const [modalState, setModalState] = useState(false)
    const [boardActionsModal, setBoardActionsModal] = useState(false)
    const [inviteModal, setInviteModal] = useState(false)
    const [boardListModal, setBoardListModal] = useState(false)
    const [task, setTask] = useState(null)
    const [group, setGroup] = useState(null)
    const [filterByToEdit, setFilterByToEdit] = useState(boardService.getDefaultGroupFilter())
    const [isKanban, setIsKanban] = useState(false)
    const [isDarkScreen, setIsDarkScreen] = useState(false)
    const { boardId } = useParams()

    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [isSeachClicked, setIsSeachClicked] = useState(false)

    useEffect(() => {
        onLoadBoard(boardId, filterByToEdit)
        onLoadUsers()
        setBoardTitle('')
        socketService.on(SOCKET_EMIT_LOAD_BOARD, onLoadBoard)
        socketService.emit(SOCKET_EMIT_SET_TOPIC, boardId)
        return () => {
            socketService.off(SOCKET_EMIT_LOAD_BOARD, onLoadBoard)
            socketService.off(SOCKET_EMIT_SET_TOPIC, boardId)
        }

    }, [filterByToEdit])

    useEffect(() => {
        setFilter(filterByToEdit)
        // setFilter.current(filterByToEdit)
    }, [filterByToEdit])

    useEffect(() => {
        if (!board) return
        setBoardTitle(board.title)
        // setFilter.current(filterByToEdit)
    }, [board])

    useEffect(() => {
        function handleClickOutside(event) {
            if (event.target.closest('.search') === null) {
                setIsSeachClicked(false);
            }
        }

        if (isSeachClicked) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [isSeachClicked]);


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

    async function onLoadBoard(boardId, filterBy) {
        try {
            setBoardTitle(board?.title)
            let boardToLoad = await loadBoard(boardId, filterBy)
            setBoardToDrag(boardToLoad)
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

    function setFilter(filterBy) {
        onLoadBoard(filterBy)
    }

    async function onRenameBoard(event) {
        event.preventDefault()
        if (!boardTitle) {
            setBoardTitle('New board')
            return
        }
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
        console.log('target', target);
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function handleFilterChangeMonday(value) {
        console.log('filterage', value)
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, 'title': value }))
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
    const loader1 = 'Loader1.svg'
    const loader2 = 'Loader2.svg'
    const loader3 = 'Loader3.svg'
    const arrowLeftImg = 'arrow-left.svg'
    const optionIcon = 'option-icon.svg'

    if (!board) return <img className="loader" src={require(`/src/assets/img/${loader2}`)} />
    return (
        <section className="board-details">
            <div className="sticky-board-header">
                <div className="board-title-wrap flex">
                    <Link to='/'>
                        <img className="arrow-left-img" src={require(`/src/assets/img/${arrowLeftImg}`)} />
                    </Link>
                    <span
                        className="board-title mobile"
                        style={{
                            width: `${(board?.title?.length)}ch`
                        }}>{boardTitle || board?.title}
                    </span>
                    <form onSubmit={onRenameBoard} >
                        <input
                            className="board-title"
                            style={{
                                width: `${(boardTitle?.length + 2)}ch`
                            }}
                            type="text"
                            value={boardTitle || board?.title}
                            onChange={handleInputChange}
                            onBlur={ev => { onRenameBoard(ev) }}
                        />
                    </form>
                    {/* <img className="info-icon title-icon" src={require(`/src/assets/img/${infoIcon}`)} /> */}
                    {/* <Icon className="icon-info" icon={Info} iconSize={20} />
                    <Icon className="icon-star" icon={Favorite} iconSize={20} /> */}
                    {/* <img className="star-icon title-icon" src={require(`/src/assets/img/${starIcon}`)} /> */}
                    {inviteModal && <BoardInviteMenu setModalState={setInviteModal} />}
                    {boardListModal && <BoardListMenu setBoardListModal={setBoardListModal} />}

                    <div className="invite-users" onClick={() => {
                        setInviteModal(true)
                    }}>
                        <Button className="user-invite-btn" leftIcon={Invite}>
                            {'Invite' + (board.users ? ` / ${board.users.length}` : '')}
                        </Button>
                        <Button className="user-invite-btn mobile" leftIcon={Invite} size={Button.sizes.XS} noSidePadding={true}>
                            {(board.users ? `/ ${board.users.length}` : '')}
                        </Button>
                    </div>
                    <img className="option-icon-mobile" src={require(`/src/assets/img/${optionIcon}`)}
                        onClick={() => { setBoardListModal(true) }} />
                </div>
                <TabList className='tab-lists'>
                    <Tab className='board-details-tab' style={{ color: "  #0070e5", border: 'black solid 1px' }} icon={Home} active onClick={() => { setIsKanban(false) }}>
                        Main Table
                    </Tab>

                    <hr />

                    <Tab className='tab' style={{ color: "  #0070e5" }} onClick={() => { setIsKanban(true) }}>
                        Kanban
                    </Tab>
                </TabList>

                <div className="board-second-title-wrap">
                    <hr className="group-list-main-hr" />
                    <div className="board-actions flex">
                        <Flex style={{ width: "100%" }}>
                            <button className="new-group-btn" onClick={() => { onAddItem(false) }}><span>New item</span></button>
                            <button className='new-group-btn arrow-down-new-group'
                                onClick={toggleNewTaskModal}>
                                <img className="arrow-down-img" src={require(`/src/assets/img/${arrowDownWhite}`)} />
                            </button>

                            {isNewTaskModalOpen && <div className="menu-modal modal-wrap">

                                <div className="new-task-modal">
                                    <div className="menu-modal-option new-group-btn-option flex"
                                        onClick={() => { onAddItem(true) }}>
                                        <Icon icon={GroupIcon} />
                                        <p>New Group</p>
                                    </div>
                                </div>

                            </div>}

                            {/* <Button leftIcon={Add}>Add</Button> */}
                            <Button className={`bar-icon search-btn-board-details`}
                                onClick={toggleSearchBar}
                                style={{ display: isSeachClicked ? 'none' : 'inline-flex' }}
                                kind={Button.kinds.TERTIARY}
                                leftIcon={Search}>
                                <span>Search</span>
                            </Button>
                            {isSeachClicked &&
                                <div className="search-input-desktop search flex">
                                    <TextField
                                        iconName={Search}
                                        placeholder="Search"
                                        wrapperClassName="monday-storybook-text-field_size"
                                        onChange={handleFilterChangeMonday}
                                        onBlur={() => { setIsSeachClicked(false) }}
                                    />
                                </div>}
                            <div
                                className={"search-bar-mobile flex" + (isSeachClicked ? ' on' : '')}>
                                <span
                                    className={`cancel-btn ${isSeachClicked ? 'on' : 'off'}`}
                                    onClick={() => { toggleSearchBar(false) }}>Cancel</span>
                                <div className={`group-search-filter flex`}
                                    style={{ display: isSeachClicked ? 'flex' : 'none' }}>
                                    <img className="search-board-icon board-icon" src={require(`/src/assets/img/${searchIcon}`)} />
                                    <input type="text"
                                        onChange={handleFilterChange}
                                        value={filterByToEdit.title} placeholder='Search'
                                        name='title' />
                                </div>
                            </div>
                            {/* <Button className='bar-search'
                                kind={Button.kinds.TERTIARY}
                                rightIcon={Search}>

                            </Button> */}

                            <Button className='bar-icon bar-person' kind={Button.kinds.TERTIARY} leftIcon={Person}>
                                Person
                            </Button>
                            <Button className={'bar-tables' + (isSeachClicked ? ' search-clicked' : '')} kind={Button.kinds.TERTIARY}
                                leftIcon={Table}
                                rightIcon={DropdownChevronDown}>
                                Main Table
                            </Button>
                            <Button className={'bar-filter' + (isSeachClicked ? ' search-clicked' : '')} kind={Button.kinds.TERTIARY}
                                onClick={toggleFilterModal}
                                leftIcon={Filter}>
                                Filter
                                {isFilterModalOpen && <div className="menu-modal modal-wrap filter-modal"
                                    onClick={(e) => { e.stopPropagation() }}>
                                    <LabelSelect handleLableChange={handleLableChange} lables={lables} />
                                </div>}

                            </Button>
                            <Button className='bar-icon bar-sort' kind={Button.kinds.TERTIARY} leftIcon={Sort}>
                                Sort
                            </Button>
                        </Flex>
                    </div>
                </div>
            </div >
            {!isKanban && <Droppable droppableId="gruopList" type="group">
                {(provided) => (

                    <div className="drag-groups-container"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >

                        <GroupList board={board} toggleModal={toggleModal} setFilter={setFilter} setIsDarkScreen={setIsDarkScreen} />
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            }
            {isDarkScreen && <div onClick={() => { setIsDarkScreen(false) }} className="dark-screen"></div>}
            {/* {isKanbanInfo && <div onClick={() => { setIsDarkScreen(false) }} className="dark-screen"></div>} */}

            {isKanban && <Droppable droppableId="gruopList" type="group">
                {(provided) => (

                    <div className="drag-groups-container"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >

                        <KanbansGroupList board={board} toggleModal={toggleModal} setFilter={setFilter} setIsDarkScreen={setIsDarkScreen} />
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            }



            <TaskDetails closeModal={closeModal} modalState={modalState} task={task} group={group} board={board} currBoardId={boardId} />
        </section >

    )
}