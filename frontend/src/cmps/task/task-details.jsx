import { useState } from "react"

export function TaskDetails({ taskId, toggleModal, modalState }) {

    const emtyModalImg = 'task-modal-empty-state.svg'

    return <section className={`task-details-modal ${modalState ? 'task-modal-open' : ''}`}>
        <button onClick={toggleModal}> X </button>
        Hello from Task Details + {taskId}
        <img className="emty-modal-img" src={require(`/src/assets/img/${emtyModalImg}`)} />
    </section>
}