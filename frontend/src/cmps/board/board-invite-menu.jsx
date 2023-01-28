import { TextField, DialogContentContainer, List, ListItem, ListItemIcon, IconButton } from "monday-ui-react-core";
import { Add as AddIcon } from "monday-ui-react-core/icons";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { addUser } from "../../store/board.action";

export function BoardInviteMenu({ setModalState }) {
    let { board } = useSelector((storeState) => storeState.boardModule)
    let { users } = useSelector((storeState) => storeState.userModule)
    const [boardUsers, setBoardUsers] = useState([])
    const [suggestedUsers, setSuggestedUsers] = useState([])

    useEffect(() => {
        onLoadBoardUsers()
    }, [])
    function onCloseInviteModal() {
        setModalState(false)
    }

    async function onLoadBoardUsers() {
        if (board.users.length){            
            board.users.map(async userId => {
                try {
                    const foundUser = await getUserById(userId)
                    setBoardUsers(prevUsers => [...prevUsers, foundUser])
                    console.log('addedUserToBoard', foundUser)
                } catch (err) {
                    console.log('User not found', err)
                }
            })
        }
    }
    async function onAddBoardUser(userId) {
        if (board.users.includes(userId)){
            console.log('already on board', getUserById(userId))
            return
        }
        try {
            await addUser(board, userId)
        } catch (err) {
            console.log('onAddBoardUser err', err)
        }
    }

    async function onSearchQueryChange(val) {
        console.log('loaded users', users)
        const regex = new RegExp(val, 'i')
        let usersToShow = users.filter(user => {
            return (regex.test(user.username) || regex.test(user.fullname))
        })
        setSuggestedUsers([...usersToShow])
        if (!val) setSuggestedUsers([])
    }

    async function getUserById(userId) {
        try {
            const foundUser = await users.find(user => user._id === userId)
            return foundUser
            // console.log('Found user!', foundUser)
        }
        catch (err) {
            console.log('User not found', err)
        }
    }
    return (
        <div className="invite-modal">
            <div onClick={onCloseInviteModal} className="dark-screen static" />
            <DialogContentContainer className="invite-menu" type={DialogContentContainer.types.MODAL}
                style={
                    {
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'

                    }
                }>
                <span className="modal-title">Board Members</span>
                <form className="monday-storybook-text-field_size" onSubmit={ev => {
                    ev.stopPropagation()
                    console.log('hi')
                }}>
                    <TextField onChange={val => { onSearchQueryChange(val) }} placeholder="Enter name or email" />
                </form>
                <hr style={{ display: suggestedUsers.length ? 'block' : 'none' }}/>
                <span style={{ display: suggestedUsers.length ? 'block' : 'none' }}>Invite..</span>
                <List className="suggested-invites"
                    style={{ display: suggestedUsers.length ? 'block' : 'none' }}>
                    {suggestedUsers.map(user =>
                        <ListItem
                            className="board-users-li flex"
                            key={user._id}
                            onClick={() => {
                                onAddBoardUser(user._id)
                                onCloseInviteModal()
                            }}>
                            <img className="monday-style-avatar--small user-round-icon" src={user.imgUrl} alt='custom icon' width='24px' height='24px' />
                            {user.fullname}
                        </ListItem>)}
                </List>
                <hr />
                <span>Board Users</span>
                <List className="suggested-invites"
                    style={{}}>
                    {boardUsers.map(user => {
                        return <ListItem
                            key={user._id}
                            onClick={() => {
                                onAddBoardUser(user._id)
                                onCloseInviteModal()
                            }}>
                                <img className="monday-style-avatar--small user-round-icon" src={user.imgUrl} alt='custom icon' width='24px' height='24px' />
                                {user.fullname}
                        </ListItem>
                    }
                    )}
                </List>
            </DialogContentContainer>
        </div>
    )
}