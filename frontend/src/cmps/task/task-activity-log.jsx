import { useEffect } from "react"
import { useState } from "react"
import { boardService } from "../../services/board.service"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveTask } from "../../store/board.action";
import { Button, SplitButton, icon } from "monday-ui-react-core";
import { Checkbox, Status, Numbers, PersonRound, TextCopy } from "monday-ui-react-core/icons";

export function TaskActivityLog({ board, group, task = '' }) {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        onLoadTaskActivities()
    }, [])

    console.log(activities);
    function onLoadTaskActivities() {
        let taskActivities = board.activities.filter(activity => activity.task.id === task.id)
        setActivities(taskActivities)
    }

    function getActivityType(activity) {

    }

    return <section className='task-activity-log'>
        <div className="activity-btns flex">
            <SplitButton children="Filter" secondaryDialogContent={['hey']} size={Button.sizes.SMALL} secondaryPositions={SplitButton.secondaryPositions.BOTTOM_MIDDLE} />
            <Button className='person' kind={Button.kinds.TERTIARY} leftIcon={PersonRound} size={Button.sizes.SMALL} >
                Person
            </Button>
        </div>
        <div className="main-activity-container">
            {activities.map(activity => {
                return <div className="activity">
                    <div className="wrapper flex">
                        <div className="first-details flex align-center">
                            <img src={activity.byMember.imgUrl} alt="" className="user" />
                            <h5>{task.title}</h5>
                        </div>
                        <h5 className="type"> {activity.type}</h5>
                        <h5> {activity.txt}</h5>

                    </div>
                    <hr />
                </div>
            })}

        </div>

    </section>
}