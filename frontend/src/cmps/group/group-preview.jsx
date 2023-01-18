import { useState } from 'react'
import { boardService } from '../../services/board.service'

import { TaskList } from "../task/task-list"

export function GroupPreview({ group }) {
   

    return (
        <section className="group-preview">
            <div className="group-title"> {group.title} {group.tasks.length} </div>
            <TaskList group={group} />
            <div className="add-task">
            </div>
        </section>
    )


}