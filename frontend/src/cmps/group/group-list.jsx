import { useEffect } from 'react'
import { useState } from "react"
import { boardService } from "../../services/board.service";
import { showErrorMsg } from "../../services/event-bus.service";
import { addGroup, removeGroup, saveGroup, saveTask } from "../../store/board.action";
import { GroupPreview } from "./group-preview";
import { IconButton, MenuButton, MenuDivider, DialogContentContainer } from "monday-ui-react-core";
import { Add, Group as GroupIcon, Item as ItemIcon } from "monday-ui-react-core/icons";
import { Draggable } from 'react-beautiful-dnd';


export function GroupList({ board, toggleModal, setIsDarkScreen }) {
    const [boardActionsModal, setBoardActionsModal] = useState(false)

    function onToggleBoardActionsModal() {
        setBoardActionsModal(!boardActionsModal)
    }

    async function onAddItem(isGroup) {
        try {
            let itemToSave;
            if (isGroup) {
                itemToSave = boardService.getEmptyGroup()
                await addGroup(itemToSave, board)
            }
            else {
                itemToSave = boardService.getEmptyTask()
                itemToSave.title = `New Item`
                await saveTask(board, 0, itemToSave)
            }
        } catch (err) {
            showErrorMsg('Cannot save board')
        }
    }

    async function onRemoveGroup(groupId) {
        removeGroup(board, groupId)
    }



    return (
        <ul className="group-list">
            <IconButton
                className={`icon-btn-add ${boardActionsModal ? 'active' : ''}`}
                icon={Add}
                color={IconButton.colors.ON_PRIMARY_COLOR}
                size={IconButton.sizes.LARGE}
                onClick={onToggleBoardActionsModal}
            />

            {boardActionsModal &&
                <DialogContentContainer
                    key="small"
                    className={`board-actions-modal ${boardActionsModal ? 'active' : ''}`}>
                    <MenuButton
                        className="board-actions-mobile"
                        text="New item"
                        onClick={() => { onAddItem(false) }}
                        component={ItemIcon}
                        componentPosition={MenuButton.componentPositions.END} />
                    <MenuDivider />
                    <MenuButton
                        className="board-actions-mobile"
                        text="New Group"
                        onClick={() => { onAddItem(true) }}
                        component={ItemIcon}
                        componentPosition={MenuButton.componentPositions.END} />
                </DialogContentContainer>
            }
            {board.groups.map((group, index) =>

                <Draggable key={group.id} draggableId={`group ${group.id}`} index={index} type="group" >
                    {(provided) => (
                        <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}

                        >

                            <li className="group-preview-line" key={group.id}>
                                <GroupPreview board={board} group={group} toggleModal={toggleModal} onRemoveGroup={onRemoveGroup} index={index} setIsDarkScreen={setIsDarkScreen} />

                            </li>
                        </div>
                    )}

                </Draggable>

            )}


        </ul>
    )
}

