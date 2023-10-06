import { useState, useEffect } from "react";
import { listAllTables } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import TableCard from "./TableCard";

import "./ListTables.css";

export default function ListTables() {
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);

    const list =
        tables && tables.length
            ? tables.map((singleTable, index, array) => {
                  return (
                      <TableCard
                          key={singleTable.table_id}
                          id={singleTable.table_id}
                          name={singleTable.table_name}
                          capacity={singleTable.capacity}
                          reservation_id={singleTable.reservation_id}
                      />
                  );
              })
            : null;

    /**
     * GET Request for current date reservations
     */
    useEffect(() => {
        listAllTables().then(setTables).catch(setTablesError);
    }, []);

    return (
        <div className="tables">
            <table style={{ width: "100%" }}>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Capacity</th>
                        <th>Reservation</th>
                    </tr>
                    {list}
                </tbody>
            </table>
            <ErrorAlert error={tablesError} />
        </div>
    );
}
