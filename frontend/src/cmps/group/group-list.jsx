import { GroupPreview } from "./group-preview";

export function GroupList({ board }) {

    console.log(board.title);

    return <ul className="group-list">
        <div className="board-title-group-wrap">
            <h1 className="board-title-group">{board.title}</h1>
            <button>i</button>
            <button>star</button>
        </div>
        <hr className="group-list-main-hr" />
        <button className="new-group-btn">New Item</button>
        {board.groups.map(group =>
            <li className="group-preview-line" key={group.id}>
                <GroupPreview group={group} />
            </li>)}
    </ul>
}