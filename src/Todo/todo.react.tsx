import { observer, useLocalObservable } from "mobx-react";
import { useRef } from "react";
import type { Todo, TodoList } from "./types";

let AddPanel = (props: { todoList: TodoList }) => {
  let ref = useRef<HTMLInputElement>(null);
  let onClick = () => {
    let contents = ref.current!.value;
    props.todoList.todos.push({
      contents,
      completed: false
    });
    ref.current!.value = "";
  };
  return (
    <div>
      <button onClick={onClick}>Add</button>
      <input type="text" ref={ref} />
    </div>
  );
};

let ItemCount = observer((props: { todoList: TodoList }) => {
  let count = props.todoList.todos.filter(item => item.completed).length;
  return (
    <div>
      Completed: <span>{count}</span>
    </div>
  );
});

let TodoItem = observer((props: { item: Todo }) => {
  let onClick = () => {
    props.item.completed = !props.item.completed;
  };
  return (
    <li>
      {props.item.contents}
      <button onClick={onClick}>
        {!props.item.completed ? "Done" : "Undone"}
      </button>
    </li>
  );
});

export let ReactTodo = observer(() => {
  let todoList = useLocalObservable<TodoList>(() => ({ todos: [] }));
  return (
    <div>
      <AddPanel todoList={todoList} />
      <ItemCount todoList={todoList} />
      <ul>
        {todoList.todos.map((item, i) => (
          <TodoItem key={i} item={item} />
        ))}
      </ul>
    </div>
  );
});
