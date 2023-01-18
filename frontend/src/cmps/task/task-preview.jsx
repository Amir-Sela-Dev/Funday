import { useEffect } from "react"

export function TaskPreview({ task, groupColor }) {

    useEffect(() => {
        console.log('taskprev', { ...task })
    }, [])

    const openTaskIcon = 'open-item.svg'
    return (
        // tasks: [
        //     {
        //         id: utilService.makeId(5),
        //         title: 'Mashu tov',
        //         persons: utilService.getRandomIntInclusive(1, 3),
        //         status: getDefaultLabelSet()[utilService.getRandomIntInclusive(0,2)],
        //         date: utilService.randomTime()
        //     },
        //     {
        //         id: utilService.makeId(5),
        //         title: 'Dogma 1',
        //         persons: utilService.getRandomIntInclusive(1, 3),
        //         status: getDefaultLabelSet()[utilService.getRandomIntInclusive(0,2)],
        //         date: utilService.randomTime()
        //     }
        // ]
        <div className="task-preview flex">

            <div className="checkbox-column task-column">
                <div className="colored-tag" style={{ background: groupColor }}></div>
                <input className='task-checkbox' type="checkbox" />
            </div>

            <div className="task-txt task-column flex">
                <img className="open-task-icon task-icon" src={require(`/src/assets/img/${openTaskIcon}`)} />
                <span>{task.title}</span>
            </div>

            <div className="task-persons task-column"><span>{task.persons}</span></div>

            <div className="task-status task-column"
                style={{ background: task.status?.color }}>
                <span>{task.status?.txt}</span>
            </div>

            <div className="task-date task-column">{task.date}</div>

        </div>
    )
}