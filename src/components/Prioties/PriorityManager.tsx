import { useDisclosure } from '@mantine/hooks';
import styles from './PriorityManager.module.css'
import { ActionIcon, ColorInput, Divider, Group, Modal, TextInput } from '@mantine/core';
import { Id, Priority } from '../../types';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

interface Props {
    priorities: Priority[];
    deletePriority: (id: Id) => void;
    editPriorityTitle: (id: Id, title: string) => void
    editPriorityColor: (id: Id, color: string) => void
    addPriority: (title: string, color: string) => void
}

function PriorityManager(props: Props) {

    const [modalOpened, { open, close }] = useDisclosure(false);
    const [newPriorityTitle, setNewPriorityTitle] = useState<string>('');
    const [newPriorityColor, setNewPriorityColor] = useState<string>('');

    function addPriority(title: string, color: string) {
        props.addPriority(title, color)
        setNewPriorityTitle('');
        setNewPriorityColor('');
    }


    return (
        <div>
            <button className={styles.managePrioritiesButton} onClick={open}>Manage Priorities</button>
            
            <Modal
                opened={modalOpened}
                onClose={close}
                title={`Priorities Configuration`}
                centered
                size="40%"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >

            <div style={{minHeight: '500px'}}>
            {props.priorities?.map((item, index) => (
                <div key={item.id} style={{marginBottom:'15px'}}>
                    {index !== 0 && <Divider />}
                    <Group justify="space-between">
                        <TextInput
                            label="Priority Name"
                            placeholder="Input priority name"
                            value={item.title}
                            onChange={(event) => props.editPriorityTitle(item.id, event.target.value)}
                        />
                        <ColorInput
                            label="Priority Color"
                            value={item.color}
                            placeholder="Input priority color"
                            onChange={(event) => props.editPriorityColor(item.id, event)}
                        />
                        <ActionIcon variant="filled" color="red" size="md" radius="md" aria-label="Trash-Task" style={{marginTop: '19px'}}>
                            <IconTrash onClick={(_) => props.deletePriority(item.id)} style={{width: '70%', height: '70%' }} stroke={1.5} /> 
                        </ActionIcon>
                    </Group>
                </div>
            ))}

            <Group justify="space-between">
                <TextInput
                    label="Priority Name"
                    placeholder="Input priority name"
                    value={newPriorityTitle}
                    onChange={(event) => setNewPriorityTitle(event.target.value)}
                />
                <ColorInput
                    label="Priority Color"
                    placeholder="Input priority color"
                    value={newPriorityColor}
                    onChange={(event) => setNewPriorityColor(event)}
                />
                <div style={{position: 'relative', marginTop: '45px'}}>
                    <button className={styles.addPriorityButton} onClick={(_) => addPriority(newPriorityTitle, newPriorityColor)}>Add Priority</button>
                </div>
            </Group>
            
            

            </div>
            </Modal>
        </div>
    )
}


export default PriorityManager