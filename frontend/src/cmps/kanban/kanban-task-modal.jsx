import { KanbanTaskDetails } from "./kanban-task-details";
import { KanbanTaskInfo } from "./kanban-task-info";
import { Close } from "monday-ui-react-core/icons";
import { IconButton } from "monday-ui-react-core";

export function KanbanTaskModal({ board, group, task = '', setIsKanbanModalOpen, setIsDarkScreen }) {
    function onCloseKanbanInfo() {
        setIsKanbanModalOpen(false)
        setIsDarkScreen(false)
    }
    return <section className="kanban-task-modal flex">
        <div >
            <IconButton
                icon={Close}
                onClick={onCloseKanbanInfo}
                className="return-btn"
            />
        </div>

        <div className="task-info">
            <KanbanTaskInfo board={board} group={group} task={task} />

        </div>
        <hr />
        <div className="task-details">
            <KanbanTaskDetails board={board} group={group} task={task} />
        </div>
    </section>
}