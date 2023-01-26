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
    function getAllPeople() {
        let persons = []
        group.tasks.forEach(task => {
            if (task.persons.length) {
                task.persons.forEach(person => {
                    let foundPerson = persons.find(p => p.id === person.id)
                    if (!foundPerson) persons.push(person)
                });
            }
        });
        // console.log(persons);
        return persons
    }


    function getAllMark() {
        let markStateMap = { numOfCheck: 0, numOfTask: 0 }
        group.tasks.forEach(task => {
            if (task.isMark) {
                markStateMap.numOfCheck++
            }
            markStateMap.numOfTask++
        });
        console.log(markStateMap);
        return markStateMap
    }



    return (
        <section className="group-bottom-bar flex">
            <div className="flex">
                <div className="sticky-grid flex">
                    <div class="white-background"></div>
                    <div className="task-txt bar-place-holder task-column"></div>
                </div>
                {board.cmpsOrder.map(cmp => {
                    switch (cmp) {
                        case 'person':
                            return <div className="bar-person task-persons task-column">
                                <AvatarGroup size={Avatar.sizes.SMALL} max={3} vertical className="flex align-center justify-center" >
                                    {getAllPeople().map((person, i) => <Avatar key={i} type={Avatar.types.IMG} size="small" src={person.imgUrl} />)}
                                </AvatarGroup>

                            </div>
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
                            return <div className="task-files task-column ">
                                <AvatarGroup size={Avatar.sizes.SMALL} max={4} vertical className="flex align-center justify-center">
                                    {getAllFiles().map((file, i) => <Avatar key={i} type={Avatar.types.IMG} isSquare={true} size="small" src={file} />)}
                                </AvatarGroup>
                            </div>
                        case 'checkbox':
                            return <div className="checkbox task-column">
                                <span>{getAllMark().numOfCheck} </span> / <span>{getAllMark().numOfTask} </span>
                            </div>
                        default:
                            return <div className="task-persons task-column">
                                <AvatarGroup size={Avatar.sizes.SMALL} max={3} vertical >
                                    {getAllPeople().map((person, i) => <Avatar key={i} type={Avatar.types.IMG} isSquare={true} size="small" src={person.imgUrl} />)}
                                </AvatarGroup>
                            </div>
                    }

                })}
            </div> </section>
    )
} 