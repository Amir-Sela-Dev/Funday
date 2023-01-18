import { useState } from "react";
import { boardService } from "../../services/board.service";
import { TaskPreview } from "./task-preview";
import { saveBoard } from "../../store/board.action"
import { useSelector } from "react-redux";
import { TaskTitle } from "./task-title";
export function TaskList({ group, groupColor }) {

    return (
        <div className="task-list">

            <div className="task-title-row flex">
                <div className="checkbox-column task-column">
                    <div className="colored-tag" style={{ background: groupColor }}></div>
                    <input className='task-checkbox' type="checkbox" />
                </div>

                <div className="task-title task-column">Item</div>
                <div className="task-persons task-column"><span>Person</span></div>
                <div className="task-status task-column">Status</div>
                <div className="task-date task-column">Date</div>
            </div>

            {group.tasks.map(currTask => {
                return <TaskPreview key={currTask.id} task={currTask} group={group} />
            })}

            <div className="add-task-wrap flex">
                <div className="checkbox-column task-column">
                    <div className="colored-tag" style={{ background: groupColor }}></div>
                    <input className='task-checkbox' type="checkbox" />
                </div>
                <TaskTitle group={group} />
                {/* <form className='task-input-row' onSubmit={handleSubmit}>
                    <input
                        className="add-task-input"
                        placeholder='+ Add item'
                        type="text"
                        value={newTask.title}
                        onChange={handleInputChange}
                        onBlur={ev => handleSubmit(ev)}
                    />
                </form> */}
            </div>
        </div>
    )
}
