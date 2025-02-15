import type { Todo, TodoList } from "./types";

function unreachable(): never {
  throw Error("Unreachable");
}

interface AddTodoMsg {
  type: "addTodo";
  contents: string;
}

let AddPanel = () => {
  let addBtn = BUTTON({}, "Add");
  // TODO: how to clear input on clicking the button?
  let addInput = INPUT({ type: "input" });
  let addInputB = extractValueB<string>(addInput);
  let addE = clicksE(addBtn)
    .snapshotE(addInputB)
    .mapE<AddTodoMsg>(contents => ({ type: "addTodo", contents }));
  let elt = DIV(addBtn, addInput);
  return { addE, elt };
};

let ItemCount = (todoListB: Behavior<TodoList>) => {
  let countB = todoListB.liftB(
    todoList => todoList.todos.filter(item => item.completed).length
  );
  return DIV({}, "Completed: ", SPAN({}, countB));
};

let TodoItem = (todo: Todo) => {
  let completeBtn = BUTTON({}, todo.completed ? "Undone" : "Done");
  let completeB = clicksE(completeBtn)
    .collectE(todo.completed, (_, b) => !b)
    .startsWith(todo.completed);
  let elt = LI(SPAN({}, todo.contents), completeBtn);
  return { completeB, elt };
};

interface SetCompletedMsg {
  type: "setCompleted";
  i: number;
  completed: boolean;
}

type Msg = AddTodoMsg | SetCompletedMsg;

let updateModel = (msg: Msg, todoList: TodoList): TodoList =>
  msg.type === "addTodo"
    ? {
        todos: [...todoList.todos, { contents: msg.contents, completed: false }]
      }
    : msg.type === "setCompleted"
      ? {
          todos: todoList.todos.map((todo, i) =>
            i === msg.i ? { ...todo, completed: msg.completed } : todo
          )
        }
      : unreachable();

export let FlapjaxTodo = () => {
  let addPanel = AddPanel();
  let completeE: EventStream<SetCompletedMsg> = receiverE();
  let todosB = mergeE(addPanel.addE, completeE)
    .collectE<TodoList>({ todos: [] }, updateModel)
    .startsWith({ todos: [] });
  let todoItemsB = todosB.liftB(todoList =>
    todoList.todos.map((todo, i) => {
      let item = TodoItem(todo);
      item.completeB
        .changes()
        .mapE(completed =>
          sendEvent(completeE, { type: "setCompleted", i, completed })
        );
      return item.elt;
    })
  );
  return DIV(addPanel.elt, ItemCount(todosB), UL(todoItemsB));
};
