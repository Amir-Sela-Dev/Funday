import { useEffect } from "react"
import { useState } from "react"
import { boardService, saveTask } from "../../services/board.service"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function TaskDetails({ board, group, task = '', closeModal, modalState }) {
    const [value, setValue] = useState('');
    const [comment, setComment] = useState(boardService.getDefaultComment());
    const emtyModalImg = 'task-modal-empty-state.svg'
    const whiteHome = 'white-home.svg'
    console.log(task);
    async function onAddTaskComment() {
        let newTask = structuredClone(task)
        comment.txt = value
        newTask.comments.push(comment)
        await saveTask(board, group.id, newTask)
    }

    if (!task) return
    return <section className={`task-details-modal ${modalState ? 'task-modal-open' : ''}`}>
        <button onClick={closeModal}> X </button>
        <h3>{task.title}</h3>
        <div className="comments-btn">
            <img className="white-home board-icon" src={require(`/src/assets/img/${whiteHome}`)} alt="" />
            <button>Updates</button>
        </div>

        <div className="txt-editor-container">
            <ReactQuill className="txt-editor" theme="snow" value={value} onChange={setValue} />
        </div>
        <button onClick={onAddTaskComment}>Update</button>

        <div className="main-container">

        </div>

        <div className="img-container">
            <img className="emty-modal-img" src={require(`/src/assets/img/${emtyModalImg}`)} />
        </div>
    </section>
}