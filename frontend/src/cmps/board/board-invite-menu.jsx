import { TextField, DialogContentContainer, List, ListItem, ListItemIcon, IconButton, } from "monday-ui-react-core";
import { Add as AddIcon, DisabledUser } from "monday-ui-react-core/icons";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { addUser, removeUser } from "../../store/board.action";

export function BoardInviteMenu({ setModalState }) {
    let { board } = useSelector((storeState) => storeState.boardModule)
    let { users } = useSelector((storeState) => storeState.userModule)
    const [boardUsers, setBoardUsers] = useState([])
    const [suggestedUsers, setSuggestedUsers] = useState([])

    useEffect(() => {
        onLoadBoardUsers()
        onLoadSuggestedUsers()
    }, [])
    function onCloseInviteModal() {
        setModalState(false)
    }

    async function onLoadBoardUsers() {
        if (board.users.length) {
            board.users.map(async userId => {
                try {
                    const foundUser = await getUserById(userId)
                    setBoardUsers(prevUsers => [...prevUsers, foundUser])
                } catch (err) {
                    console.log('User not found', err)
                }
            })
        }
    }

    async function onLoadSuggestedUsers() {
        let foundUsers = structuredClone(users)
        if (board.users.length) {
            foundUsers = foundUsers.filter(currUser => !board.users.includes(currUser._id));
        }
        setSuggestedUsers([...foundUsers])
    }

    async function onAddBoardUser(userId) {
        if (board.users.includes(userId)) {
            return
        }
        try {
            await addUser(board, userId)
        } catch (err) {
            console.log('onAddBoardUser err', err)
        }
    }

    async function onRemoveBoardUser(userId) {
        try {
            const boardUsersNew = board.users.filter(user => user._id !== userId)
            await removeUser(board, userId)
            setBoardUsers([...boardUsersNew])
            return
        } catch (err) {
            console.log('cant remove user', err)
        }
    }
    async function onSearchQueryChange(val) {
        let foundUsers = structuredClone(users)
        if (board.users.length) {
            foundUsers = foundUsers.filter(currUser => !board.users.includes(currUser._id));
        }
        if (val) {
            const regex = new RegExp(val, 'i')
            foundUsers = foundUsers.filter(user => {
                return (regex.test(user.username) || regex.test(user.fullname))
            })
        }
        setSuggestedUsers([...foundUsers])
    }

    async function getUserById(userId) {
        try {
            const foundUser = await users.find(user => user._id === userId)
            return foundUser
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
                }}>
                    <TextField onChange={val => { onSearchQueryChange(val) }} placeholder="Enter name or email" />
                </form>
                <hr style={{ display: suggestedUsers.length ? 'block' : 'none' }} />
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
                            <div className="flex">
                                <img className="monday-style-avatar--small user-round-icon" src={user.imgUrl} alt='custom icon' width='24px' height='24px' />
                                <span>{user.fullname}</span>
                            </div>
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
                            <div className="board-user-line flex space-between" style={{ width: '100%' }}>
                                <div className="flex align-center">
                                    <img className="monday-style-avatar--small user-round-icon" src={user.imgUrl} alt='custom icon' width='24px' height='24px' />
                                    <span>{user.fullname}</span>
                                </div>
                                <IconButton
                                    className="remove-board-user"
                                    ariaLabel="Add"
                                    icon={DisabledUser}
                                    onClick={() => { onRemoveBoardUser(user._id) }}
                                    size="xs"
                                />
                            </div>
                        </ListItem>
                    }
                    )}
                </List>
            </DialogContentContainer>
        </div>
    )
}