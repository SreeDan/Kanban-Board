import React, { useMemo } from "react";
import { Column, Id, Task } from "../../types";
import styles from './ColumnContainer.module.css'
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'
import TaskContainer from "../TaskContainer/TaskContainer";
import { Card } from "@mantine/core";

interface Props {
    column: Column,
    deleteColumn: (id: Id) => void
    
    tasks: Task[]
    createTask: (columnId: Id) => void
    deleteTask: (id: Id) => void
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, createTask, tasks, deleteTask } = props;

    const {setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        animateLayoutChanges: () => false,
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    const tasksIds = useMemo(() => {
        return tasks.map(task => task.id)}, [tasks]
    )

    if (isDragging) {
        return <div className={styles.columnDraggingContainer} ref={setNodeRef} style={style}></div>
        // return <div ref={setNodeRef} style={style}></div>
    }

    return (
        <div className={styles.columnContainer} ref={setNodeRef} style={style}>
            {/** Title */}
            <div style={{cursor: "grab"}} {...attributes} {...listeners} >
                {column.title}
            </div>
            <button onClick={() => deleteColumn(column.id)}>Delete</button>
            <div>
                {tasks.map(task => (
                    <SortableContext items={tasksIds}>
                        <TaskContainer key={task.id} task={task} deleteTask={deleteTask} />
                    </SortableContext>
                ))}
            </div>

            <div>Footer</div>
            <button onClick={() => createTask(column.id)}>Add Task</button>
        </div>
    )

}

export default ColumnContainer