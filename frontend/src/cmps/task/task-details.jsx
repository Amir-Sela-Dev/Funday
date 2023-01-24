import { useEffect } from "react"
import { useState } from "react"
import { boardService } from "../../services/board.service"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveTask } from "../../store/board.action";
import { utilService } from "../../services/util.service";
import dayjs from "dayjs"
import { Tab, TabList } from "monday-ui-react-core";
import { Home } from "monday-ui-react-core/icons";
import { TaskUpdates } from "./task-updates";
import { TaskActivityLog } from "./task-activity-log";
var weekday = require('dayjs/plugin/weekday')

export function TaskDetails({ board, group, task = '', closeModal, modalState }) {
    const [value, setValue] = useState('');
    const [comment, setComment] = useState(boardService.getDefaultComment());
    const [isActivityOpen, setIsActivityOpen] = useState(false);

    const emtyModalImg = 'task-modal-empty-state.svg'
    const whiteHome = 'white-home.svg'
    const clock = 'clock.svg'

    function onCloseModal() {
        setIsActivityOpen(false)
        closeModal()
    }

    async function onAddTaskComment() {
        console.log(value);
        if (!value) return
        comment.txt = value
        comment.createdAt = Date.now()
        task.comments.unshift(comment)

        await saveTask(board, group.id, task)
        setComment(boardService.getDefaultComment())
        setValue('')
    }

    if (!task) return
    return <section className={`task-details-modal ${modalState ? 'task-modal-open' : ''}`}>
        <button className="close-modal" onClick={onCloseModal}> X </button>
        <h3>{task.title}</h3>
        <div className="comments-btn">
            <TabList>
                <Tab className='tab' active style={{ backgroundolor: "  #0070e5" }} icon={Home} onClick={() => { setIsActivityOpen(false) }}>
                    Updates
                </Tab>

                <Tab className='tab' style={{ color: "  #0070e5" }} icon={Home} onClick={() => { setIsActivityOpen(true) }}>
                    Activitiy Log
                </Tab>
            </TabList>
        </div>
        <hr />

        {!isActivityOpen && <TaskUpdates board={board} group={group} task={task} />}

        {isActivityOpen && <TaskActivityLog board={board} group={group} task={task} />}
        {/* <div className="txt-editor-container">
            <ReactQuill className="txt-editor" theme="snow" value={value} onChange={setValue} />
        </div>
        <button className="update-btn" onClick={onAddTaskComment}>Update</button>

        <div className="main-details-container">
            {task.comments.map(comment => {
                return <div className="comment flex">

                    <div className="user-line flex justify-between">
                        <div className="flex align-center">
                            <img src='https://res.cloudinary.com/dp3tok7wg/image/upload/v1674331758/g-profile_zylwbg.png' alt="" className="user" />
                            <a> Guest </a>
                            <div className="is-active"></div>
                        </div>
                        <div className="date flex align-center">
                            <img className="clock-img" src={require(`/src/assets/img/${clock}`)} />
                            <div className="comment-date">1d</div>
                        </div>
                    </div>


                    <div className="main-comment" dangerouslySetInnerHTML={{ __html: comment.txt }} />
                </div>
            })}

        </div>

        {!task.comments.length && <div className="img-container">
            <img className="emty-modal-img" src={require(`/src/assets/img/${emtyModalImg}`)} />
        </div>
        }     */}
    </section>
}