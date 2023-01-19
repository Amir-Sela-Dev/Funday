import { useEffect, useRef } from 'react'
import { useState } from "react"
import { boardService } from "../../services/board.service";
import { showErrorMsg } from "../../services/event-bus.service";
import { utilService } from '../../services/util.service';
import { addGroup, removeGroup, saveGroup } from "../../store/board.action";
import { GroupPreview } from "./group-preview";

export function GroupList({ board, groups, toggleModal, setFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(boardService.getDefaultGroupFilter())
    // setFilter = useRef(utilService.debounce(setFilter))

    useEffect(() => {
        setFilter(filterByToEdit)
        // setFilter.current(filterByToEdit)
    }, [filterByToEdit])

    async function onAddGroup() {
        try {
            let groupToSave = boardService.getEmptyGroup()
            await addGroup(groupToSave, board)
        } catch (err) {
            showErrorMsg('Cannot save board')
        }
    }

    async function onUpdateGroup(board, groupId) {
        saveGroup()
    }

    async function onRemoveGroup(groupId) {
        console.log('here');
        removeGroup(board, groupId)
    }

    function handleFilterChange({ target }) {
        let { value, name: field } = target
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }


    const searchIcon = 'search-board.svg'

    return <ul className="group-list">
        <hr className="group-list-main-hr" />
        <div className="board-actions flex">
            <button className="new-group-btn" onClick={onAddGroup}>New Group</button>
            <div className='gruop-serach-filter flex'>
                <img className="search-board-icon board-icon" src={require(`/src/assets/img/${searchIcon}`)} />
                <input type="text"
                    onChange={handleFilterChange}
                    value={filterByToEdit.title} placeholder='Search'
                    name='title' />
            </div>
        </div>

        {groups.map(group =>
            <li className="group-preview-line" key={group.id}>
                <GroupPreview group={group} toggleModal={toggleModal} />
                <button onClick={() => onRemoveGroup(group.id)}>Delete</button>
            </li>)}
    </ul>
}