import { useState } from "react";

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

export default ReactCounter;
