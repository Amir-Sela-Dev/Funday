import { useState } from "react"
import { boardService } from "../../services/board.service"
import 'react-quill/dist/quill.snow.css';
import { saveTask } from "../../store/board.action";
import { Tab, TabList, IconButton } from "monday-ui-react-core";
import { Home, Close } from "monday-ui-react-core/icons";
import { TaskUpdates } from "../task/task-updates";
import { TaskActivityLog } from "../task/task-activity-log";

export function KanbanTaskDetails({ board, group, task = '' }) {
    const [value, setValue] = useState('');
    const [comment, setComment] = useState(boardService.getDefaultComment());
    const [isActivityOpen, setIsActivityOpen] = useState(false);

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
            <div className='kanban-task-details task-details-modal task-modal-open'>
                <div className="details-modal-btn">
                    <IconButton
                        icon={Close}
                        className="return-btn"
                    />
                </div>
                <div>
                    <h3 className="detais-title">{task.title}</h3>
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