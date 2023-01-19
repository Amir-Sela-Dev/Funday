import { useState } from "react"

export function PersonDetails({ persons }) {
    return (
        <div className="person-details flex justify-between">
            <div className="person-names">
                {persons &&
                    persons.map(person => { return <span>{person.fullname}</span> })}
            </div>
        </div>
    )
}