import { SideNav } from '../cmps/side-nav.jsx'
import { WorkSpace } from '../cmps/work-space/work-space'
import { BoardDetails } from '../cmps/board/board-details.jsx'
import { useEffect, useState } from 'react'
import { DragDropContext, resetServerContext } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux'
import { saveBoard } from '../store/board.action.js';

export function AppIndex() {
    resetServerContext()
    let { board } = useSelector((storeState) => storeState.boardModule)
    const [isMenuClose, setIsMenuClose] = useState(false)
    const [boardToDrag, setBoardToDrag] = useState(board)
    const [isClicked, setIsClicked] = useState('')

    useEffect(() => {
        setBoardToDrag(board)
        setIsClicked('63d5b54e7d97b7406caecd80')
    }, [board])


    function toggleWorkspace() {
        setIsMenuClose(!isMenuClose)
    }
    function handleOnDragEnd(result) {
        console.log(result);
        let newBoard = structuredClone(board);

        if (!result.destination) {
            return;
        }

        // Reordering groups
        if (result.type === 'group') {
            const [removedGroup] = newBoard.groups.splice(result.source.index, 1);
            newBoard.groups.splice(result.destination.index, 0, removedGroup);
            setBoardToDrag(newBoard)
            saveBoard(newBoard);
        }

        // Reordering tasks
        if (result.type === 'task') {


            // Get the source and destination groups
            const start = newBoard.groups.find(group => group.id === result.source.droppableId);
            const finish = newBoard.groups.find(group => group.id === result.destination.droppableId);

            if (start.id === finish.id) {
                console.log(result.source.droppableId);
                const group = newBoard.groups.find(group => group.id === result.source.droppableId);
                const [removedTask] = group.tasks.splice(result.source.index, 1);
                group.tasks.splice(result.destination.index, 0, removedTask);
                setBoardToDrag(newBoard)
                saveBoard(newBoard);
                return
            }
            // Get the task that was moved
            const task = start.tasks[result.source.index];

            // // Remove the task from its original position
            start.tasks.splice(result.source.index, 1);

            // // Insert the task into its new position
            finish.tasks.splice(result.destination.index, 0, task);

            let startGroupToRemove = newBoard.groups.findIndex(group => group.id === start.id);
            console.log('finish!!!', startGroupToRemove);
            newBoard.groups.splice(startGroupToRemove, 1, start);


            let finishGroupToRemove = newBoard.groups.findIndex(group => group.id === finish.id);
            newBoard.groups.splice(finishGroupToRemove, 1, finish);
            saveBoard(newBoard);
            return
            // // Update the state
            // this.setState({ columns: { ...this.state.columns, [start.id]: start, [finish.id]: finish } });

            // call save board after updating the state
            // saveBoard(this.state.columns);
            // const newBoard = structuredClone(board);
            // let newBoard = structuredClone(board)
            // newBoard.groups = items
            // saveBoard(newBoard)

        }

    }


    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>

            <section className={`app-index ${isMenuClose ? 'closeMenu' : ''}`}>
                <SideNav />
                <WorkSpace toggleWorkspace={toggleWorkspace} isClicked={isClicked} setIsClicked={setIsClicked} />
                <BoardDetails board={boardToDrag} setBoardToDrag={setBoardToDrag} />
            </section>
        </DragDropContext>
    )
}