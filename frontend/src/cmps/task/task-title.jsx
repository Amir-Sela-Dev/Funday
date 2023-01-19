import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { boardService } from "../../services/board.service"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { saveBoard, saveTask } from "../../store/board.action"

export function TaskTitle({ board, group, handleInputChange, task, onSaveTask }) {
    return (
        <form className='task-input-row' onSubmit={ev => onSaveTask(ev) }>
            <input
                className="add-task-input"
                placeholder='+ Add item'
                type="text"
                value={task?.title || ''}
                onChange={handleInputChange}
                onBlur={onSaveTask}
            />
        </form>
    )
}