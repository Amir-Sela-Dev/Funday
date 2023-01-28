import { useState } from "react";
import { boardService } from "../../services/board.service";
import { removeTask, saveBoard, saveTask } from "../../store/board.action"
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { Add } from "monday-ui-react-core/icons";
import { Icon, MenuButton, Menu, MenuTitle, MenuItem } from "monday-ui-react-core";
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { GroupBottomBar } from "../group/group-bottom-bar";
import { TaskPreview } from "../task/task-preview";

export function KanbanTaskList({ group, tasks, toggleModal }) {

    let { board } = useSelector((storeState) => storeState.boardModule)

    const [newTask, setNewTask] = useState(boardService.getEmptyTask())



    function handleInputChange({ target }) {
        let { value, name: field } = target
        setNewTask((prevTask) => {
            return { ...prevTask, [field]: value }
        })
    }

    async function onRemoveTask(taskId) {
        try {
            await removeTask(board, group.id, taskId)
            showSuccessMsg('Task removed')
        } catch (err) {
            showErrorMsg('Cannot remove task')
        }
    }


    return (
        <div>
            {/* onDragEnd={handleType1} */}


            <div className="task-list">

                <Droppable droppableId={group.id} type="task">
                    {(provided) => (

                        <div className="drag-tasks-container"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {
                                tasks.map((currTask, index) => {
                                    return (
                                        <div onClick={(ev) => { ev.stopPropagation() }}>
                                            <Draggable draggableId={currTask.id} index={index} type="task">
                                                {(provided) => (
                                                    <div

                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        className="task-preview flex"

                                                    >


                                                    </div>
                                                )}
                                            </Draggable>
                                        </div>

                                    )
                                })
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

            </div>
        </div>

    )
}
