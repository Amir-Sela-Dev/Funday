
export function GroupPreview({ group }) {

    return (
        <div className="group-title"> {group.title} {group.tasks.length}</div>
    )


}