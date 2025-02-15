export interface Todo {
  contents: string;
  completed: boolean;
}

export interface TodoList {
  todos: Todo[];
}
