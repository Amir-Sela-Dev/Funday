import { Fragment } from "react"

export function TaskPerson({ person }) {
    const defUserIcon = 'user-def-icon.svg'
    return (
        <Fragment>
            <img
                className="board-icon"
                alt="nice"
                src={require(`/src/assets/img/${defUserIcon}`)} />
        </Fragment>
    )
}