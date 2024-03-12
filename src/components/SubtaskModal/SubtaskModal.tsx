import React, { useState } from 'react'

import { Id, Subtask } from "../../types";
import { ActionIcon, CloseButton, Group, Modal, TextInput, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil } from '@tabler/icons-react';

interface Props {
    subtask: Subtask,
    editSubtaskTitle: (id: Id, title: string) => void
    editSubtaskDescription: (id: Id, title: string) => void
}

function SubtaskModal(props: Props) {
    const { subtask, editSubtaskTitle, editSubtaskDescription } = props
    const [updatedSubtaskTitle, setUpdatedSubtaskTitle] = useState(subtask.title)
    const [updatedSubtaskDescription, setUpdatedSubtaskDescription] = useState(subtask.description)
    const [modalOpened, { open, close }] = useDisclosure(false);


    const handleTitleUpdate = (title: string) => {
        editSubtaskTitle(subtask.id, title);
        setUpdatedSubtaskTitle(title);
    }

    const handleDescriptionUpdate = (description: string) => {
        editSubtaskDescription(subtask.id, description);
        setUpdatedSubtaskDescription(description);
    }


    return (
        <div>
            <Modal
                // onClick={reloadComponent}
                opened={modalOpened}
                onClose={close}
                title={`Editing ${subtask.title}`}
                size="70%"
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >

                <Group>
                    <TextInput label="Subtask title"
                        placeholder="Subtask Title"
                        value={updatedSubtaskTitle}
                        onChange={(event) => handleTitleUpdate(event.target.value)}
                        rightSectionPointerEvents="all"
                        mt="md"
                        style={{width: '450px'}}
                        rightSection={
                            <CloseButton
                                aria-label="Clear input"
                                onClick={(_) => handleTitleUpdate('')}
                                style={{ display: updatedSubtaskTitle ? undefined : 'none' }}
                            />
                    } />

                    <Textarea
                        label="Subtask Description"
                        placeholder="Input subtask description"
                        value={updatedSubtaskDescription}
                        autosize
                        minRows={2}
                        maxRows={4}
                        style={{width: '80%'}}
                        onChange={(event) => handleDescriptionUpdate(event.target.value)}
                        rightSection={
                            <CloseButton
                                aria-label="Clear input"
                                onClick={(_) => handleDescriptionUpdate('')}
                                style={{ display: subtask ? undefined : 'none' }}
                            />
                    }
                    />


                </Group>
            </Modal>


            <ActionIcon variant="filled" color="blue" size="md" radius="md" aria-label="Edit-Task" style={{marginTop: '5px'}}>
                <IconPencil onClick={open} style={{ width: '70%', height: '70%' }} stroke={1.5} /> 
            </ActionIcon>
        </div>
    )
}

export default SubtaskModal;