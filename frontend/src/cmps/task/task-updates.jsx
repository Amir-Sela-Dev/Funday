import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux";
import { boardService } from "../../services/board.service"

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveTask } from "../../store/board.action";
import { Send, Time } from "monday-ui-react-core/icons";
import { Icon } from "monday-ui-react-core";
import { socketService, SOCKET_EMIT_CHANGE_COMMENTS, SOCKET_EVENT_COMMENTS_UPDATED, SOCKET_EVENT_TASK_UPDATED } from "../../services/socket.service";

export function TaskUpdates({ board, group, task = '', formatTime }) {
    let { user } = useSelector((storeState) => storeState.userModule)
    const [value, setValue] = useState('');
    const [comment, setComment] = useState(boardService.getDefaultComment());
    const [isInputClicked, setIsInputClicked] = useState(false);
    const [comments, setComments] = useState([]);

    const emtyModalImg = 'task-modal-empty-state.svg'
    const clock = 'clock.svg'

    useEffect(() => {
        socketService.on(SOCKET_EMIT_CHANGE_COMMENTS, onSetComments)
    }, [])

    useEffect(() => {
        setComments(task.comments)
    }, [task])

    useEffect(() => {
        function handleClickOutside(event) {
            if (event.target.closest('.txt-editor-container') === null) {
                setIsInputClicked(false)
            }
        }

        if (isInputClicked) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [isInputClicked]);


    async function onAddTaskComment() {
        if (!value) return
        console.log('user', user)
        comment.txt = value
        comment.createdAt = Date.now()
        comment.byMember = user
        task.comments.unshift(comment)
        await saveTask(board, group.id, task)
        setComments(task.comments)
        socketService.emit(SOCKET_EVENT_COMMENTS_UPDATED, comment)
        setComment(boardService.getDefaultComment())
        setValue('')
    }

    function onSetComments(comment) {
        console.log(comment);
        setComments(prevComments => [comment, ...prevComments])
    }




    if (!task) return
    return <section className='task-updates flex'>
        {!isInputClicked && <div className="opend-input" onClick={() => { setIsInputClicked(!isInputClicked) }}>
            <input type="text" placeholder="Write an update..." />
        </div>}
        {isInputClicked && <div className="txt-editor-container">
            <div>
                <ReactQuill className="txt-editor" theme="snow" value={value} onChange={setValue} />
            </div>
            <button className="update-btn" onClick={onAddTaskComment}>
                Send
                <Icon iconType={Icon.type.SVG} icon={Send} iconLabel="my bolt svg icon" iconSize={16} />
            </button>
        </div>}
        {/* <div style={{marginBlockStart: '25px'}}/> */}
        <div className="main-details-container">
            {comments.map((comment, idx) => {
                return <div className="comment flex"
                    key={idx}
                >

                    <div className="user-line flex justify-between">
                        <div className="flex align-center">
                            <img src={comment?.byMember?.imgUrl || 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674331758/g-profile_zylwbg.png'} alt="" className="user" />
                            <a> {comment?.byMember?.fullname || 'Guest'} </a>
                            <div className="is-active"></div>
                        </div>
                        <div className="date flex align-center">
                            <Icon icon={Time} iconLabel="my bolt svg icon" style={{ width: '15px', height: '15px' }} iconSize={15} ignoreFocusStyle className='clock-img' />
                            <div className="comment-date"> {formatTime(comment.createdAt)} </div>
                        </div>
                    </div>


                    <div className="main-comment" dangerouslySetInnerHTML={{ __html: comment.txt }} />
                </div>
            })}

        </div>

        {!task.comments.length && <div className="img-container">
            <img className="emty-modal-img" src={require(`/src/assets/img/${emtyModalImg}`)} />
        </div>
        }    </section>
}