import { createElement as e, useState } from "react";

export let ReactCounter = () => {
  let [n, setN] = useState(0);
  let onClick = () => setN(n + 1);
  return (
    <div>
      <button onClick={onClick}>+</button>
      <span>{n}</span>
    </div>
  );
};

export let ReactCounterDesugared = () => {
  let [n, setN] = useState(0);
  let onClick = () => setN(n + 1);
  return e("div", {}, e("button", { onClick }, "+"), e("span", {}, n));
};
