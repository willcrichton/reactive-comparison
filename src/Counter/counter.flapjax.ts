export let FlapjaxCounter = () => {
  let btn = BUTTON({}, "+");
  let countB = clicksE(btn)
    .collectE(0, (_e, n) => n + 1)
    .startsWith(0);
  return DIV({}, btn, SPAN({}, countB));
};

export default FlapjaxCounter;
