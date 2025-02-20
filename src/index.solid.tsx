/** @jsxImportSource solid-js */

import { javascript } from "@codemirror/lang-javascript";
import {
  StreamLanguage,
  defaultHighlightStyle,
  syntaxHighlighting
} from "@codemirror/language";
import { elm } from "@codemirror/legacy-modes/mode/elm";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import React from "react";
import ReactDOM from "react-dom/client";
import { createEffect, createSignal } from "solid-js";
import * as Solid from "solid-js/web";

const TODO_MODULES = import.meta.glob("./Todo/*", { eager: true });
const TODO_SRC = import.meta.glob("./Todo/*", { eager: true, query: "?raw" });

const COUNTER_MODULES = import.meta.glob("./Counter/*", { eager: true });
const COUNTER_SRC = import.meta.glob("./Counter/*", {
  eager: true,
  query: "?raw"
});

const TABLE_MODULES = import.meta.glob("./Table/*", { eager: true });
const TABLE_SRC = import.meta.glob("./Table/*", { eager: true, query: "?raw" });

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

const FILE_TYPES = [
  {
    ext: ".vanilla.ts",
    name: "Vanilla"
  },
  {
    ext: ".custom.ts",
    name: "Custom",
  },
  {
    ext: ".react.tsx",
    name: "React"
  },
  {
    ext: ".react-desugared.tsx",
    name: "React (Desugared)"
  },
  {
    ext: ".solid.tsx",
    name: "Solid"
  },
  {
    ext: ".solid-desugared.tsx",
    name: "Solid (Desugared)"
  },
  {
    ext: ".flapjax.ts",
    name: "Flapjax"
  },
  {
    ext: ".elm",
    name: "Elm"
  }
];

let processImpls = (modules: any, srcs: any) => {
  let paths = Object.keys(modules);
  return FILE_TYPES.flatMap(({ ext, name }) => {
    let path = paths.find(p => p.endsWith(ext));
    if (path === undefined) return [];
    let component: any;
    if (ext === ".elm") {
      let moduleName = path.split("/")[1];
      component = modules[path].Elm[moduleName][moduleName];
    } else {
      component = modules[path].default;
    }
    return [{ type: name, component, src: srcs[path].default }];
  });
};

const IMPLS = [
  {
    name: "Counter",
    impls: processImpls(COUNTER_MODULES, COUNTER_SRC)
  },
  {
    name: "Todo",
    impls: processImpls(TODO_MODULES, TODO_SRC)
  },
  {
    name: "Table",
    impls: processImpls(TABLE_MODULES, TABLE_SRC)
  }
];

let Impl = (impl: any) => {
  let liveDiv!: HTMLDivElement;
  let codeDiv!: HTMLDivElement;

  createEffect(() => {
    if (impl.type === "Vanilla" || impl.type === "Custom") {
      mountVanilla(liveDiv, impl.component);
    } else if (impl.type === "React" || impl.type === "React (Desugared)") {
      mountReact(liveDiv, impl.component);
    } else if (impl.type === "Solid" || impl.type === "Solid (Desugared)") {
      mountSolid(liveDiv, impl.component);
    } else if (impl.type === "Flapjax") {
      mountFlapjax(liveDiv, impl.component);
    } else if (impl.type === "Elm") {
      mountElm(liveDiv, impl.component);
    }
  });

  createEffect(() => {
    let lang =
      impl.type === "Elm"
        ? StreamLanguage.define(elm)
        : javascript({ typescript: true, jsx: true });
    let view = new EditorView({
      doc: impl.src,
      parent: codeDiv,
      extensions: [
        syntaxHighlighting(defaultHighlightStyle),
        lang,
        EditorState.readOnly.of(true),
        EditorView.lineWrapping
      ]
    });
    return () => view.destroy();
  });

  return (
    <div class="impl">
      <h2>{impl.type}</h2>
      <div class="code" ref={codeDiv} />
      <div class="live" ref={liveDiv} />
    </div>
  );
};

let Impls = (props: { selected: number }) => {
  let impls = () => IMPLS[props.selected];
  return (
    <div class="impls">
      <h1>{impls().name}</h1>
      <div class="impls-grid">
        {impls().impls.map(impl => (
          <Impl {...impl} />
        ))}
      </div>
    </div>
  );
};

let App = () => {
  let [selected, setSelected] = createSignal(0);
  return (
    <div>
      <select onChange={e => setSelected(Number.parseInt(e.target.value))}>
        {IMPLS.map(({ name }, i) => (
          <option value={i}>{name}</option>
        ))}
      </select>
      <Impls selected={selected()} />
    </div>
  );
};

let root = document.getElementById("root")! as HTMLDivElement;
mountSolid(root, App);

// mountReact(div, ReactCounterDesugared);
// mountSolid(div, SolidCounterDesugared);
// mountFlapjax(div, FlapjaxCounter);
// mountReact(div, ReactTodo);
// mountVanilla(div, VanillaCounter);
// mountSolid(div, SolidTodoDesugared);
// mountFlapjax(div, FlapjaxTodo);
// mountVanilla(div, VanillaTodo);
// mountElm(div, ElmCounter.Counter.Counter);
// mountElm(div, ElmTodo.Todo.Todo);
