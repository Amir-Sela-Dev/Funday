import { useEffect } from "react"
import { useState } from "react"
import { boardService } from "../../services/board.service"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveTask } from "../../store/board.action";
import { utilService } from "../../services/util.service";
import dayjs from "dayjs"
import { Tab, TabList, IconButton } from "monday-ui-react-core";
import { Home, Close } from "monday-ui-react-core/icons";
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
        closeModal()
    }

    async function onAddTaskComment() {
        if (!value) return
        comment.txt = value
        comment.createdAt = Date.now()
        task.comments.unshift(comment)

        await saveTask(board, group.id, task)
        setComment(boardService.getDefaultComment())
        setValue('')
    }

    function formatTime(timestamp) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - timestamp;

        const minutes = Math.floor(elapsedTime / (1000 * 60));
        const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

        if (minutes < 1) {
            return "now"
        }
        else if (days > 0) {
            return `${days}d`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${minutes}m`;
        }
    }


    if (!task) return
    return (
        <section>
            {modalState && <div onClick={onCloseModal} className="dark-screen"></div>}
            <div className={`task-details-modal ${modalState ? 'task-modal-open' : ''}`}>
                <div >
                    <IconButton
                        icon={Close}
                        onClick={onCloseModal}
                        className="return-btn"
                    />
                </div>
                <div>
                    <h3>{task.title}</h3>
                </div>
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
                {!isActivityOpen && <TaskUpdates board={board} group={group} task={task} formatTime={formatTime} />}

                {isActivityOpen && <TaskActivityLog board={board} group={group} task={task} formatTime={formatTime} />}

            </div>
        </section>)
}