import { useState } from "react"

export function PersonDetails({ persons }) {
    return (
        <div className="person-details flex column">
            <div className="person-names flex justify-between">
                {persons &&
                    persons.map(person => { return <span>{person.fullname}</span> })}
            </div>
            <input placeholder="Invite someone.."></input>
        </div>
    )
}