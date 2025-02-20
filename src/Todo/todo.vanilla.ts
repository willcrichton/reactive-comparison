import type { Todo, TodoList } from "./types";

let TodoItem = (item: Todo, todoList: TodoList, countEl: HTMLSpanElement) => {
  let li = document.createElement("li");
  let text = new Text(item.contents);
  let btn = document.createElement("button");
  btn.textContent = !item.completed ? "Done" : "Undone";
  btn.addEventListener("click", () => {
    item.completed = !item.completed;
    btn.textContent = !item.completed ? "Done" : "Undone";
    countEl.innerText = todoList.todos
      .filter(item => item.completed)
      .length.toString();
  });
  li.append(text, btn);
  return li;
};

let ItemCount = () => {
  let div = document.createElement("div");
  let span = document.createElement("span");
  div.append("Completed: ", span);
  span.innerText = "0";
  return [div, span];
};

let AddPanel = (
  todoList: TodoList,
  list: HTMLUListElement,
  countEl: HTMLSpanElement
) => {
  let div = document.createElement("div");
  let input = document.createElement("input");
  let btn = document.createElement("button");
  btn.innerText = "Add";
  btn.addEventListener("click", () => {
    let item = { contents: input.value, completed: false };
    todoList.todos.push(item);
    list.appendChild(TodoItem(item, todoList, countEl));
    input.value = "";
  });
  div.append(btn, input);
  return div;
};

export let VanillaTodo = () => {
  let todoList = { todos: [] };
  let div = document.createElement("div");
  let list = document.createElement("ul");
  let [countContainer, countEl] = ItemCount();
  let addPanel = AddPanel(todoList, list, countEl);
  div.append(addPanel, countContainer, list);
  return div;
};

export default VanillaTodo;
