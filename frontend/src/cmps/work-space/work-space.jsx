import React, { useMemo } from 'react';
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../../services/event-bus.service.js'
import { boardService } from '../../services/board.service'
import { useState } from "react"
import { loadBoards, saveBoard } from '../../store/board.action'
import { BoardList } from '../board/board-list.jsx'
import { ListItem, ListItemIcon, Menu, MenuItem } from "monday-ui-react-core"
import { Add as AddIcon, Filter as FilterIcon, Search as SearchIcon } from "monday-ui-react-core/icons";

export function WorkSpace({ toggleWorkspace, setIsClicked, isClicked }) {
    const { boards } = useSelector((storeState) => storeState.boardModule)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isNavModalClose, setIsNavModalClose] = useState(false)
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false)
    const [boardName, setboardName] = useState('')
    const [filterByToEdit, setFilterByToEdit] = useState(boardService.getDefaultBoardFilter())

    useEffect(() => {
        onLoadBoards()
    }, [filterByToEdit])

    async function onLoadBoards() {
        try {
            await loadBoards(filterByToEdit)
        }
        catch (err) {
            showErrorMsg('Cannot load boards')
        }
    }

    async function onAddBoard(ev) {
        ev.preventDefault()
        try {
            let boardToSave = boardService.getEmptyBoard()
            boardToSave.title = boardName
            await saveBoard(boardToSave)
            onCloseModal()
        } catch (err) {
            showErrorMsg('Cannot save board')
        }
    }

    function handleChange({ target }) {
        let { value } = target
        setboardName(value)
    }

    function handleFilterChange({ target }) {
        let { value, name: field } = target
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onCloseModal() {
        setboardName('')
        setIsAddModalOpen(false)
    }

    function setToggleWorkspace() {
        toggleWorkspace()
        setIsNavModalClose(!isNavModalClose)
    }

    const arrowDownIcon = 'arrow-down.svg'
    const homeIcon = 'home.svg'
    const arrowLeftIcon = 'arrow-left.svg'

    return <section className={`work-space ${isNavModalClose ? 'close-workspace' : ''}`}>
        <div className="toggle-nemu-btn-wrap">
            <div className="toggle-menu-btn" onClick={setToggleWorkspace}>
                <img className="arrow-left-icon" src={require(`/src/assets/img/${arrowLeftIcon}`)} />
            </div>
        </div>
        <div className="workspace-header flex">
            <span className='workspace-txt'>Workspace</span>
        </div>
        <div className="main-workspace-dropdown flex">
            <div className="main-icon">M
                <img className="home-icon" src={require(`/src/assets/img/${homeIcon}`)} />
            </div>
            <span>Main workspace</span>
            <img className="arrow-down-icon" src={require(`/src/assets/img/${arrowDownIcon}`)} />
        </div>
        <ListItem className="board-item" onClick={() => { setIsAddModalOpen(true) }}>
            <div className="board-wrap">
                <ListItemIcon icon={AddIcon} />
                <span>Add</span>
            </div>
        </ListItem>
        <ListItem className="board-item">
            <div className="board-wrap">
                <ListItemIcon icon={FilterIcon} />
                <span>Filters</span>
            </div>
        </ListItem>
        <ListItem className="board-item">
            <div className="board-wrap board-search">
                <ListItemIcon icon={SearchIcon} />
                <input type="text"
                    onChange={handleFilterChange}
                    value={filterByToEdit.title} placeholder='Search'
                    name='title' />
            </div>
        </ListItem>
        <hr></hr>
        <BoardList boards={boards} isClicked={isClicked} setIsClicked={setIsClicked} />
        {isAddModalOpen && <div className="add-modal">
            <div onClick={onCloseModal} className="dark-screen"></div>
            <div className="main-modal">
                <div className="close-modal" onClick={onCloseModal}>
                    <span>X</span>
                </div>
                <form action="" onSubmit={onAddBoard} className='flex'>
                    <h1>Create board</h1>
                    <label htmlFor="">Board name:</label>
                    <input type="text" onChange={handleChange} value={boardName} />
                    <div className="modal-btns">
                        <button type='button' className="cancel-modal" onClick={onCloseModal}>Cancel</button>
                        <button className="create-board" >Create Board</button>
                    </div>
                </form>
            </div>
        </div>}
    </section>
}