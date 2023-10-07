import { useState, useEffect } from "react";
import {
    deleteTable,
    listAllTables,
    updateReservationStatus,
} from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import TableCard from "./TableCard";

import "./ListTables.css";

export default function ListTables({ deleted, setDeleted }) {
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const [responseError, setResponseError] = useState(null);
    const [load, setLoad] = useState(false);

    /**
     * Handle delete for single table
     */
    const handleDelete = (id) => {
        setDeleted({
            state: 1,
            table_id: id,
            reservation_id: tables.find(
                (table, index, obj) => table.table_id === id
            ).reservation_id,
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
    }, [load]);

    /**
     * DELETE Request for table with table_id
     */
    useEffect(() => {
        if (deleted.state === 1) {
            const data = {
                table_id: deleted.table_id,
            };
            const status = {
                reservation_id: deleted.reservation_id,
                status: "finished",
            };
            deleteTable(data, data.table_id)
                .then(() =>
                    updateReservationStatus(status, status.reservation_id)
                )
                .then(() =>
                    setDeleted({
                        ...deleted,
                        state: 0,
                    })
                )
                .then((prev) => setLoad(!prev))
                .catch((error) => setResponseError(error));
        }
    }, [deleted, setDeleted]);

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
