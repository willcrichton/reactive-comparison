import { DataGenerator, type Row } from "./utils";

const DATA_GENERATOR = new DataGenerator();

let renderRow = (row: Row) => {
  let tr = document.createElement("tr");
  let tdId = document.createElement("td");
  let tdLabel = document.createElement("td");
  tdId.innerText = row.id.toString();
  tdLabel.innerText = row.label;
  tr.append(tdId, tdLabel);
  return tr;
};

let TableView = () => {
  let table = document.createElement("table");
  let data = DATA_GENERATOR.genMany();
  table.append(...data.map(renderRow));
  return table;
};

let ActionPanel = (tableView: HTMLDivElement) => {
  let div = document.createElement("div");

  let addRowsBtn = document.createElement("button");
  addRowsBtn.innerText = "Add Rows";
  addRowsBtn.addEventListener("click", () => {
    let data = DATA_GENERATOR.genMany();
    tableView.append(...data.map(renderRow));
  });

  let updateLabelsBtn = document.createElement("button");
  updateLabelsBtn.innerText = "Update Labels";
  updateLabelsBtn.addEventListener("click", () => {
    for (let i = 0; i < tableView.children.length; i += 10) {
      tableView.children[i].firstChild!.nextSibling!.textContent += " !!!";
    }
  });

  let swapRowsBtn = document.createElement("button");
  swapRowsBtn.innerText = "Swap Rows";
  swapRowsBtn.addEventListener("click", () => {
    let r1 = tableView.children[1];
    let r2 = tableView.children[2];
    let r998 = tableView.children[998];
    tableView.insertBefore(r1, r998);
    tableView.insertBefore(r998, r2);
  });

  div.append(addRowsBtn, updateLabelsBtn, swapRowsBtn);

  return div;
};

export let VanillaTable = () => {
  let div = document.createElement("div");
  let tableView = TableView();
  let actionPanel = ActionPanel(tableView);
  div.append(actionPanel, tableView);
  return div;
};

export default VanillaTable;
