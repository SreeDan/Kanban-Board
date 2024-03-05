import React, { useMemo } from "react";
import { Column, Id, Task } from "../../types";
import styles from './ColumnContainer.module.css'
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'
import TaskContainer from "../TaskContainer/TaskContainer";
import { Card, Button, Group, Text, Menu, ActionIcon, Image, SimpleGrid, rem } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';

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
        // return <div className={styles.columnDraggingContainer} ref={setNodeRef} style={style}></div>
        return ( 
            <div className={styles.columnDraggingContainer} ref={setNodeRef} style={style}>
                {/* <div ref={setNodeRef} style={style}> */}
                    {/* {getColumnFormat()} */}
                {/* </div> */}
            </div>
            )
    } else {
        return (
            <div className={styles.columnContainer} ref={setNodeRef} style={style}>
                {getColumnFormat()}
            </div>
        )
    }

    

    function getColumnFormat() {
        return (
        // <div ref={setNodeRef} style={style}>
            
        <Card >
        <div style={{cursor: "grab"}} {...attributes} {...listeners}> {/** grab area */} 
            <div style={{cursor: "grab", border: "1px solid black", padding: "15px", borderRadius: "10px"}}>
            <Card.Section inheritPadding py="xs">
                <Group justify="space-between">
                    
                    <Text fz={"xl"} fw={500}>{column.title}</Text>
                    
                        <Menu withinPortal position="bottom-end" shadow="sm">
                            <Menu.Target>
                                <ActionIcon variant="subtle" color="gray">
                                    <IconDots style={{ width: rem(16), height: rem(16) }} />
                                </ActionIcon>
                            </Menu.Target>
                        </Menu>
                </Group>
            </Card.Section>
            </div>
        </div>

        <div style={{overflowY: "auto"}}>
                {tasks.map(task => (
                    <SortableContext items={tasksIds} >
                        <TaskContainer key={task.id} task={task} deleteTask={deleteTask} />
                    </SortableContext>
                ))}
            </div>

        <Button color="blue" fullWidth mt="md" radius="md" onClick={(_) => createTask(column.id)}>
                    Add Task
            </Button>
        </Card>
        // </div>
        )
    }

}

export default ColumnContainer