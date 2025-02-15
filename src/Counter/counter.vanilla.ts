export let VanillaCounter = () => {
  let n = 0;
  let div = document.createElement("div");
  let btn = document.createElement("button");
  btn.innerText = "+";
  let span = document.createElement("span");
  span.innerText = n.toString();
  btn.addEventListener("click", () => {
    n += 1;
    span.innerText = n.toString();
  });
  div.append(btn, span);
  return div;
};

export default VanillaCounter;
