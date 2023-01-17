import { GroupPreview } from "./group-preview";

export function GroupList({ board }) {

    return <ul className="group-list">
        {board.groups.map(group =>
            <li className="group-preview" key={group.id}>
                <GroupPreview group={group} />
            </li>)}
    </ul>
}