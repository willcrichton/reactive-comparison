import { type IncrArray, array, element, incrArray } from "../incr";
import { DataGenerator, type Row } from "./utils";

const DATA_GENERATOR = new DataGenerator();

let TableView = (data: IncrArray<Row>) => {
  let rows = data.map(row =>
    element(
      "tr",
      array(
        element("td", incrArray(row.lift(row => new Text(row.id.toString())))),
        element("td", incrArray(row.lift(row => new Text(row.label))))
      )
    )
  );
  return element("table", rows);
};

let ActionPanel = (data: IncrArray<Row>) => {
  let div = document.createElement("div");

  let addRowsBtn = document.createElement("button");
  addRowsBtn.innerText = "Add Rows";
  addRowsBtn.addEventListener("click", () => {
    DATA_GENERATOR.genMany().forEach(row => data.push(row));
  });

  let updateLabelsBtn = document.createElement("button");
  updateLabelsBtn.innerText = "Update Labels";
  updateLabelsBtn.addEventListener("click", () => {
    // hmmm... this has to be an *untracked* iteration
    data.t.forEach((rowIncr, i) => {
      if (i % 10 === 0) {
        let row = rowIncr.get();
        rowIncr.set({ ...row, label: `${row.label} !!!` });
      }
    });
  });

  let swapRowsBtn = document.createElement("button");
  swapRowsBtn.innerText = "Swap Rows";
  swapRowsBtn.addEventListener("click", () => {
    data.swap(1, 998);
  });

  div.append(addRowsBtn, updateLabelsBtn, swapRowsBtn);
  return div;
};

export let CustomTable = () => {
  let data = array(...DATA_GENERATOR.genMany());
  let div = document.createElement("div");
  div.append(ActionPanel(data), TableView(data));
  return div;
};

export default CustomTable;
