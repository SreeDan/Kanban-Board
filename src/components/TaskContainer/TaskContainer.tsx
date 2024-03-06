import React, { MouseEventHandler, useMemo, useState } from 'react'
import { Id, Task } from '../../types';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'
import { Card, Progress, Modal, Textarea, Group, Text, ActionIcon, Input, CloseButton, Autocomplete, Pill } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { DatePickerInput, DateValue } from '@mantine/dates';
import '@mantine/dates/styles.css';


interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
}

function TaskContainer(props: Props) {
    const { task, deleteTask } = props;
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [modalOpened, { open, close }] = useDisclosure(false);
    const [taskDescription, setTaskDescription] = useState<string>(task.description);
    const [taskTitle, setTaskTitle] = useState<string>(task.title);
    const [taskDueDate, setTaskDueDate] = useState<Date | null>(task.dueDate);

    const {setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable ({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        animateLayoutChanges: () => false,
    });

    const daysLeft = useMemo(() => {
        if (task.dueDate == null) {
            return 0;
        }

        const differenceMillis = task.dueDate.getTime() - Date.now();
        if (differenceMillis < 0 || differenceMillis === 0) {
            return 0;
        }

        const diffDays = Math.ceil(Math.abs(differenceMillis) / (1000 * 60 * 60 * 24))
        

        return diffDays;
    }, [taskDueDate]
    )
    

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    const handleTaskDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        task.description = event.target.value;
        setTaskDescription(event.target.value);
    }

    const handleTaskTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleTaskTitleChangeRaw(event.target.value);
    }

    const handleTaskTitleChangeButton = (_: any) => {
        handleTaskTitleChangeRaw('');
    }

    const handleTaskTitleChangeRaw = (str: string) => {
        task.title = str;
        setTaskTitle(str);
    }

    const handleTaskDueDateChange = (date: DateValue) => {
        task.dueDate = date;
        setTaskDueDate(date);
    }

    
    if (isDragging) {
        return <div 
                    ref={setNodeRef} 
                    style={style}>
                        {getTaskFormat()}
                </div>
    }

    return (
        <div
            ref={setNodeRef} style={style} 
            onMouseEnter = {() => setMouseIsOver(true)} 
            onMouseLeave={() => setMouseIsOver(false)}>
            {getTaskFormat()}

            <Modal
                opened={modalOpened}
                onClose={close}
                title={`Editing ${task.title}`}
                size="70%"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >

            <Group justify="space-between">
            <Input.Wrapper label="Task title" >
                <Input
                    placeholder="Task Title"
                    value={taskTitle}
                    onChange={handleTaskTitleChange}
                    rightSectionPointerEvents="all"
                    mt="md"
                    style={{width: '450px'}}
                    rightSection={
                        <CloseButton
                            aria-label="Clear input"
                            onClick={handleTaskTitleChangeButton}
                            style={{ display: taskTitle ? undefined : 'none' }}
                        />
                    }
                />
            </Input.Wrapper>
            <DatePickerInput
                valueFormat="MMM DD YYYY"
                label="Due Date"
                placeholder="Pick a due date"
                value={taskDueDate}
                onChange={handleTaskDueDateChange}
                clearable
                minDate={new Date()}
                style={{width: '300px'}}
            />

            </Group>

                <Textarea
                    label="Task Description"
                    placeholder="Enter your task description..."
                    value={taskDescription}
                    autosize
                    minRows={2}
                    maxRows={4}
                    onChange={handleTaskDescriptionChange}
                />
            </Modal>
        </div>
    )

    function getTaskFormat() {
        return (
            <Card withBorder padding="sm" radius="md" style={{marginTop: "10px", marginRight: "5px", height: "200px", border: isDragging ? '5px solid rgba(0, 0, 255, 0.09)' : ''}} onClick={open}>
                <Group justify="space-between" style={{cursor: "grab", padding: '5px', marginBottom: "10px", visibility: isDragging ? 'hidden': 'inherit', border: '1px solid black', borderRadius: '5px'}} {...attributes} {...listeners}>
                    <Text fz={"lg"} fw={500}>{task.title.replace(/(.{27})..+/, "$1…")}</Text>
                    
                    {mouseIsOver && 
                        <ActionIcon variant="filled" color="red" size="md" radius="md" aria-label="Trash-Task">
                            <IconTrash onClick={(_) => deleteTask(task.id)} style={{ width: '70%', height: '70%' }} stroke={1.5} /> 
                        </ActionIcon>
                    }

                    {!mouseIsOver && 
                        <Pill size="lg">{daysLeft} day{daysLeft == 1 ? '' : 's'} left</Pill>
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