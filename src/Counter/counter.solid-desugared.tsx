/** @jsxImportSource solid-js */

import { createSignal } from "solid-js";
import { insert, template } from "solid-js/web";

let tmpl = template("<div><button type=button>+</button><span>");
export let SolidCounterDesugared = () => {
  let [n, setN] = createSignal(0);
  let onClick = () => setN(n() + 1);
  let el = tmpl();
  let btn = el.firstChild!;
  let span = btn.nextSibling!;
  (btn as any).$$click = onClick;
  insert(span, n);
  return el;
};

export default SolidCounterDesugared;
