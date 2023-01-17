import { TaskList } from "../task/task-list";

export function GroupPreview({ group }) {

    return (
        <section className="group-preview">
            <div className="group-title"> {group.title} {group.tasks.length} </div>
            <TaskList group={group} />
        </section>
    )


}