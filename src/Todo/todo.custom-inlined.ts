import {
  type ArrayWrite,
  Incr,
  IncrArray,
  IncrArrayMap,
  IncrElement,
  array,
  element
} from "../incr";
import type { Todo } from "./types";

let AddPanel = (
  todos: IncrArray<Todo>,
  ctx: {
    lisOp: IncrArrayMap<Todo, HTMLLIElement>;
    lis: IncrArray<HTMLLIElement>;
    ulOp: IncrElement;
    ul: HTMLElement;
  }
) => {
  let div = document.createElement("div");
  let input = document.createElement("input");
  input.type = "text";
  let btn = document.createElement("button");
  btn.textContent = "Add";
  btn.addEventListener("click", () => {
    let contents = input.value;

    // 1. Initial call
    {
      todos.push({ contents, completed: false });
    }

    // 2. Inline push
    {
      let t = { contents, completed: false };
      todos.insert(todos.t.length, t);
    }

    // 3. Inline insert
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      todos.rawInsert(index, new Incr(t));
    }

    // 4. Inline rawInsert
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      let t2 = new Incr(t);
      todos.t.splice(index, 1, t2);
      // todos.subscribeElement(...) ignore for now
      todos.signal.write.emit({ type: "insert", index });
    }

    // 5. Trigger all subscribers of todos.signal.write
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      let t2 = new Incr(t);
      todos.t.splice(index, 1, t2);

      let eff: ArrayWrite = { type: "insert", index };
      ctx.lisOp.update(eff);
    }

    // 6. Inline IncrArrayMap.update
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      let t2 = new Incr(t);
      todos.t.splice(index, 1, t2);

      let eff: ArrayWrite = { type: "insert", index };
      /* if (eff.type === "setIndex") {
        let inpEl = this.inp.get()[eff.index];
        let outEl = this.f(inpEl);
        this.out.setIndex(eff.index, outEl);
      } else */
      if (eff.type === "insert") {
        let inpEl = ctx.lisOp.inp.get()[eff.index];
        let outEl = ctx.lisOp.f(inpEl);
        ctx.lisOp.out.insert(eff.index, outEl);
      } /* else if (eff.type === "remove") {
        this.out.remove(eff.index);
      } else if (eff.type === "set") {
        this.out.set(this.inp.get().map(el => new Incr(this.f(el))));
      }*/
    }

    // 7. Propagate eff.type
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      let t2 = new Incr(t);
      todos.t.splice(index, 1, t2);

      let eff: ArrayWrite = { type: "insert", index };
      let inpEl = ctx.lisOp.inp.get()[eff.index];
      let outEl = ctx.lisOp.f(inpEl);
      ctx.lisOp.out.insert(eff.index, outEl);
    }

    // 8. Propagate eff.index
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      let t2 = new Incr(t);
      todos.t.splice(index, 1, t2);

      let inpEl = ctx.lisOp.inp.get()[index];
      let outEl = ctx.lisOp.f(inpEl);
      ctx.lisOp.out.insert(index, outEl);
    }

    // 9. Substitute IncrArrayMap (inp, f, out)
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      let t2 = new Incr(t);
      todos.t.splice(index, 1, t2);

      let inpEl = todos.get()[index];
      let outEl = TodoItem(inpEl);
      ctx.lis.insert(index, outEl);
    }

    // 10. Inline IncrArray.insert
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      let t2 = new Incr(t);
      todos.t.splice(index, 1, t2);

      let inpEl = todos.get()[index];
      let outEl = TodoItem(inpEl);
      {
        let index2 = index;
        let t3 = outEl;
        ctx.lis.rawInsert(index2, new Incr(t3));
      }
    }

    // 11. Inline IncrArray.rawInsert
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      let t2 = new Incr(t);
      todos.t.splice(index, 1, t2);

      let inpEl = todos.get()[index];
      let outEl = TodoItem(inpEl);
      {
        let index2 = index;
        let t3 = outEl;
        let t4 = new Incr(t3);
        ctx.lis.t.splice(index2, 1, t4);
        // ignore subscribeElement
        ctx.lis.signal.write.emit({ type: "insert", index: index2 });
      }
    }

    // 12. Trigger all subscribers of todos.signal.write
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      let t2 = new Incr(t);
      todos.t.splice(index, 1, t2);

      let inpEl = todos.get()[index];
      let outEl = TodoItem(inpEl);
      {
        let index2 = index;
        let t3 = outEl;
        let t4 = new Incr(t3);
        ctx.lis.t.splice(index2, 1, t4);

        let eff2: ArrayWrite = { type: "insert", index: index2 };
        ctx.ulOp.update(eff2);
      }
    }

    // 13-15. Inline IncrElement.update, eliminate non-"insert" branches, inline eff2
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      let t2 = new Incr(t);
      todos.t.splice(index, 1, t2);

      let inpEl = todos.get()[index];
      let outEl = TodoItem(inpEl);
      {
        let index2 = index;
        let t3 = outEl;
        let t4 = new Incr(t3);
        ctx.lis.t.splice(index2, 1, t4);

        let oldChild =
          index2 === ctx.ulOp.children.get().length
            ? null
            : ctx.ulOp.el.childNodes[index2];
        let newChild = ctx.ulOp.children.get()[index2];
        ctx.ulOp.el.insertBefore(newChild.get(), oldChild);
      }
    }

    // 16. Substitute IncrElement (children, el)
    {
      let t = { contents, completed: false };
      let index = todos.t.length;
      let t2 = new Incr(t);
      todos.t.splice(index, 1, t2);

      let inpEl = todos.get()[index];
      let outEl = TodoItem(inpEl);
      {
        let index2 = index;
        let t3 = outEl;
        let t4 = new Incr(t3);
        ctx.lis.t.splice(index2, 1, t4);

        let oldChild =
          index2 === ctx.lis.get().length ? null : ctx.ul.childNodes[index2];
        let newChild = ctx.lis.get()[index2];
        ctx.ul.insertBefore(newChild.get(), oldChild);
      }
    }

    // 17. Copy propagate, and for clarity: rename variables, eliminate nested scope
    {
      let todo = new Incr({ contents, completed: false });
      todos.t.splice(todos.t.length, 1, todo);

      let inpEl = todos.get()[todos.t.length];
      let outEl = TodoItem(inpEl);

      let li = new Incr(outEl);
      ctx.lis.t.splice(todos.t.length, 1, li);

      let oldChild =
        todos.t.length === ctx.lis.get().length
          ? null
          : ctx.ul.childNodes[todos.t.length];
      let newChild = ctx.lis.get()[todos.t.length];
      ctx.ul.insertBefore(newChild.get(), oldChild);
    }

    // 18. Reason that todos.t[todos.t.length] == todo (from definition of `splice`)
    {
      let todo = new Incr({ contents, completed: false });
      todos.t.splice(todos.t.length, 1, todo);

      let outEl = TodoItem(todo);

      let li = new Incr(outEl);
      ctx.lis.t.splice(todos.t.length, 1, li);

      let oldChild =
        todos.t.length === ctx.lis.get().length
          ? null
          : ctx.ul.childNodes[todos.t.length];
      let newChild = ctx.lis.get()[todos.t.length];
      ctx.ul.insertBefore(newChild.get(), oldChild);
    }

    // 19. Reason that ctx.lis.t.length == todos.t.length (axiom of map, maybe?)
    //     and also that ctx.lis.t[todos.t.length] = li
    {
      let todo = new Incr({ contents, completed: false });
      todos.t.splice(todos.t.length, 1, todo);

      let outEl = TodoItem(todo);

      let li = new Incr(outEl);
      ctx.lis.t.splice(todos.t.length, 1, li);

      ctx.ul.insertBefore(li.get(), null);
    }

    // 20. Observe that ctx.lis.t is no longer used anywhere
    {
      let todo = new Incr({ contents, completed: false });
      todos.t.splice(todos.t.length, 1, todo);

      let outEl = TodoItem(todo);

      let li = new Incr(outEl);
      ctx.ul.insertBefore(li.get(), null);
    }

    // 21. Observe that `li` is immediately unwrapped
    {
      {
        let todo = new Incr({ contents, completed: false });
        todos.t.splice(todos.t.length, 1, todo);

        let outEl = TodoItem(todo);
        ctx.ul.insertBefore(outEl, null);
      }
    }

    // 22. Speculative: change `todos.t` from `Incr<Todo>` to `Todo` if all subscribers are inlined

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

  let count = ItemCount(todos);

  let lisOp = new IncrArrayMap(todos, TodoItem);
  let lis = lisOp.out;
  let ulOp = new IncrElement("ul", lis);
  let ul = ulOp.el;

  let addPanel = AddPanel(todos, { lisOp, lis, ulOp, ul });

  div.append(addPanel, count, ul);

  return div;
};

export default TodoCustom;
