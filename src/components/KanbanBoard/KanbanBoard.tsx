import React, { useMemo, useState } from 'react'
import { Column, Id } from '../../types';
import ColumnContainer from '../ColumnContainer/ColumnContainer';
import styles from './KanbanBoard.module.css';
import { v4 as uuid } from 'uuid';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

function KanbanBoard() {
    const[columns, setColumns] = useState<Column[]>([]);
    const columnsId: any = useMemo(() => columns.map((col) => col.id), [columns]);
    const [activeColumn, setActiveColumn] = useState<Column | null>()
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, //px
            },
        })
    );

    console.log(columns)

    function createNewColumn() {
        const columnToAdd: Column = {
            id: uuid(),
            title: `New Column ${columns.length + 1}`,
        };

        setColumns([...columns, columnToAdd])
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter((col) => col.id !== id);
        setColumns(filteredColumns);

    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        
        if (!over) {
            return;
        }

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) {
            return;
        }

        setColumns(cols => {
            const activeColumnIndex = columns.findIndex(
                (col) => col.id === activeColumnId
            )

            const overColumnIndex = columns.findIndex(
                (col) => col.id === overColumnId
            )

            return arrayMove(cols, activeColumnIndex, overColumnIndex);
        })
    }


    return (
        <div className={styles.kanbanBoard}>
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors}>
                <button className={styles.columnAddButton} onClick={createNewColumn}>Add Column</button>
                <SortableContext items={columnsId}>
                    {columns.map(col => 
                        <div className={styles.columnContainer}> 
                            <ColumnContainer column={col} deleteColumn={deleteColumn} />
                        </div>        
                    )}
                </SortableContext>

                {createPortal(<DragOverlay>
                   {activeColumn && 
                        (<ColumnContainer 
                            column={activeColumn} 
                            deleteColumn={deleteColumn}
                            />)} 
                </DragOverlay>, document.body)}

            </DndContext>
        </div>
    )
    
}

export default KanbanBoard