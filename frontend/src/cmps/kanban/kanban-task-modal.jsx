import { TaskDetails } from "../task/task-details";
import { KanbanTaskDetails } from "./kanban-task-details";
import { KanbanTaskInfo } from "./kanban-task-info";
import { Close } from "monday-ui-react-core/icons";
import { IconButton } from "monday-ui-react-core";



export function KanbanTaskModal({ board, group, task = '', setIsKanbanModalOpen, isKanbanModalOpen }) {






    return <section className="kanban-task-modal flex">
        {/* {isKanbanModalOpen && <div onClick={() => { setIsKanbanModalOpen(false) }} className="dark-screen"></div>} */}
        <div >
            <IconButton
                icon={Close}
                onClick={() => { setIsKanbanModalOpen(false) }}
                className="return-btn"
            />
        </div>

        <div className="task-info">
            <KanbanTaskInfo board={board} group={group} task={task} />

        </div>
        <hr />
        <div className="task-details">
            <KanbanTaskDetails board={board} group={group} task={task} />
            {/* task details */}
        </div>

    </section>

}