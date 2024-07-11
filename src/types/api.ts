export type APIError = {
  ErrorCode: number;
  ErrorMessageJP: string;
  ErrorMessageEN: string;
};

export type SignInResponse = {
  token: string;
};

export type Task = {
  id: string;
  title: string;
  detail: string;
  limit: string;
  done: boolean;
};

export type TaskList = {
  listId: string;
  name: string;
  tasks: Task[];
};

export type TaskResponse = Omit<Task, "id"> & {
  taskId: string;
  listId: string;
};

export type List = {
  id: string;
  title: string;
};
