/** @jsxImportSource solid-js */

import { createSignal } from "solid-js";

export let SolidCounter = () => {
  let [n, setN] = createSignal(0);
  let onClick = () => setN(n() + 1);
  return (
    <div>
      <button type="button" onClick={onClick}>
        +
      </button>
      <span>{n()}</span>
    </div>
  );
};

export default SolidCounter;
