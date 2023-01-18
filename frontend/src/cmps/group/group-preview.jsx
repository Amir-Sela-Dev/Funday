// import { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'

// import { saveBoard } from "../../store/board.action"
// import { boardService } from '../../services/board.service'
// import { utilService } from '../../services/util.service'
// import { ADD_TASK } from '../../store/board.reducer'
// import { store } from '../../store/store'
import { TaskList } from "../task/task-list"
console.log('here');

export function GroupPreview({ group }) {

    // const groupColor = '#e2445c'
    const groupColor = group.style.color
    return (
        <section className="group-preview">
            <div className="group-title"
                style={{ color: groupColor }}>
                {group.title} <span className='number-of-tasks'>{group.tasks.length} items</span></div>
            <TaskList group={group} groupColor={groupColor} />
            <div className="add-task">
            </div>
        </section>
    )
}