export default interface TodoListInterface {
  createdAt: Date;
  createdBy: number;
  description?: string;
  familyId: number;
  id: number;
  title: string;
}

export interface TaskInterface {
  id: number;
  todoListId: number;
  createdBy: number;
  assignedTo?: number;
  createdAt: Date;
  title: string;
  details?: string;
  dueBy?: Date;
  done: boolean;
}
