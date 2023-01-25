import { AvatarGroup, Avatar } from "monday-ui-react-core";


export function GroupBottomBar({ board, group }) {
    function getStatuscount(labelsName) {
        let labelCount = []
        let labelCountMap = {}
        let total = 0
        group.tasks.forEach(task => {
            total++
            if (labelCountMap[task[labelsName].txt]) {
                labelCountMap[task[labelsName].txt] += 1
            }
            else {
                labelCountMap[task[labelsName].txt] = 1
            }
        });
        for (const labelName in labelCountMap) {
            let currLabel = board[labelsName].find(label => label.txt === labelName)
            let labels = { title: currLabel.txt, color: currLabel.color, percent: (labelCountMap[labelName] / total * 100) }
            labelCount.push(labels)
        }
        return labelCount
    }

    function getAllFiles() {
        let files = []
        group.tasks.forEach(task => {
            if (task.file) files.push(task.file)
        });
        return files
    }




    return (
        <section className="group-bottom-bar flex">
            {board.cmpsOrder.map(cmp => {
                switch (cmp) {
                    case 'person':
                        return <div className="task-persons task-column flex"><span>Person</span></div>
                    case 'status':
                        return <div className=" task-status task-column flex "> <div className="label-progress-bar flex"> {getStatuscount('status').map(status => {
                            return <div className="status-progress" style={{ minWidth: `${status.percent}%`, backgroundColor: `${status.color}` }}></div>
                        })}</div></div>
                    case 'date':
                        return <div className="task-date task-column">Date</div>
                    case 'timeline':
                        return <div className="task-timeline task-column">Timeline</div>
                    case 'priority':
                        return <div className=" task-status task-column flex "> <div className="label-progress-bar flex"> {getStatuscount('priority').map(priority => {
                            return <div className="status-progress" style={{ minWidth: `${priority.percent}%`, backgroundColor: `${priority.color}` }}></div>
                        })}</div></div>
                    case 'files':
                        return <div className="task-files task-column">
                            <AvatarGroup size={Avatar.sizes.SMALL} max={4} vertical >
                                {getAllFiles().map((file, i) => <Avatar key={i} type={Avatar.types.IMG} isSquare={true} size="small" src={file} />)}
                            </AvatarGroup>
                        </div>
                    case 'checkbox':
                        return <div className="checkbox task-column">Checkbox</div>
                    default:
                        return <div className="task-persons task-column"><span>Person</span></div>
                }

            })}
        </section>
    )
} 