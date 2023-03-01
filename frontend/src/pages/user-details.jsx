import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { loadUser } from '../store/user.actions'
import { store } from '../store/store'
import { showSuccessMsg } from '../services/event-bus.service'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'
import { SideNav } from '../cmps/side-nav'
import { Tab } from "monday-ui-react-core";

export function UserDetails() {
  const params = useParams()
  const user = useSelector(storeState => storeState.userModule.watchedUser)
  useEffect(() => {
    loadUser(params.id)
    socketService.emit(SOCKET_EMIT_USER_WATCH, params.id)
    socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    return () => {
      socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    }
  }, [])

  function onUserUpdate(user) {
    showSuccessMsg(`This user ${user.fullname} just got updated from socket, new score: ${user.score}`)
    store.dispatch({ type: 'SET_WATCHED_USER', user })
  }
  const emailUrl = 'email.svg'
  return (
    <section className="main-user-details">
      <SideNav />
      <section className="user-details">
        {user && <div>
          <img className="user-img" src={user.imgUrl} />
          <p>
            {user.fullname}
          </p>
          <Tab className='user-details-tab' style={{ color: "  #0070e5" }} >
            Personal info
          </Tab>
        </div>}
      </section>
      <section className="user-info">
        <p className='overview'>Overview</p>
        {user && <div className="email-wrap flex">
          <div className="user-details-icon-border">
            <img className="user-details-icon mail-icon" src={require(`../assets/img/${emailUrl}`)} />
          </div>
          <p>Email: <span className='email'>{user.username}</span></p>
        </div>}
      </section>
    </section>
  )
}