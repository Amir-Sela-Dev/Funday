

export function GroupBottomBar({ board, group }) {
    console.log(group);
    getStatuscount()
    function getStatuscount() {
        let statusCount = []
        let statusCountMap = {}
        let total = 0
        group.tasks.forEach(task => {
            total++
            if (statusCountMap[task.status.txt]) {
                statusCountMap[task.status.txt] += 1
            }
            else {
                statusCountMap[task.status.txt] = 1
            }


        });
        for (const statusName in statusCountMap) {
            let currStatus = board.status.find(status => status.txt === statusName)
            let status = { title: currStatus.txt, color: currStatus.color, percent: (statusCountMap[statusName] / total * 100) }
            statusCount.push(status)
        }
        return statusCount
    }




    return (
        <section className="group-bottom-bar flex">
            {board.cmpsOrder.map(cmp => {
                switch (cmp) {
                    case 'person':
                        return <div className="task-persons task-column flex"><span>Person</span></div>
                    case 'status':
                        return <div className=" task-status task-column flex "> <div className="label-progress-bar flex"> {getStatuscount().map(status => {
                            return <div className="status-progress" style={{ minWidth: `${status.percent}%`, backgroundColor: `${status.color}` }}></div>
                        })}</div></div>
                    case 'date':
                        return <div className="task-date task-column">Date</div>
                    case 'timeline':
                        return <div className="task-timeline task-column">Timeline</div>
                    case 'priority':
                        return <div className="task-status task-column">Priority</div>
                    case 'files':
                        return <div className="task-files task-column">Files</div>
                    case 'checkbox':
                        return <div className="checkbox task-column">Checkbox</div>
                    default:
                        return <div className="task-persons task-column"><span>Person</span></div>
                }

            })}
        </section>
    )
} 