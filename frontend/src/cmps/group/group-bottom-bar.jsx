import { AvatarGroup, Avatar } from "monday-ui-react-core";
import moment from 'moment';

export function GroupBottomBar({ board, group }) {
    // const [allDates, setAllDates] = useState('')

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
                    let foundPerson = persons.find(p => p._id === person._id)
                    if (!foundPerson) persons.push(person)
                });
            }
        });
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
        return markStateMap
    }


    function getAlldates() {
        let allDates = []
        let datesRange = { earliestDate: '', latestDate: '' }
        group.tasks.forEach(task => {
            if (!task.date) return
            allDates.push(task.date)
        })
        if (!allDates.length) return
        let earliestDate = new Date(allDates[0]);
        let latestDate = new Date(allDates[0]);
        allDates.forEach((date) => {
            let currentDate = moment(date, "MMM DD").toDate();
            if (currentDate < earliestDate) {
                earliestDate = currentDate;
                return
            }
            else if (currentDate > latestDate) {
                latestDate = currentDate;
            }
        });
        datesRange = { earliestDate: moment(earliestDate).format('MMM DD'), latestDate: moment(latestDate).format('MMM DD') }
        return datesRange
    }

    getAllTimelines()
    function getAllTimelines() {
        let allTimelines = []
        group.tasks.forEach(task => {
            if (!task.timeline) return
            allTimelines.push(task.timeline)
        })
        if (!allTimelines.length) return
        let earliestDate = new Date(allTimelines[0].start);
        let latestDate = new Date(allTimelines[0].end);
        allTimelines.forEach((timeline) => {
            let startDate = moment(timeline.start, "MMM DD").toDate();
            let endDate = moment(timeline.end, "MMM DD").toDate();
            if (startDate < earliestDate) {
                earliestDate = startDate;
            }
            if (endDate > latestDate) {
                latestDate = endDate;
            }
        });
        // console.log({ earliestDate: moment(earliestDate).format('MMM DD'), latestDate: moment(latestDate).format('MMM DD') });
        // return { earliestDate: moment(earliestDate).format('MMM DD'), latestDate: moment(latestDate).format('MMM DD') };
    }



    return (
        <section className="group-bottom-bar flex">
            <div className="flex">
                <div className="sticky-grid after-add-tast flex">
                    <div class="white-background"></div>
                    <div className="task-txt bar-place-holder task-column"></div>
                </div>
                {board.cmpsOrder.map(cmp => {
                    switch (cmp) {
                        case 'person':
                            return <div className="bar-person task-persons task-column" key={cmp}>
                                <AvatarGroup size={Avatar.sizes.SMALL} max={3} vertical className="flex align-center justify-center" >
                                    {getAllPeople().map((person, i) => <Avatar key={i} type={Avatar.types.IMG} size="small" src={person.imgUrl} />)}
                                </AvatarGroup>

                            </div>
                        case 'status':
                            return <div className=" task-status task-column flex " key={cmp} > <div className="label-progress-bar flex"> {getStatuscount('status').map(status => {
                                return <div className="status-progress" style={{ minWidth: `${status.percent}%`, backgroundColor: `${status.color}` }}></div>
                            })}</div></div>
                        case 'date':
                            return <div className="task-date task-column flex" key={cmp}><div className="dates-color flex">{(getAlldates()?.earliestDate) ? getAlldates().earliestDate : ''} -  {(getAlldates()?.latestDate) ? getAlldates()?.latestDate : ''} </div> </div>
                        case 'timeline':
                            return <div className="task-timeline task-column" key={cmp}></div>
                        case 'priority':
                            return <div className=" task-status task-column flex " key={cmp}> <div className="label-progress-bar flex"> {getStatuscount('priority').map(priority => {
                                return <div className="status-progress" style={{ minWidth: `${priority.percent}%`, backgroundColor: `${priority.color}` }}></div>
                            })}</div></div>
                        case 'files':
                            return <div className="task-files task-column " key={cmp}>
                                <AvatarGroup size={Avatar.sizes.SMALL} max={4} vertical className="flex align-center justify-center">
                                    {getAllFiles().map((file, i) => <Avatar key={i} type={Avatar.types.IMG} isSquare={true} size="small" src={file} />)}
                                </AvatarGroup>
                            </div>
                        case 'checkbox':
                            return <div className="checkbox task-column" key={cmp}>
                                <span>{getAllMark().numOfCheck} </span> / <span>{getAllMark().numOfTask} </span>
                            </div>
                        default:
                            return <div className="task-persons task-column" key={cmp}>
                                <AvatarGroup size={Avatar.sizes.SMALL} max={3} vertical >
                                    {getAllPeople().map((person, i) => <Avatar key={i} type={Avatar.types.IMG} isSquare={true} size="small" src={person.imgUrl} />)}
                                </AvatarGroup>
                            </div>
                    }

                })}
            </div> </section>
    )
} 