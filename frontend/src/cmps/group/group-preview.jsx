import { useState } from 'react'
import { boardService } from '../../services/board.service'

import { TaskList } from "../task/task-list"

export function GroupPreview({ group }) {

    // const groupColor = '#e2445c'
    const groupColor = group.style?.color
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