/** @jsxImportSource solid-js */

import { type Accessor, For } from "solid-js";
import { type SetStoreFunction, createStore } from "solid-js/store";
import { createComponent, insert, template } from "solid-js/web";

import type { Todo, TodoList } from "./types";

let addPanelTmpl = template("<div><button>Add</button><input type=text>");
let itemCountTmpl = template("<div>Completed: <span>");
let todoItemTmpl = template("<li><button>");
let todoListTmpl = template("<div><ul>");

let AddPanelDesugared = (props: {
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
  let div = addPanelTmpl();
  let btn = div.firstChild!;
  let input = btn.nextSibling!;
  (btn as any).$$click = onClick;
  inputEl = input as any;
  return div;
};

let ItemCountDesugared = (props: { todoList: TodoList }) => {
  // This must be behind a thunk so the component reacts correctly
  let count = () => props.todoList.todos.filter(item => item.completed).length;
  let div = itemCountTmpl();
  let span = div.firstChild!.nextSibling!;
  insert(span, count);
  return div;
};

let TodoItemDesugared = (props: {
  item: Todo;
  setTodo: (item: Partial<Todo>) => void;
}) => {
  let onClick = () => {
    props.setTodo({
      completed: !props.item.completed
    });
  };
  let li = todoItemTmpl();
  let btn = li.firstChild!;
  insert(li, () => props.item.contents, btn);
  (btn as any).$$click = onClick;
  insert(btn, () => (!props.item.completed ? "Done" : "Undone"));
  return li;
};

export let SolidTodoDesugared = () => {
  let [todoList, setTodoList] = createStore<TodoList>({
    todos: []
  });
  let div = todoListTmpl();
  let ul = div.firstChild!;
  insert(
    div,
    createComponent(AddPanelDesugared, { todoList, setTodoList }),
    ul
  );
  insert(div, createComponent(ItemCountDesugared, { todoList }), ul);
  insert(
    ul,
    createComponent(For, {
      get each() {
        return todoList.todos;
      },
      children: (item: Todo, i: Accessor<number>) =>
        createComponent(TodoItemDesugared, {
          item: item,
          setTodo: (item: Partial<Todo>) => setTodoList("todos", i(), item)
        })
    })
  );
  return div;
};

export default SolidTodoDesugared;
