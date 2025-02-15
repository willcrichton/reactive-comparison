/** @jsxImportSource solid-js */

import { type SetStoreFunction, createStore } from "solid-js/store";
import { For } from "solid-js/web";
import type { Todo, TodoList } from "./types";

let AddPanel = (props: {
  todoList: TodoList;
  setTodoList: SetStoreFunction<TodoList>;
}) => {
  let inputEl!: HTMLInputElement;
  let onClick = () => {
    let contents = inputEl.value;
    props.setTodoList("todos", props.todoList.todos.length, {
      contents,
      completed: false
    });
    inputEl.value = "";
  };
  return (
    <div>
      <button onClick={onClick}>Add</button>
      <input type="text" ref={inputEl} />
    </div>
  );
};

let ItemCount = (props: { todoList: TodoList }) => {
  // This must be behind a thunk so the component reacts correctly
  let count = () => props.todoList.todos.filter(item => item.completed).length;
  return (
    <div>
      Completed: <span>{count()}</span>
    </div>
  );
};

let TodoItem = (props: {
  item: Todo;
  setTodo: (item: Partial<Todo>) => void;
}) => {
  let onClick = () => {
    props.setTodo({ completed: !props.item.completed });
  };
  return (
    <li>
      {props.item.contents}
      <button onClick={onClick}>
        {!props.item.completed ? "Done" : "Undone"}
      </button>
    </li>
  );
};

export let SolidTodo = () => {
  let [todoList, setTodoList] = createStore<TodoList>({ todos: [] });
  return (
    <div>
      <AddPanel todoList={todoList} setTodoList={setTodoList} />
      <ItemCount todoList={todoList} />
      <ul>
        <For each={todoList.todos}>
          {(item, i) => (
            <TodoItem
              item={item}
              setTodo={item => setTodoList("todos", i(), item)}
            />
          )}
        </For>
      </ul>
    </div>
  );
};
