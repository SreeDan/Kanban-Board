import React from "react";
import { Column, Id } from "../../types";
import styles from './ColumnContainer.module.css'
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'

interface Props {
    column: Column,
    deleteColumn: (id: Id) => void
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn } = props;

    const {setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        },
        animateLayoutChanges: () => false,
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return <div className={styles.columnDraggingContainer} ref={setNodeRef} style={style}></div>
    }

    return (
        <div className={styles.columnContainer} ref={setNodeRef} style={style}>
            {/** Title */}
            <div style={{cursor: "grab"}} {...attributes} {...listeners} >
                {column.title}
            </div>
            <button onClick={() => deleteColumn(column.id)}>Delete</button>
            <div>
                TASK
            </div>

            <div>Footer</div>
        </div>
    )

}

export default ColumnContainer