import { useState, useEffect } from "react";
import { deleteTable, listAllTables } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import TableCard from "./TableCard";

import "./ListTables.css";

export default function ListTables() {
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const [responseError, setResponseError] = useState(null);

    /**
     * 0 default
     * 1 delete
     */
    const [deleted, setDeleted] = useState({
        state: 0,
        table_id: Number(""),
    });

    /**
     * Handle delete for single table
     */
    const handleDelete = (id) => {
        setDeleted({
            state: 1,
            table_id: id,
        });
    };

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
                          handleDelete={handleDelete}
                      />
                  );
              })
            : null;

    /**
     * GET Request for current tables
     */
    useEffect(() => {
        listAllTables().then(setTables).catch(setTablesError);
    }, [deleted.state]);

    /**
     * DELETE Request for table with table_id
     */
    useEffect(() => {
        if (deleted.state === 1) {
            const data = {
                table_id: deleted.table_id,
            };
            deleteTable(data, data.table_id)
                .then(() =>
                    setDeleted({
                        ...deleted,
                        state: 0,
                    })
                )
                .catch((error) => setResponseError(error));
        }
    }, [deleted]);

    return (
        <div className="tables">
            <table style={{ width: "100%" }}>
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Capacity</th>
                        <th>Reservation</th>
                    </tr>
                    {list}
                </tbody>
            </table>
            <ErrorAlert error={tablesError} />
            {responseError ? <ErrorAlert error={responseError} /> : ""}
        </div>
    );
}
