import { useEffect, useState } from "react";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { addActivity, saveTask } from "../store/board.action";


export function DynamicModal({ lables, task, group, board, lableName }) {
    const [currLabel, setCurrLabel] = useState({})
    async function onAddTaskLable(lable) {
        try {
            let taskToSave = structuredClone(task)
            const prevLabel = structuredClone(taskToSave[lableName])
            taskToSave[lableName] = lable
            // await addActivity(board, lableName, `Add label  ${lable.txt}`, taskToSave)
            /**
             * TODO: prev > new in Task Details modal
             */
            await saveTask(board, group.id, taskToSave, lableName, prevLabel.txt, lable.txt)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    if (!lables) return
    return <ul className="status-picker modal open" >
        <div className="arrow-up"></div>
        {lables.map(lable => (<li key={lable.id}
            className='label '
            style={{ background: lable.color }} onClick={() => { onAddTaskLable(lable) }}>{lable.txt}</li>)
        )}</ul>

}