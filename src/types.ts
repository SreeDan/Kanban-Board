export type Id = string | number

export type Column = {
    id: Id,
    title: string
}

export type Priority = {
    id: Id,
    title: string,
    color: string,
}

export type Task = {
    id: Id,
    columndId: Id,
    title: string,
    description: string,
    subtasks: Subtask[],
    totalSubtasks: number,
    completedSubtasks: number,
    dueDate: Date | null,
    priority: Priority | null
    // TODO
    // users assigned
    // SPECIFIC priorities -> aside from colors
}

export type Subtask = {
    id: Id,
    title: string,
    description: string,
    completed: boolean
}

export type ApplicationData = {
    columns: Column[]
    tasks: Task[]
    priorities: Priority[]
}