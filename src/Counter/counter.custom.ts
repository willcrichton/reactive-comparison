import { Incr, array, element } from "../incr";

export let CounterCustom = () => {
  let div = document.createElement("div");

  let n = new Incr(0);
  let btn = document.createElement("button");
  btn.innerText = "+";
  btn.addEventListener("click", () => n.set(n.get() + 1));

  let span = element("span", array(n.lift(n => new Text(n.toString()))));

  div.append(btn, span);

  return div;
};

export default CounterCustom;
