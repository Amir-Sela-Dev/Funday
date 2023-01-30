import { useEffect, useRef } from 'react'
import { useState } from "react"
import { boardService } from "../../services/board.service";
import { showErrorMsg } from "../../services/event-bus.service";
import { addGroup, removeGroup, saveTask } from "../../store/board.action";
import { IconButton } from "monday-ui-react-core";
import { Add, Group as GroupIcon, Item as ItemIcon } from "monday-ui-react-core/icons";
import { Draggable } from 'react-beautiful-dnd';
import { KanbanGroupPreview } from './kanban-group-preview';


export function KanbansGroupList({ board, toggleModal, setIsDarkScreen }) {
    const [boardActionsModal, setBoardActionsModal] = useState(false)

    function onToggleBoardActionsModal() {
        setBoardActionsModal(!boardActionsModal)
    }

    async function onRemoveGroup(groupId) {
        removeGroup(board, groupId)
    }

    return (
        <ul className="kanban-group-list flex">
            <IconButton
                className={`icon-btn-add ${boardActionsModal ? 'active' : ''}`}
                icon={Add}
                color={IconButton.colors.ON_PRIMARY_COLOR}
                size={IconButton.sizes.LARGE}
                onClick={onToggleBoardActionsModal}
            />
            {board.groups.map((group, index) =>
                <li className="kanban-group-preview-line" key={group.id}>
                    <Draggable key={group.id} draggableId={`group ${group.id}`} index={index} type="group" >
                        {(provided) => (
                            <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className='flex'
                            >
                                <KanbanGroupPreview board={board} group={group} toggleModal={toggleModal} onRemoveGroup={onRemoveGroup} index={index} setIsDarkScreen={setIsDarkScreen} />
                            </div>
                        )}
                    </Draggable>
                </li>
            )}
        </ul>
    )
}

