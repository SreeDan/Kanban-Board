export type Id = string | number

export type Column = {
    id: Id,
    title: string
}

export type Priority = {
    id: Id,
    title: string,
    color: string,
    value: string,
    label: string
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
    dueDate: Date | null,
    priority: Priority | null
    // TODO
    // users assigned
    // SPECIFIC priorities -> aside from colors
}

export type ApplicationData = {
    columns: Column[]
    tasks: Task[]
    priorities: Priority[]
}