import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux";
import { boardService } from "../../services/board.service"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveTask } from "../../store/board.action";

export function TaskUpdates({ board, group, task = '', formatTime }) {
    let { user } = useSelector((storeState) => storeState.userModule)
    const [value, setValue] = useState('');
    const [comment, setComment] = useState(boardService.getDefaultComment());
    const emtyModalImg = 'task-modal-empty-state.svg'
    const clock = 'clock.svg'

    async function onAddTaskComment() {
        if (!value) return
        comment.txt = value
        comment.createdAt = Date.now()
        task.comments.unshift(comment)

        await saveTask(board, group.id, task)
        setComment(boardService.getDefaultComment())
        setValue('')
    }




    if (!task) return
    return <section className='task-updates flex'>
        <div className="txt-editor-container">
            <ReactQuill className="txt-editor" theme="snow" value={value} onChange={setValue} />
        </div>
        <button className="update-btn" onClick={onAddTaskComment}>Update</button>

        <div className="main-details-container">
            {task.comments.map((comment, idx) => {
                return <div className="comment flex"
                    key={idx}
                >

                    <div className="user-line flex justify-between">
                        <div className="flex align-center">
                            <img src={(user?.imgUrl) ? user.imgUrl : 'https://res.cloudinary.com/dp3tok7wg/image/upload/v1674331758/g-profile_zylwbg.png'} alt="" className="user" />
                            {/* <img src='https://res.cloudinary.com/dp3tok7wg/image/upload/v1674331758/g-profile_zylwbg.png' alt="" className="user" /> */}
                            <a> Guest </a>
                            <div className="is-active"></div>
                        </div>
                        <div className="date flex align-center">
                            <img className="clock-img" src={require(`/src/assets/img/${clock}`)} />
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