export type Id = string | number

export type Column = {
    id: Id,
    title: string
}

export type Task = {
    id: Id,
    columndId: Id,
    title: string,
    description: string,
    subtask: {
        id: Id,
        title: string,
        description: string
    }[],
    totalSubtasks: number,
    completedSubtasks: number,
    dueDate: Date | null
    // TODO
    // users assigned
    // SPECIFIC priorities -> aside from colors
    // label days left
}
