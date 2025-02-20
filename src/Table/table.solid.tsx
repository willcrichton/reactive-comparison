/** @jsxImportSource solid-js */

import { For } from "solid-js";
import { type SetStoreFunction, createStore } from "solid-js/store";

import { DataGenerator, type Row } from "./utils";

interface Data {
  data: Row[];
}

const DATA_GENERATOR = new DataGenerator();

let TableView = (props: { data: Data }) => (
  <table>
    <For each={props.data.data}>
      {row => (
        <tr>
          <td>{row.id}</td>
          <td>{row.label}</td>
        </tr>
      )}
    </For>
  </table>
);

let ActionPanel = (props: { data: Data; setData: SetStoreFunction<Data> }) => (
  <div>
    <button
      onClick={() =>
        props.setData("data", data => [...data, ...DATA_GENERATOR.genMany()])
      }
    >
      Add Rows
    </button>
    <button
      onClick={() =>
        props.setData("data", { by: 10 }, "label", l => l + " !!!")
      }
    >
      Update Labels
    </button>
    <button
      onClick={() =>
        props.setData("data", data => ({ 1: data[998], 998: data[1] }))
      }
    >
      Swap Rows
    </button>
  </div>
);

export let SolidTable = () => {
  let [data, setData] = createStore<Data>({ data: DATA_GENERATOR.genMany() });
  return (
    <div>
      <ActionPanel data={data} setData={setData} />
      <TableView data={data} />
    </div>
  );
};

export default SolidTable;
