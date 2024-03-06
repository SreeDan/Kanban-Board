import { useMemo, useState } from 'react'
import { Column, Id, Task } from '../../types';
import Columns from '../ColumnContainer/Columns';
import styles from './KanbanBoard.module.css';
import { v4 as uuid } from 'uuid';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import TaskContainer from '../TaskContainer/TaskContainer';

function KanbanBoard() {
    const[columns, setColumns] = useState<Column[]>([]);
    const columnsId: any = useMemo(() => columns.map((col) => col.id), [columns]);
    const [activeColumn, setActiveColumn] = useState<Column | null>()
    
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null> (null) 

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, //px
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

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: uuid(),
            columndId: columnId,
            title: `Task ${tasks.length}`,
            description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
            subtask: [],
            totalSubtasks: 0,
            completedSubtasks: 0,
            dueDate: null
        }

        setTasks([...tasks, newTask]);
    }

    function deleteTask(id: Id) {
        const newTasks = tasks.filter(task => task.id !== id)
        setTasks(newTasks)
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

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);
        
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

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        
        if (!over) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) {
            return;
        }

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        
        if (!isActiveATask) return;

        // Drop a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(t => t.id === active.id);
                const overIndex = tasks.findIndex((t) => t.id === overId);
                
                tasks[activeIndex].columndId = tasks[overIndex].columndId;

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";
        
        // Drop a Task over another Column
        if (isActiveATask && isOverAColumn) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(t => t.id === active.id);
                
                tasks[activeIndex].columndId = overId;

                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }

    }


    return (
        <div className={styles.kanbanBoard}>
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors} onDragOver={onDragOver}>
                <button className={styles.columnAddButton} onClick={createNewColumn}>Add Column</button>
                <SortableContext items={columnsId}>
                    {columns.map(col => 
                        <div className={styles.columnContainer}> 
                            {/* <ColumnContainer column={col} 
                                deleteColumn={deleteColumn} 
                                createTask={createTask} 
                                tasks={tasks.filter(task => task.columndId === col.id)}
                                deleteTask={deleteTask}
                                /> */}
                                <Columns column={col} 
                                deleteColumn={deleteColumn} 
                                createTask={createTask} 
                                tasks={tasks.filter(task => task.columndId === col.id)}
                                deleteTask={deleteTask}
                                />
                        </div>        
                    )}
                </SortableContext>

                {createPortal(<DragOverlay>
                   {/* {activeColumn && 
                        (<ColumnContainer 
                            column={activeColumn} 
                            deleteColumn={deleteColumn}
                            tasks={tasks.filter(task => task.columndId === activeColumn.id)}
                            createTask={createTask}
                            deleteTask={deleteTask}
                            />)}  */}
                    {activeColumn && 
                        (<Columns 
                            column={activeColumn} 
                            deleteColumn={deleteColumn}
                            tasks={tasks.filter(task => task.columndId === activeColumn.id)}
                            createTask={createTask}
                            deleteTask={deleteTask}
                            />)}
                    {activeTask && 
                        (<TaskContainer task={activeTask}
                            deleteTask={deleteTask} />
                        
                    )}
                   
                </DragOverlay>, document.body)}

            </DndContext>
        </div>
    )
    
}

export default KanbanBoard