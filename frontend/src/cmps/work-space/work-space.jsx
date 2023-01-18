import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'

import { useState } from "react"
import { loadBoards } from '../../store/board.action'
import { BoardList } from '../board/board-list.jsx'

export function WorkSpace() {

    const { boards } = useSelector((storeState) => storeState.boardModule)

    useEffect(() => {
        onLoadBoards()
    }, [])

    async function onLoadBoards(filterBy) {
        try {
            await loadBoards(filterBy)
        }
        catch (err) {
            showErrorMsg('Cannot load boards')
        }
    }

    console.log(boards)
    const addBoardIcon = 'add-board.svg'
    const searchIcon = 'search-board.svg'
    const filterIcon = 'filter.svg'

    return <section className="work-space">
        <span className='workspace-txt'>Workspace</span>

        <div className='option-wrap flex'>
            <img className="add-board-icon board-icon" src={require(`/src/assets/img/${addBoardIcon}`)} />
            <p>Add</p>
        </div>
        <div className='option-wrap flex'>
            <img className="filter-icon board-icon" src={require(`/src/assets/img/${filterIcon}`)} />
            <p>Filters</p>
        </div>
        <div className='option-wrap flex'>
            <img className="search-board-icon board-icon" src={require(`/src/assets/img/${searchIcon}`)} />
            <p>Search</p>
        </div>
        <hr></hr>
        <BoardList boards={boards} />
    </section>
}