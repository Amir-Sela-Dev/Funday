import { useEffect } from "react"
import { useState } from "react"
import { boardService } from "../../services/board.service"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveTask } from "../../store/board.action";
import { Button, SplitButton, Icon, Avatar } from "monday-ui-react-core";
import { Checkbox, Status, Numbers, PersonRound, TextCopy, Time, Calendar, File, NavigationChevronRight, Check } from "monday-ui-react-core/icons";
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
                return <div className="flex align-center"> <Icon iconType={Icon.type.SVG} icon={TextCopy} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'Person':
                return <div className="flex align-center"> <Icon iconType={Icon.type.SVG} icon={PersonRound} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'Date':
                return <div className="flex align-center"> <Icon iconType={Icon.type.SVG} icon={Calendar} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'priority':
                return <div className="flex align-center"> <Icon iconType={Icon.type.SVG} icon={Status} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'status':
                return <div className="flex align-center"> <Icon iconType={Icon.type.SVG} icon={Status} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'Check':
                return <div className="flex align-center"> <Icon iconType={Icon.type.SVG} icon={Checkbox} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'File':
                return <div className="flex align-center"> <Icon iconType={Icon.type.SVG} icon={File} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>
            case 'Timeline':
                return <div className="flex align-center"> <Icon iconType={Icon.type.SVG} icon={Calendar} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> {activityType} </div>

            default:
                return ''
                break;
        }

    }

    function getactivityFrom(activity) {
        switch (activity.type) {
            case 'status':
                console.log(activity);
                if (activity.from === 'Done') return <div className="label" style={{ background: 'rgb(0, 200, 117)' }}> {activity.from} </div>
                else if (activity.from === 'Working on it') return <div className="label" style={{ background: 'rgb(253, 171, 61)' }}> {activity.from} </div>
                else if (activity.from === 'Stuck') return <div className="label" style={{ background: 'rgb(226, 68, 92)' }}> {activity.from} </div>
                else if (activity.from === 'Default') return <div className="label" style={{ background: 'rgb(185, 185, 185)' }}> {activity.from} </div>
                break;

            case 'Person':
                return <div className="action from">{activity.from} </div>

            case 'Date':
                return <div className="action from">{activity.from} </div>

            case 'Timeline':
                return <div className="action from">{activity.from.start} </div>
            case 'Text':
                return <div className="action from">{activity.from} </div>
            case 'File':
                return <div className="action from">{activity.from} </div>
            case 'Check':
                return <div className="action from">{activity.from} </div>
            case 'priority':
                if (activity.from === 'Critical') return <div className="label" style={{ background: 'rgb(51, 51, 51)' }}> {activity.from} </div>
                else if (activity.from === 'High') return <div className="label" style={{ background: 'rgb(64, 22, 148)' }}> {activity.from} </div>
                else if (activity.from === 'Medium') return <div className="label" style={{ background: 'rgb(85, 89, 223)' }}> {activity.from} </div>
                else if (activity.from === 'Low') return <div className="label" style={{ background: 'rgb(87, 155, 252' }}> {activity.from} </div>
                else if (activity.from === 'Default') return <div className="label" style={{ background: 'rgb(185, 185, 185)' }}> {activity.from} </div>

            default:
                return ''
                break;
        }
    }

    function getactivityTo(activity) {
        switch (activity.type) {
            case 'status':
                console.log(activity);
                if (activity.to === 'Done') return <div className="label" style={{ background: 'rgb(0, 200, 117)' }}> {activity.to} </div>
                else if (activity.to === 'Working on it') return <div className="label" style={{ background: 'rgb(253, 171, 61)' }}> {activity.to} </div>
                else if (activity.to === 'Stuck') return <div className="label" style={{ background: 'rgb(226, 68, 92)' }}> {activity.to} </div>
                else if (activity.to === 'Default') return <div className="label" style={{ background: 'rgb(185, 185, 185)' }}> {activity.to} </div>
                break;

            case 'Person':
                return <div className="action"  > <Avatar type={Avatar.types.IMG} size="small" src={activity.to.imgUrl} ariaLabel={activity.to.fullname} /></div>

            case 'Date':
                return <div className="action" > {activity.to} </div>
            case 'Timeline':
                return <div className="action">{activity.to.end} </div>

            case 'Text':
                return <div className="action">{activity.to} </div>
            case 'File':
                return <Avatar className="action" type={Avatar.types.IMG} isSquare={true} size="small" src={activity.to} />
            case 'Check':
                if (activity.to) return <div className="action"> <Icon icon={Check} className="action" style={{ color: 'green', width: '25px', height: '25px' }} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle /> </div>
                else return <div className="action"> </div>
            case 'priority':
                if (activity.to === 'Critical') return <div className="label" style={{ background: 'rgb(51, 51, 51)' }}> {activity.to} </div>
                else if (activity.to === 'High') return <div className="label" style={{ background: 'rgb(64, 22, 148)' }}> {activity.to} </div>
                else if (activity.to === 'Medium') return <div className="label" style={{ background: 'rgb(85, 89, 223)' }}> {activity.to} </div>
                else if (activity.to === 'Low') return <div className="label" style={{ background: 'rgb(87, 155, 252' }}> {activity.to} </div>
                else if (activity.to === 'Default') return <div className="label" style={{ background: 'rgb(185, 185, 185)' }}> {activity.to} </div>

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
                        <div className="date flex align-center" >
                            <Icon icon={Time} iconLabel="my bolt svg icon" style={{ width: '15px', height: '15px' }} iconSize={15} ignoreFocusStyle className='clock-img' />
                            <div className="comment-date"> {formatTime(activity.createdAt)} </div>
                            <img src={(activity.byMember?.imgUrl) ? activity.byMember.imgUrl : 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674331758/g-profile_zylwbg.png'} alt="" className="user" />
                        </div>
                        <h5 className="type"> {getActivityType(activity.type)}</h5>
                        {/* <h5 className="type"> {activity.type}</h5> */}
                        <h5 className="txt"> {getactivityFrom(activity)}</h5>
                        <Icon iconType={Icon.type.SVG} icon={NavigationChevronRight} iconLabel="my bolt svg icon" iconSize={16} ignoreFocusStyle style={{ marginInline: '20px' }} />
                        <h5 className="txt"> {getactivityTo(activity)}</h5>

                    </div>
                    <hr />
                </div>
            })}

        </div>

    </section>
}