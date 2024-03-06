import React, { useState } from 'react'
import { Id, Task } from '../../types';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'
import { Card, Progress, Modal, Button, Group, Text, Menu, ActionIcon, Image, SimpleGrid, rem, Badge } from '@mantine/core';
import { IconDots, IconEye, IconFileZip, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
}

function TaskContainer(props: Props) {
    const { task, deleteTask } = props;
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [modalOpened, { open, close }] = useDisclosure(false);

    const {setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable ({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        animateLayoutChanges: () => false,
    });
    

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return <div 
                    ref={setNodeRef} 
                    style={style}
                    {...attributes}
                    {...listeners}>
                        {getTaskFormat()}
                </div>
    }

    return (
        <div
            ref={setNodeRef} style={style} {...attributes} {...listeners} 
            onMouseEnter = {() => setMouseIsOver(true)} 
            onMouseLeave={() => setMouseIsOver(false)}>
            {getTaskFormat()}

            <Modal
                opened={modalOpened}
                onClose={close}
                title={`Editing ${task.title}`}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                {/* Modal content */}
            </Modal>
        </div>
    )

    function getTaskFormat() {
        return (
            <Card withBorder padding="sm" radius="md" style={{marginTop: "10px", marginRight: "5px", height: "200px", border: isDragging ? '5px solid rgba(0, 0, 255, 0.09)' : ''}} onClick={open}>
                <Group justify="space-between" style={{marginBottom: "10px", visibility: isDragging ? 'hidden': 'inherit'}}>
                    <Text fz={"lg"} fw={500}>{task.title}</Text>
                    
                    {mouseIsOver && 
                        <ActionIcon variant="filled" color="red" size="md" radius="md" aria-label="Trash-Task">
                            <IconTrash onClick={(_) => deleteTask(task.id)} style={{ width: '70%', height: '70%' }} stroke={1.5} /> 
                        </ActionIcon>
                    }

                    {/* <MantineLogo type="mark" size="2rem" /> */}
                    {/* <Badge>12 days left</Badge> */}
                </Group>

            
            <Text fz="sm" c="dimmed" mt={5} style={{visibility: isDragging ? 'hidden': 'inherit'}}>
                {task.description.replace(/(.{110})..+/, "$1…")}
            </Text>

            <Text c="dimmed" fz="sm" mt="md" style={{visibility: isDragging ? 'hidden': 'inherit'}}>
                Subtasks completed:{' '}
                <Text span fw={500} c="bright">
                    {task.completedSubtasks}/{task.totalSubtasks}
                </Text>
            </Text>

            <Progress value={(task.completedSubtasks / task.totalSubtasks) * 100} mt={5} style={{visibility: isDragging ? 'hidden': 'inherit'}}/>
            </Card>


             
        )
    }
}

export default TaskContainer