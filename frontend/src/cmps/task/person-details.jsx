import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { boardService } from "../../services/board.service"
import { userService } from "../../services/user.service"

export function PersonDetails({ onAddTaskPerson, onRemoveTaskPerson, persons }) {
    let { board } = useSelector((storeState) => storeState.boardModule)
    let { users } = useSelector((storeState) => storeState.userModule)
    const [suggestedUsers, setSuggestedUsers] = useState([])
    useEffect(() => {
        onGetSuggestedUsers()
    }, [persons])

    function minifyName(name) {
        const nameArr = name.split(' ');
        if (name.length && nameArr.length === 1) return name

        const lastNameInitial = nameArr[nameArr.length - 1].slice(0, 1).toUpperCase();
        nameArr.pop();
        const firstName = nameArr.join(' ');

        return `${firstName} ${lastNameInitial}.`
    }


    async function onGetSuggestedUsers() {
        let suggested = users.filter(user => board.users.includes(user._id))
        if (persons.length) suggested = users.filter(user => board.users.includes(user._id) && !persons.find(person => person._id === user._id))
        setSuggestedUsers(suggested)
    }
    const xIcon = 'x-icon.svg'
    return (
        <div className="person-details flex column modal">
            <div className="person-names flex">
                {persons &&
                    persons.map((currPerson, currIdx) => {
                        return (
                            <div key={currPerson.id} className="person-item flex align-center" onClick={() => onRemoveTaskPerson(currPerson)}>
                                <img
                                    className="person-img"
                                    src={currPerson.imgUrl} />
                                <span>{minifyName(currPerson.fullname)}</span>
                                <img
                                    className="icon-x"
                                    src={require(`/src/assets/img/${xIcon}`)} />
                            </div>)
                    })}
            </div>
            <div className="suggested-people">
                <input
                    type="text"
                    placeholder="Invite someone.."
                    onClick={(ev) => { ev.stopPropagation() }}></input>
                <h4>Suggested people</h4>
                <ul className="person-list">
                    {suggestedUsers.map(currPerson => {
                        return (
                            <div className="person-item flex align-center"
                                key={currPerson.id}
                                onClick={() => {
                                    onAddTaskPerson(currPerson)

                                }}>
                                <img src={currPerson.imgUrl} />
                                <span>{currPerson.fullname}</span>
                            </div>
                        )
                    })}
                </ul>
            </div>
        </div >
    )
}