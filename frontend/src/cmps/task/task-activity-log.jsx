import { useEffect } from "react"
import { useState } from "react"
import { boardService } from "../../services/board.service"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveTask } from "../../store/board.action";
import { Button, SplitButton } from "monday-ui-react-core";
import { PersonRound } from "monday-ui-react-core/icons";

export function TaskActivityLog({ board, group, task = '' }) {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        onLoadTaskActivities()
    }, [])


    function onLoadTaskActivities() {
        let taskActivities = board.activities.filter(activity => activity.task.id === task.id)
        setActivities(taskActivities)
    }

    return <section className='task-activity-log'>
        <Button className='person' kind={Button.kinds.TERTIARY} leftIcon={PersonRound} >
            Person
        </Button>
        <SplitButton children="Filter" secondaryDialogContent={['hey']} size={Button.sizes.MEDIUM} secondaryPositions={SplitButton.secondaryPositions.BOTTOM_MIDDLE} />

        <div className="main-activity-container">
            {activities.map(activity => {
                return <div className="activity flex">

                    <div className="user-line flex justify-between">
                        <div className="flex align-center">
                            <img src={activity.byMember.imgUrl} alt="" className="user" />
                            <a>{activity.byMember.fullname} </a>
                        </div>
                        <div className="main-comment flex">
                            <h5> {activity.type}</h5>
                            <h5> {activity.txt}</h5>
                        </div>

                    </div>


                </div>
            })}

        </div>

    </section>
}