import { DataGenerator, type Row } from "./utils";

const DATA_GENERATOR = new DataGenerator();

type Msg = "add-rows" | "update-labels" | "swap-rows";

let TableView = (data: Behavior<Row[]>) =>
  TABLE(
    {},
    data.liftB(data =>
      data.map(row => TR({}, TD({}, row.id.toString()), TD({}, row.label)))
    )
  );

let AddPanel = () => {
  let addRowsBtn = BUTTON({}, "Add Rows");
  let updateLabelsBtn = BUTTON({}, "Update Labels");
  let swapRowsBtn = BUTTON({}, "Swap Rows");
  let msgE = mergeE(
    clicksE(addRowsBtn).mapE<Msg>(() => "add-rows"),
    clicksE(updateLabelsBtn).mapE<Msg>(() => "update-labels"),
    clicksE(swapRowsBtn).mapE<Msg>(() => "swap-rows")
  );
  return {
    view: DIV({}, addRowsBtn, updateLabelsBtn, swapRowsBtn),
    msgE
  };
};

export let FlapjaxTable = () => {
  let addPanel = AddPanel();

  let init = DATA_GENERATOR.genMany();
  let data = addPanel.msgE
    .collectE(init, (msg, data) => {
      if (msg === "add-rows") {
        return data.concat(DATA_GENERATOR.genMany());
      } else if (msg === "update-labels") {
        return data.map((row, index) =>
          index % 10 === 0 ? { ...row, label: `${row.label} !!!` } : row
        );
      } else if (msg === "swap-rows") {
        let tmp = data[1];
        data[1] = data[998];
        data[998] = tmp;
        return data;
      } else {
        throw new Error("Unreachable");
      }
    })
    .startsWith(init);

  return DIV({}, addPanel.view, TableView(data));
};

export default FlapjaxTable;
