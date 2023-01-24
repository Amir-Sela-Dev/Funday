import { useEffect, useState } from "react"
import { boardService } from "../../services/board.service"

export function PersonDetails({ onAddTaskPerson, onRemoveTaskPerson, persons }) {
    const [defaultUsers, setDefaultUsers] = useState(boardService.getDefaultUsers(persons))
    useEffect(() => {
    }, persons)

    function minifyName(name) {
        const nameArr = name.split(' ');
        if (name.length && nameArr.length === 1) return name

        const lastNameInitial = nameArr[nameArr.length - 1].slice(0, 1).toUpperCase();
        nameArr.pop();
        const firstName = nameArr.join(' ');

        return `${firstName} ${lastNameInitial}.`
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
                                    src={require(`/src/assets/img/user/${currPerson.imgUrl}`)} />
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
                    {defaultUsers.map(currPerson => {
                        return (
                            <div className="person-item flex align-center"
                                key={currPerson.id}
                                onClick={() => { onAddTaskPerson(currPerson) }}>
                                <img src={require(`/src/assets/img/user/${currPerson.imgUrl}`)} />
                                <span>{currPerson.fullname}</span>
                            </div>
                        )
                    })}
                </ul>
            </div>
        </div >
    )
}