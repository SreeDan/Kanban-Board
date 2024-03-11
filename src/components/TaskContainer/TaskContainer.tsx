import React, { MouseEventHandler, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { ApplicationData, Id, Priority, Subtask, Task } from '../../types';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'
import { Card, Progress, Modal, Textarea, Group, Text, ActionIcon, Input, CloseButton, Autocomplete, Pill, TextInput, Select, Divider, Checkbox } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useDisclosure, useForceUpdate } from '@mantine/hooks';
import { DatePickerInput, DateValue } from '@mantine/dates';
import '@mantine/dates/styles.css';
import styles from './TaskContainer.module.css'
import { v4 as UUID } from 'uuid';

interface Props {
    initialStates: ApplicationData
    task: Task;
    priorities: Priority[];
    deleteTask: (id: Id) => void;
}

function TaskContainer(props: Props) {
    const { task, priorities, deleteTask } = props;
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [modalOpened, { open, close }] = useDisclosure(false);
    const [taskDescription, setTaskDescription] = useState<string>(task.description);
    const [taskTitle, setTaskTitle] = useState<string>(task.title);
    const [taskDueDate, setTaskDueDate] = useState<Date | null>(task.dueDate);
    const [showSubtaskProgress, setShowSubtaskProgress] = useState<boolean>(false);
    const [showDueDateChip, setShowDueDateChip] = useState<boolean>(false);
    const [taskPriority, setTaskPriority] = useState<Priority | null>(task.priority);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>('');
    const [newSubtaskDescription, setNewSubtaskDescription] = useState<string>('');
    const [editSubtaskMode, setEditSubtaskMode] = useState<boolean>(false);
    // const [subtasksDict, setSubtasksDict] = useState<{[id: Id]: Subtask}>({});
    const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks);

    // const updateSubtaskDict = () => {
    //     console.log("changing subtasks is called")
    //     const subtaskMap: {[id: Id]: Subtask} = {};
    //     task.subtasks.forEach(element => {
    //         subtaskMap[element.id] = element;
    //     });
    //     setSubtasksDict(subtaskMap);
    //     console.log(subtaskMap)
    // }

    useEffect(() => {
        console.log("p are" + (priorities?.map(p => p.title) || []));  // Handle undefined
      }, []);
      

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

    useEffect(() => {
        if (task.dueDate === null) {
            setShowDueDateChip(false);
        } else {
            setShowDueDateChip(true);
        }
    }, [task.dueDate])

    useEffect(() => {
        if (task.totalSubtasks == 0) {
            setShowSubtaskProgress(false);
        }  else {
            setShowSubtaskProgress(true);
        }
    }, [task.subtasks, task.totalSubtasks, task.completedSubtasks])

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

    const handleTaskPriorityChange = (priority: string | null) => {
        if (priority === null) {
            return;
        }
        const priorityObj = priorities.find((p) => p.title === priority);
        if (priorityObj === undefined) {
            return;
        }

        console.log(priority)

        console.log(task)

        task.priority = priorityObj;
        setTaskPriority(priorityObj)
        console.log(task)
    }

    const addSubtask = () => {
        if (newSubtaskTitle === '' || newSubtaskDescription === '') {
            return;
        }

        const newSubtask : Subtask = {
            id: UUID(),
            title: newSubtaskTitle,
            description: newSubtaskDescription,
            completed: false
        }
        const newSubtasks = [...task.subtasks, newSubtask];
        task.subtasks = newSubtasks;
        task.totalSubtasks++;
        
        setSubtasks(newSubtasks);
        // updateSubtaskDict()
    }

    const deleteSubtask = (id: Id) => {
        const newSubtasks = task.subtasks.filter((task) => task.id !== id);
        setSubtasks(newSubtasks);
        task.subtasks = newSubtasks;
    }

    const editSubtaskTitle = (id: Id, title: string) => {
       const updatedSubtasks = task.subtasks.map(s => {
            if (s.id === id) {
                return {...s, title: title}
            }
            return s;
       })

       setSubtasks(updatedSubtasks)
       task.subtasks = updatedSubtasks;
    }

    const editSubtaskDescription = (id: Id, description: string) => {
        const updatedSubtasks = task.subtasks.map(s => {
             if (s.id === id) {
                 return {...s, description: description}
             }
             return s;
        })
 
        setSubtasks(updatedSubtasks)
        task.subtasks = updatedSubtasks;
     }

     const handleSubtaskCompleted = (item: Subtask) => {
        const updatedSubtasks = task.subtasks.map(s => {
            if (s.id === item.id) {
                return {...s, completed: !item.completed}
            }
            return s;
       })

       if (item.completed) {
            task.completedSubtasks--;
       } else {
            task.completedSubtasks++;
       }

       setSubtasks(updatedSubtasks)
       task.subtasks = updatedSubtasks
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
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >

            <Group justify="space-between">
            <TextInput label="Task title"
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
            <Select
                data={priorities.flatMap((p: Priority) => [{
                    value: p.title,
                    label: p.title
                }])}
                value={task.priority?.title}
                onChange={handleTaskPriorityChange}
                placeholder="Select or add option"
                label="Priority"
            />

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

                <div> {/* show each subtask */}

                <Divider my="md" />

                    <h1>Subtasks</h1>

                {
                    subtasks.map((item, index) => (
                        <div key={item.id} style={{marginBottom:'15px'}}>
                        {index !== 0 && <Divider />}
                            {!editSubtaskMode && 
                                <div>
                                    <Group>
                                    <Checkbox 
                                        // {...form.getInputProps('terms', { type: 'checkbox' })}
                                        checked={item.completed} 
                                        onChange={(_) => handleSubtaskCompleted(item)}/>
                                    <div style={{fontSize: 18, textDecoration: item.completed ? "line-through": ""}}>{item.title} - {item.description}</div>
                                    </Group>
                                </div>
                            }
                        </div>
                    ))
                }

                </div>

                <div> {/* subtask */}

                    <TextInput label="Subtask title"
                        placeholder="Subtask Title"
                        value={newSubtaskTitle}
                        onChange={(event) => setNewSubtaskTitle(event.target.value)}
                        rightSectionPointerEvents="all"
                        mt="md"
                        style={{width: '450px'}}
                        rightSection={
                            <CloseButton
                                aria-label="Clear input"
                                onClick={(_) => setNewSubtaskTitle('')}
                                style={{ display: taskTitle ? undefined : 'none' }}
                            />
                    } />

                    {/* <Group justify="space-between"> */}
                    <div style={{display: 'flex', alignItems:  'space-between'}}>
                    <Textarea
                        label="Subtask Description"
                        placeholder="Input subtask description"
                        value={newSubtaskDescription}
                        autosize
                        minRows={2}
                        maxRows={4}
                        style={{width: '80%'}}
                        onChange={(event) => setNewSubtaskDescription(event.target.value)}
                        rightSection={
                            <CloseButton
                                aria-label="Clear input"
                                onClick={(_) => setNewSubtaskDescription('')}
                                style={{ display: taskTitle ? undefined : 'none' }}
                            />
                    }
                    />
                    {/* <div style={{position: 'relative', marginTop: '45px'}}> */}
                        <button className={styles.addSubTaskButton} onClick={addSubtask}>Add Subtask</button>
                    {/* </div> */}
                    </div>
                
                </div>

                
            {/* </Group> */}
            </Modal>


        </div>
    )

    function getTaskFormat() {
        return (
            <Card withBorder padding="sm" radius="md" style={{marginTop: "10px", marginRight: "5px", height: "200px", border: isDragging ? `5px solid ${taskPriority !== null ? taskPriority.color : 'rgba(0, 0, 255, 0.09)'}` : '', background: taskPriority !== null && !isDragging ? taskPriority.color : ''}} onClick={open}>
                <Group justify="space-between" style={{cursor: "grab", padding: '5px', marginBottom: "10px", visibility: isDragging ? 'hidden': 'inherit', border: '1px solid black', borderRadius: '5px'}} {...attributes} {...listeners}>
                    <Text fz={"lg"} fw={500}>{task.title.replace(/(.{27})..+/, "$1…")}</Text>
                    
                    {mouseIsOver && 
                        <ActionIcon variant="filled" color="red" size="md" radius="md" aria-label="Trash-Task">
                            <IconTrash onClick={(_) => deleteTask(task.id)} style={{ width: '70%', height: '70%' }} stroke={1.5} /> 
                        </ActionIcon>
                    }

                    {!mouseIsOver && showDueDateChip &&
                        <Pill size="lg">{daysLeft} day{daysLeft == 1 ? '' : 's'} left</Pill>
                    }
                </Group>

            
            <Text fz="sm" c="dimmed" mt={5} style={{visibility: isDragging ? 'hidden': 'inherit'}}>
                {task.description.replace(/(.{110})..+/, "$1…")}
            </Text>
            
            { showSubtaskProgress && <div> 
                <Text c="dimmed" fz="sm" mt="md" style={{visibility: isDragging ? 'hidden': 'inherit'}}>
                    Subtasks completed:{' '}
                    <Text span fw={500} c="bright">
                        {task.completedSubtasks}/{task.totalSubtasks}
                    </Text>
                </Text>

                <Progress value={(task.completedSubtasks / task.totalSubtasks) * 100} mt={5} style={{visibility: isDragging ? 'hidden': 'inherit'}}/>
            </div>
            }
            </Card>


             
        )
    }
}

export default TaskContainer