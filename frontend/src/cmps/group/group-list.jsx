import { boardService } from "../../services/board.service";
import { showErrorMsg } from "../../services/event-bus.service";
import { addGroup, removeGroup, saveGroup } from "../../store/board.action";
import { GroupPreview } from "./group-preview";

export function GroupList({ board, groups, toggleModal }) {

    async function onAddGroup() {
        try {
            let groupToSave = boardService.getEmptyGroup()
            await addGroup(groupToSave, board)
        } catch (err) {
            showErrorMsg('Cannot save board')
        }
    }

    async function onUpdateGroup(board, groupId) {
        saveGroup()
    }

    async function onRemoveGroup(groupId) {
        console.log('here');
        removeGroup(board, groupId)
    }

    return <ul className="group-list">
        <hr className="group-list-main-hr" />
        <button className="new-group-btn" onClick={onAddGroup}>New Group</button>
        {groups.map(group =>
            <li className="group-preview-line" key={group.id}>
                <GroupPreview group={group} toggleModal={toggleModal}/>
                <button onClick={() => onRemoveGroup(group.id)}>Delete</button>
            </li>)}
    </ul>
}