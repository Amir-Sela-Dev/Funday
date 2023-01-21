import { Fragment } from "react"

export function TaskPerson({ person }) {
    return (
        <Fragment>
            <img
                className="person-img"
                src={require(`/src/assets/img/user/${person.imgUrl}`)} />
        </Fragment>
    )
}