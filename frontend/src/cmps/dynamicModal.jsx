import { useEffect, useState } from "react";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { saveTask } from "../store/board.action";


export function DynamicModal({ lables, task, group, board, lableName }) {
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)
    const [modalTransform, setModalTransform] = useState('')


    useEffect(() => {
        if (!lables || !task || !group || !board) return
    }, [])

    console.log('lables', lables);

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


    function openOptionModal(boardId, i) {
        setModalTransform(25 + (29 * i))
        setIsBoardOptionsOpen(!isBoardOptionsOpen)
    }
    if (!lables) return
    return <ul className="status-picker" >
        <div className="arrow-up"></div>
        {lables.map(lable => (<li key={lable.id}
            className='label'
            style={{ background: lable.color }} onClick={() => { onAddTaskLable(lable) }}>{lable.txt}</li>)
        )}</ul>

}