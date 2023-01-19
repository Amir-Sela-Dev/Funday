import { useState } from "react";
import { useSelector } from "react-redux";
import { showSuccessMsg } from "../../services/event-bus.service";
import { saveGroup } from "../../store/board.action";
import { TaskList } from "../task/task-list"

export function GroupPreview({ group, toggleModal }) {
    const [groupToSend, setGroupToSend] = useState({ ...group })
    let { board } = useSelector((storeState) => storeState.boardModule)

    async function handleSubmit(event) {
        event.preventDefault()
        if (!groupToSend?.title.length) {
            setGroupToSend(prevGroup => {
                return { ...prevGroup }
            })
        }
        try {
            await saveGroup(board, group.id, groupToSend)
            showSuccessMsg('Group updated')
        } catch (err) {
            console.log('error adding task', err)
        }
    }

    function handleInputChange(event) {
        setGroupToSend({ ...groupToSend, title: event.target.value })
    }
    return (
        <section className="group-preview">
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        className="group-title"
                        style={{
                            color: group.style?.color || "#FFF000",
                            width: `${groupToSend.title.length * 1.125}ch`
                        }}
                        type="text"
                        value={groupToSend.title}
                        onChange={handleInputChange}
                        onBlur={ev => { handleSubmit(ev, ev.target.value) }}
                    />
                </form>
                <span className='number-of-tasks'>{group.tasks.length} items</span>
            </div>
            <TaskList group={group} toggleModal={toggleModal} />
            <div className="add-task">
            </div>
        </section>
    )
}