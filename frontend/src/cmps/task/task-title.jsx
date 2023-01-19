
export function TaskTitle({ handleInputChange, task, onSaveTask, newTask }) {
    return (
        <form className='task-input-row' onSubmit={ev => onSaveTask(ev)}>
            <input
                className="add-task-input"
                placeholder='+ Add item'
                type="text"
                value={newTask?.title || ''}
                onChange={handleInputChange}
                onBlur={onSaveTask}
            />
        </form>
    )
}