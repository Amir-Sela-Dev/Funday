import { GroupPreview } from "./group-preview";

export function GroupList({ board }) {

    return <ul className="group-list">
        {board.groups.map(group =>
            <li className="group-preview-line" key={group.id}>
                <GroupPreview group={group} />
            </li>)}
    </ul>
}