import { TextField, DialogContentContainer, List, ListItem } from "monday-ui-react-core";
import { useState } from "react";
import { useSelector } from "react-redux";
import { addUser } from "../../store/board.action";

export function BoardInviteMenu({ setModalState }) {
    let { board } = useSelector((storeState) => storeState.boardModule)
    let { users } = useSelector((storeState) => storeState.userModule)
    const [suggestedUsers, setSuggestedUsers] = useState([])

    function onCloseInviteModal() {
        setModalState(false)
    }

    async function onAddBoardUser(userId) {
        try {
            await addUser(board, userId)
        } catch (err) {
            console.log('onAddBoardUser err', err)
        }
    }

    async function onSearchQueryChange(val) {
        const regex = new RegExp(val, 'i')
        let usersToShow = users.filter(user => {
            return (regex.test(user.username) || regex.test(user.fullname))
        })
        setSuggestedUsers([...usersToShow])
        if (!val) setSuggestedUsers([])
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
                <List className="suggested-invites"
                    style={{}}>
                    {suggestedUsers.map(user =>
                        <ListItem
                            key={user._id}
                            onClick={() => {
                                onAddBoardUser(user._id)
                                onCloseInviteModal()
                            }}>
                            {user.fullname}
                        </ListItem>)}
                </List>
            </DialogContentContainer>
        </div>
    )
}