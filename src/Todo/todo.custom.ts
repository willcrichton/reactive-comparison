import { type Incr, IncrArray, element, incrArray } from "../incr";
import type { Todo } from "./types";

/*
(defn AddPanel (todos : Todo[])
  (def input-ref)
  (defn on-click ()
    (def contents input-ref.value)
    (push! todos {contents, completed: false})
    (set! input-ref.value ""))
  (div
    (input [type "text"] [ref input-ref])
    (button [on-click] "Add")))
*/

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

/*
(defn TodoItem (item : Todo)
  (defn on-click ()
    (set! item.completed (! item.completed)))
  (li
    item.contents
    (button [on-click]
      (if (! item.completed) "Done" "Undone"))))
*/

let TodoItem = (item: Incr<Todo>) => {
  let li = document.createElement("li");
  let text = new Text(item.get().contents);
  let label = item.lift(item => new Text(!item.completed ? "Done" : "Undone"));
  let btn = element("button", incrArray(label));
  btn.addEventListener("click", () => {
    item.set({ ...item.get(), completed: !item.get().completed });
  });
  li.append(text, btn);
  return li;
};

/*
(defn ItemCount (todos : Todo[])
  (def count 
    (len (filter todos (lambda (todo) todo.completed))))
  (div "Completed " (span count)))
*/

let ItemCount = (todos: IncrArray<Todo>) => {
  let div = document.createElement("div");
  let count = todos
    .filter(el => el.get().completed)
    .lift(els => new Text(els.length.toString()));
  let span = element("span", incrArray(count));
  div.append("Completed: ", span);
  return div;
};

/*
(defn Todo ()
  (def todos [])
  (div
    (AddPanel [todos])
    (ItemCount [todos])
    (map todos TodoItem)))
*/

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
