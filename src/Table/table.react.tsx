import { action } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import { DataGenerator, type Row } from "./utils";

const DATA_GENERATOR = new DataGenerator();

let TableView = observer((props: { data: Row[] }) => (
  <table>
    {props.data.map(row => (
      <tr key={row.id}>
        <td>{row.id}</td>
        <td>{row.label}</td>
      </tr>
    ))}
  </table>
));

let ActionPanel = (props: { data: Row[] }) => {
  return (
    <div>
      <button
        onClick={action(() => props.data.push(...DATA_GENERATOR.genMany()))}
      >
        Add Rows
      </button>
      <button
        onClick={action(() => {
          for (let i = 0; i < props.data.length; i += 10) {
            props.data[i].label += " !!!";
          }
        })}
      >
        Update Labels
      </button>
      <button
        onClick={action(() => {
          let tmp = props.data[1];
          props.data[1] = props.data[998];
          props.data[998] = tmp;
        })}
      >
        Swap Rows
      </button>
    </div>
  );
};

export let ReactTable = () => {
  let data = useLocalObservable(() => DATA_GENERATOR.genMany());
  return (
    <div>
      <ActionPanel data={data} />
      <TableView data={data} />
    </div>
  );
};

export default ReactTable;
