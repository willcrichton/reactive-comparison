import React from "react";
import ReactDOM from "react-dom/client";
import * as Solid from "solid-js/web";

import { Elm as ElmCounter } from "./Counter/Counter.elm";
import { FlapjaxTodo } from "./Todo/todo.flapjax";
import { Elm as ElmTodo } from "./Todo/Todo.elm";

console.log(ElmCounter.Counter.Counter);

let mountVanilla = (
  container: HTMLDivElement,
  component: () => HTMLElement
) => {
  container.appendChild(component());
};

let mountReact = (
  container: HTMLDivElement,
  component: React.FunctionComponent
) => {
  ReactDOM.createRoot(container).render(React.createElement(component));
};

let mountSolid = (container: HTMLDivElement, component: any) => {
  Solid.render(() => Solid.createComponent(component, {}), container);
};

let mountFlapjax = (container: HTMLDivElement, component: any) => {
  container.appendChild(component());
};

let mountElm = (container: HTMLDivElement, component: any) => {
  component.init({ node: container });
};

let root = document.getElementById("root")!;

let div = document.createElement("div");
root.appendChild(div);

// mountReact(div, ReactCounterDesugared);
// mountSolid(div, SolidCounterDesugared);
// mountFlapjax(div, FlapjaxCounter);
// mountReact(div, ReactTodo);
// mountVanilla(div, VanillaCounter);
// mountSolid(div, SolidTodo);
// mountFlapjax(div, FlapjaxTodo);
// mountVanilla(div, VanillaTodo);
// mountElm(div, ElmCounter.Counter.Counter);
mountElm(div, ElmTodo.Todo.Todo);
