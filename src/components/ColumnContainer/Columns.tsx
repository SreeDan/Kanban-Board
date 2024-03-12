import { useMemo, useState } from "react";
import { ApplicationData, Column, Id, Priority, Task } from "../../types";
import styles from './ColumnContainer.module.css'
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'
import TaskContainer from "../TaskContainer/TaskContainer";
import { Card, Button, Group, Text, Menu, ActionIcon, Image, SimpleGrid, rem, Modal, TextInput } from '@mantine/core';
import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react';
import initialData from "../../initialData";
import { useDisclosure } from "@mantine/hooks";

interface Props {
    column: Column,
    deleteColumn: (id: Id) => void
    priorities: Priority[];
    tasks: Task[]
    createTask: (columnId: Id) => void
    deleteTask: (id: Id) => void,
    initialStates: ApplicationData
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, createTask, tasks, deleteTask, priorities } = props;
    const [openColumnNameModal, { open, close }] = useDisclosure(false);
    const [ columnTitle, setColumnTitle ] = useState<string>(column.title)

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

    const handleColumnTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColumnTitle(event.target.value);
        column.title = event.target.value;
    }

    if (isDragging) {
        return ( 
            <div className={styles.columnDraggingContainer} ref={setNodeRef} style={style}></div>
            )
    } else {
        return (
            <div className={styles.columnContainer} ref={setNodeRef} style={style}>
                {getColumnFormat()}
                
                <Modal
                    opened={openColumnNameModal}
                    onClose={close}
                    title={`Editing`}
                    size="sm"
                    centered
                    overlayProps={{
                        backgroundOpacity: 0.55,
                        blur: 3,
                    }}
                >
                    <TextInput value={columnTitle} onChange={handleColumnTitleChange} />

                </Modal>
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
                    
                        <Menu withinPortal position="bottom-end" shadow="sm" >
                            <div>
                            <Menu.Target>
                                <ActionIcon variant="subtle" color="gray" >
                                    <IconPencil onClick={open} style={{ width: rem(25), height: rem(25) }} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Target>
                                <ActionIcon variant="filled" color="red" >
                                    <IconTrash onClick={(_) => deleteColumn(column.id)} style={{ width: rem(25), height: rem(25) }} />
                                </ActionIcon>
                            </Menu.Target>
                            </div>
                        </Menu>
                </Group>
            </Card.Section>
            </div>
        </div>

        <div style={{overflowY: "auto"}}>
                {tasks.map(task => (
                    <SortableContext items={tasksIds} >
                        <TaskContainer key={task.id} task={task} deleteTask={deleteTask} initialStates={initialData} priorities={priorities}/>
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