import { Incr, autorun } from "../incr";

export let CounterCustom = () => {
  let div = document.createElement("div");

  let n = new Incr(0);
  let btn = document.createElement("button");
  btn.innerText = "+";
  btn.addEventListener("click", () => n.set(n.get() + 1));

  let text = new Text(n.get().toString());
  autorun(() => {
    text.textContent = n.get().toString();
  });

  div.append(btn, text);

  return div;
};

export default CounterCustom;
