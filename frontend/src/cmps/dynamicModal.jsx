import { useEffect, useState } from "react";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { saveTask } from "../store/board.action";


export function DynamicModal({ lables, task, group, board, lableName }) {

    async function onAddTaskLable(lable) {
        try {
            let taskToSave = structuredClone(task)
            taskToSave[lableName] = lable
            await saveTask(board, group.id, taskToSave)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    if (!lables) return
    return <ul className="status-picker modal" >
        <div className="arrow-up"></div>
        {lables.map(lable => (<li key={lable.id}
            className='label'
            style={{ background: lable.color }} onClick={() => { onAddTaskLable(lable) }}>{lable.txt}</li>)
        )}</ul>

}