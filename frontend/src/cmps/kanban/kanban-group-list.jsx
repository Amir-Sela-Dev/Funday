import { useEffect, useRef } from 'react'
import { useState } from "react"
import { boardService } from "../../services/board.service";
import { showErrorMsg } from "../../services/event-bus.service";
import { utilService } from '../../services/util.service';
import { addGroup, removeGroup, saveGroup, saveTask } from "../../store/board.action";
import { LabelSelect } from '../lable-select';
import { Button, Flex, IconButton, Menu, MenuButton, MenuDivider, DialogContentContainer, Icon } from "monday-ui-react-core";
import {
    Add, Search, Person, Filter, Sort, Group,
    Table, DropdownChevronDown, Group as GroupIcon,
    Item as ItemIcon
} from "monday-ui-react-core/icons";
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { GroupPreview } from '../group/group-preview';
import { KanbanGroupPreview } from './kanban-group-preview';


export function KanbansGroupList({ board, toggleModal, setFilter, setIsDarkScreen }) {
    const [filterByToEdit, setFilterByToEdit] = useState(boardService.getDefaultGroupFilter())
    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [isLablesOpen, setIsLablesOpen] = useState(false)
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [isSeachClicked, setIsSeachClicked] = useState(false)
    const [boardActionsModal, setBoardActionsModal] = useState(false)

    useEffect(() => {
        setFilter(filterByToEdit)
        // setFilter.current(filterByToEdit)
    }, [filterByToEdit])


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

    function handleFilterChange({ target }) {
        let { value, name: field } = target
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function handleLableChange(lables) {
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, lables: lables }))
    }

    function toggleNewTaskModal() {
        setIsNewTaskModalOpen(!isNewTaskModalOpen)
    }

    function toggleFilterModal() {
        setIsFilterModalOpen(!isFilterModalOpen)
    }

    function toggleSearchBar(searchState = true) {
        setIsSeachClicked(searchState)
    }


    function handleOnGroupDragEnd(result) {
        console.log('@@@@@@@', result);
        // const items = Array.from(tasks)
        // const [reorderedItem] = items.splice(result.source.index, 1)
        // items.splice(result.destination.index, 0, reorderedItem)
        // setTasks(items)
        // saveGroupAfterDrag(items)
    }


    const searchIcon = 'search-board.svg'
    const arrowDown = 'arrow-down.svg'
    const arrowDownWhite = 'arrow-down.png'

    return (
        // <DragDropContext onDragEnd={handleOnGroupDragEnd}>
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
        // </DragDropContext>
    )
}

