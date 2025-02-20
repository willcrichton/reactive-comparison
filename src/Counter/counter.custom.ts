import { Incr, element, incrArray } from "../incr";

/*
(defn Counter ()
  (def n 0)
  (defn on-click () (set! n (+ n 1)))
  (div
    (button [on-click] "+")
    n))
*/

export let CounterCustom = () => {
  let div = document.createElement("div");

  let n = new Incr(0);
  let btn = document.createElement("button");
  btn.innerText = "+";
  btn.addEventListener("click", () => n.set(n.get() + 1));

  let span = element("span", incrArray(n.lift(n => new Text(n.toString()))));

  div.append(btn, span);

  return div;
};

export default CounterCustom;
