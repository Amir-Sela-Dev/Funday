import { TaskPreview } from "./task-preview";

export function TaskList({ group }) {

    return (
        <div className="task-list">
            <div className="task-title-row flex">
                <div>item</div>
                <div>status</div>
            </div>
            {group.tasks.map(currTask => {
                return <TaskPreview task={currTask} />
            })}
        </div>
    )
}
