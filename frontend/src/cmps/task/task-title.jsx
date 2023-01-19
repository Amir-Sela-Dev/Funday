
export function TaskTitle({ handleInputChange, task, onSaveTask }) {
    return (
        <form className='task-input-row' onSubmit={ev => onSaveTask(ev)}>
            <input
                className="add-task-input"
                placeholder='+ Add item'
                type="text"
                value={task?.title || ''}
                onChange={handleInputChange}
                onBlur={onSaveTask}
            />
        </form>
    )
}