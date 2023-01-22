import React, { useMemo } from 'react';
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'
import { boardService } from '../../services/board.service'
import { useState } from "react"
import { loadBoards, saveBoard } from '../../store/board.action'
import { BoardList } from '../board/board-list.jsx'
import { SplitButton } from "monday-ui-react-core";
export function WorkSpace({ toggleWorkspace }) {

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
        console.log(value);
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

    function toggleMenuModal() {
        setIsOptionsModalOpen(!isOptionsModalOpen)
    }

    const addBoardIcon = 'add-board.svg'
    const searchIcon = 'search-board.svg'
    const filterIcon = 'filter.svg'
    const arrowDownIcon = 'arrow-down.svg'
    const homeIcon = 'home.svg'
    const optionIcon = 'option-icon.svg'
    const arrowLeftIcon = 'arrow-left.svg'
    const duplicateIcon = 'duplicate.svg'
    const openNewIcon = 'open-new.svg'
    const renameIcon = 'rename.svg'
    const deleteIcon = 'delete.svg'

    return <section className={`work-space ${isNavModalClose ? 'close-workspace' : ''}`}>

        {isOptionsModalOpen && <ul className="menu-modal main-option" >
            <div className="menu-modal-option first flex">
                <img className="filter-icon board-icon" src={require(`/src/assets/img/${openNewIcon}`)} />
                <p className="menu-modal-option-text">Open Board in New Tab</p>
            </div>
            <hr />
            <div className="menu-modal-option flex">
                <img className="filter-icon board-icon" src={require(`/src/assets/img/${renameIcon}`)} />
                <p className="menu-modal-option-text">Rename</p>
            </div>
            <div className="menu-modal-option flex">
                <img className="filter-icon board-icon" src={require(`/src/assets/img/${duplicateIcon}`)} />
                <p className="menu-modal-option-text">Duplicate</p>
            </div>
            <div className="menu-modal-option flex">
                <img className="filter-icon board-icon" src={require(`/src/assets/img/${deleteIcon}`)} />
                <p className="menu-modal-option-text">Delete</p>
            </div>
        </ul>}

        <div className="toggle-nemu-btn-wrap">
            <div className="toggle-menu-btn" onClick={setToggleWorkspace}>
                <img className="arrow-left-icon" src={require(`/src/assets/img/${arrowLeftIcon}`)} />
            </div>
        </div>

        <div className="workspace-header flex">
            <span className='workspace-txt'>Workspace</span>
            <img className="option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)}
                onClick={toggleMenuModal} />
        </div>

        <div className="main-workspace-dropdown flex">
            <div className="main-icon">M
                <img className="home-icon" src={require(`/src/assets/img/${homeIcon}`)} />
            </div>
            <h3>Main workspace</h3>
            <img className="arrow-down-icon" src={require(`/src/assets/img/${arrowDownIcon}`)} />
        </div>

        <div className='board-add option-wrap flex align-center' onClick={() => { setIsAddModalOpen(true) }}>
            <img className="add-board-icon board-icon" src={require(`/src/assets/img/${addBoardIcon}`)} />
            <p>Add</p>
        </div>
        <div className='board-filter option-wrap flex align-center'>
            <img className="filter-icon board-icon" src={require(`/src/assets/img/${filterIcon}`)} />
            <p>Filters</p>
        </div>
        <div className='board-search option-wrap flex align-center'>
            <img className="search-board-icon board-icon" src={require(`/src/assets/img/${searchIcon}`)} />
            <input type="text"
                onChange={handleFilterChange}
                value={filterByToEdit.title} placeholder='Search'
                name='title' />
        </div>
        <hr></hr>
        <BoardList boards={boards} />

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