import { useEffect } from "react"

export function TaskPreview({ task }) {
    useEffect(() => {
        console.log('taskprev', { ...task })
    }, [])
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
        <div className="task-preview flex align-center">
            <div className="task-title"><span>{task.title}</span></div>
            <div className="task-persons"><span>{task?.persons}</span></div>
            <div className="task-status"
                style={{ background: task.status?.color }}>
                <span>{task.status?.txt}</span>
            </div>
            <div className="task-date">{task?.date}</div>
        </div>
    )
}