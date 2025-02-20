import { type Incr, IncrArray, array, element } from "../incr";
import type { Todo } from "./types";

let AddPanel = (todos: IncrArray<Todo>) => {
  let div = document.createElement("div");
  let input = document.createElement("input");
  input.type = "text";
  let btn = document.createElement("button");
  btn.textContent = "Add";
  btn.addEventListener("click", () => {
    let contents = input.value;
    todos.push({ contents, completed: false });
    input.value = "";
  });
  div.append(btn, input);
  return div;
};

let TodoItem = (item: Incr<Todo>) => {
  let li = document.createElement("li");
  let text = new Text(item.get().contents);
  let label = item.lift(item => new Text(!item.completed ? "Done" : "Undone"));
  let btn = element("button", array(label));
  btn.addEventListener("click", () => {
    item.set({ ...item.get(), completed: !item.get().completed });
  });
  li.append(text, btn);
  return li;
};

let ItemCount = (todos: IncrArray<Todo>) => {
  let div = document.createElement("div");
  let count = todos
    .filter(el => el.get().completed)
    .lift(els => new Text(els.length.toString()));
  let span = element("span", array(count));
  div.append("Completed: ", span);
  return div;
};

export let TodoCustom = () => {
  let div = document.createElement("div");

  let todos = new IncrArray<Todo>([]);

  let addPanel = AddPanel(todos);
  let count = ItemCount(todos);

  let lis = todos.map(TodoItem);
  let ul = element("ul", lis);

  div.append(addPanel, count, ul);

  return div;
};

export default TodoCustom;
