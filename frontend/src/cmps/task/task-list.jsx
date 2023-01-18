import { TaskPreview } from "./task-preview";

export function TaskList({ group }) {

    return (
        <div className="task-list">

            <div className="task-title-row flex">
                <div className="checkbox-column task-column">
                    <input className='task-checkbox' type="checkbox" />
                </div>

                <div className="task-title task-column">Item</div>
                <div className="task-persons task-column"><span>Person</span></div>
                <div className="task-status task-column">Status</div>
                <div className="task-date task-column">Date</div>
            </div>

            {group.tasks.map(currTask => {
                return <TaskPreview task={currTask} />
            })}
        </div>
    )
}
