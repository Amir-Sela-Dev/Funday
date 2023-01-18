// import React from 'react';

// import { boardService } from "../services/board.service.js"
// import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { loadBoard } from "../../store/board.action"
import { useDispatch, useSelector } from 'react-redux'
import { GroupList } from "../group/group-list"

export function BoardDetails() {
    const [currboard, setBoard] = useState(null)
    let { board } = useSelector((storeState) => storeState.boardModule)

    const { boardId } = useParams()
    const navigate = useNavigate()



    useEffect(() => {
        onLoadBoard()
    }, [])

    async function onLoadBoard() {
        let board = await loadBoard(boardId)
        setBoard(board)
    }



    console.log(board);





    if (!board) return <div>Loading...</div>


    return <section className="board-details">
        <GroupList board={board} />
    </section>
}