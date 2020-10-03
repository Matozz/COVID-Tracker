import React from "react";
import { prettyPrintNum } from "../../util/util";

import "./Table.css";

function Table({ countries }) {
  return (
    <div className="table">
      {countries.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>
          <td>
            <strong>{prettyPrintNum(cases)}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
