import { useEffect } from "react"
import { useState } from "react"
import { boardService } from "../../services/board.service"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveTask } from "../../store/board.action";
import { Button, SplitButton, Icon } from "monday-ui-react-core";
import { Checkbox, Status, Numbers, PersonRound, TextCopy, Time, Calendar, File } from "monday-ui-react-core/icons";
export function TaskActivityLog({ board, group, task = '', formatTime }) {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        onLoadTaskActivities()
    }, [])

    function onLoadTaskActivities() {
        let taskActivities = board.activities.filter(activity => activity.task.id === task.id)
        setActivities(taskActivities)
    }

    function getActivityType(activityType) {

        switch (activityType) {
            case 'Text':
                return <div> <Icon iconType={Icon.type.SVG} icon={TextCopy} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'Person':
                return <div> <Icon iconType={Icon.type.SVG} icon={PersonRound} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'Date':
                return <div> <Icon iconType={Icon.type.SVG} icon={Calendar} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'priority':
                return <div> <Icon iconType={Icon.type.SVG} icon={Status} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'status':
                return <div> <Icon iconType={Icon.type.SVG} icon={Status} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'Check':
                return <div> <Icon iconType={Icon.type.SVG} icon={Checkbox} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'File':
                return <div> <Icon iconType={Icon.type.SVG} icon={File} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>

            default:
                return ''
                break;
        }

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
                return <div className="activity" key={activity.id}>
                    <div className="wrapper flex">
                        <div className="date flex align-center" style={{ width: '56px' }}>
                            <Icon icon={Time} iconLabel="my bolt svg icon" style={{ width: '15px', height: '15px' }} iconSize={15} ignoreFocusStyle className='clock-img' />
                            <div className="comment-date"> {formatTime(activity.createdAt)} </div>
                        </div>
                        <div className="first-details flex align-center">
                            <img src={(activity.byMember?.imgUrl) ? activity.byMember.imgUrl : 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674331758/g-profile_zylwbg.png'} alt="" className="user" />
                            <h5>{task.title}</h5>
                        </div>
                        <h5 className="type"> {getActivityType(activity.type)}</h5>
                        {/* <h5 className="type"> {activity.type}</h5> */}
                        <h5 className="txt"> {activity.txt}</h5>

                    </div>
                    <hr />
                </div>
            })}

        </div>

    </section>
}