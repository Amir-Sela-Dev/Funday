import { Fragment } from "react"
import { Avatar } from "monday-ui-react-core";

export function TaskPerson({ person }) {
    return <Avatar type={Avatar.types.IMG} size="small" src={person.imgUrl} ariaLabel={person.fullname} />

}