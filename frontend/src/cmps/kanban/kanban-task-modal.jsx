import { TaskDetails } from "../task/task-details";
import { KanbanTaskDetails } from "./kanban-task-details";
import { KanbanTaskInfo } from "./kanban-task-info";


export function KanbanTaskModal({ board, group, task = '' }) {






    return <section className="kanban-task-modal flex">

        <div className="task-info">
            <KanbanTaskInfo board={board} group={group} task={task} />

        </div>
        <div className="task-details">
            <KanbanTaskDetails board={board} group={group} task={task} />
            {/* task details */}
        </div>

    </section>

}