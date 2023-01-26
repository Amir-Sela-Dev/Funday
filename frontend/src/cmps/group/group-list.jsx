import { useEffect, useRef } from 'react'
import { useState } from "react"
import { boardService } from "../../services/board.service";
import { showErrorMsg } from "../../services/event-bus.service";
import { utilService } from '../../services/util.service';
import { addGroup, removeGroup, saveGroup, saveTask } from "../../store/board.action";
import { LabelSelect } from '../lable-select';
import { GroupPreview } from "./group-preview";
import { Button, Flex, IconButton, Menu, MenuButton, MenuDivider, DialogContentContainer, Icon } from "monday-ui-react-core";
import {
    Add, Search, Person, Filter, Sort, Group,
    Table, DropdownChevronDown, Group as GroupIcon,
    Item as ItemIcon
} from "monday-ui-react-core/icons";
import { DragDropContext } from 'react-beautiful-dnd';


export function GroupList({ board, toggleModal, setFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(boardService.getDefaultGroupFilter())
    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [isLablesOpen, setIsLablesOpen] = useState(false)
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [isSeachClicked, setIsSeachClicked] = useState(false)
    const [boardActionsModal, setBoardActionsModal] = useState(false)

    function onToggleBoardActionsModal() {
        setBoardActionsModal(!boardActionsModal)
    }
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

    async function onUpdateGroup(board, groupId) {
        saveGroup()
    }

    async function onRemoveGroup(groupId) {
        removeGroup(board, groupId)
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


    function handleOnGroupDragEnd(result) {
        console.log('@@@@@@@', result);
        // const items = Array.from(tasks)
        // const [reorderedItem] = items.splice(result.source.index, 1)
        // items.splice(result.destination.index, 0, reorderedItem)
        // setTasks(items)
        // saveGroupAfterDrag(items)
    }


    const searchIcon = 'search-board.svg'
    const arrowDown = 'arrow-down.svg'
    const arrowDownWhite = 'arrow-down.png'

    return (
        <DragDropContext onDragEnd={handleOnGroupDragEnd}>
            <ul className="group-list">
                <IconButton
                    className={`icon-btn-add ${boardActionsModal ? 'active' : ''}`}
                    icon={Add}
                    color={IconButton.colors.ON_PRIMARY_COLOR}
                    size={IconButton.sizes.LARGE}
                    onClick={onToggleBoardActionsModal}
                />

                {boardActionsModal &&
                    <DialogContentContainer
                        key="small"
                        className={`board-actions-modal ${boardActionsModal ? 'active' : ''}`}>
                        {/* <Menu className="board-actions-mobile">
                        
            </Menu> */}
                        <MenuButton
                            className="board-actions-mobile"
                            text="New item"
                            onClick={() => { onAddItem(false) }}
                            component={ItemIcon}
                            componentPosition={MenuButton.componentPositions.END} />
                        <MenuDivider />
                        <MenuButton
                            className="board-actions-mobile"
                            text="New Group"
                            onClick={() => { onAddItem(true) }}
                            component={ItemIcon}
                            componentPosition={MenuButton.componentPositions.END} />
                        {/* <MenuButton className="board-actions-mobile" text="Open" component={DropdownChevronDown} componentPosition={MenuButton.componentPositions.END} onClick={() => {
                console.log('hi')
            }} /> */}
                    </DialogContentContainer>
                }
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
                {board.groups.map((group, index) =>
                    <li className="group-preview-line" key={group.id}>
                        <GroupPreview board={board} group={group} toggleModal={toggleModal} onRemoveGroup={onRemoveGroup} index={index} />
                    </li>)}
            </ul>
        </DragDropContext>
    )
}