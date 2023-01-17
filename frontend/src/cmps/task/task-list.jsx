
export function TaskList({ group }) {

    return (
        <div className="task-list">
            <div className="task-title-row flex">
                <div>item</div>
                <div>status</div>
            </div>
            {group.tasks.map(task =>
                <div className="task-preview flex" key={task._id}>
                    <div>{task.title}</div>
                    <div>  <button className="option-btn" onClick={() => { }}>...</button></div>
                </div>)}
        </div>
    )
}
