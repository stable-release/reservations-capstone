import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import SeatForm from "../forms/SeatForm";
import ErrorAlert from "../ErrorAlert";
import {
    assignTableToReservation,
    listAllTables,
    listIDReservation,
} from "../../utils/api";
import { today } from "../../utils/date-time";

export default function Seat() {
    const history = useHistory();

    const { id } = useParams();
    const [reservation, setReservation] = useState({});
    const [tables, setTables] = useState([]);
    const [selection, setSelection] = useState("");

    const [tablesError, setTablesError] = useState(null);
    const [reservationError, setReservationError] = useState(null);
    const [tablesIdError, setTablesIdError] = useState(null);
    const [responseError, setResponseError] = useState(null);

    /**
     * 0 default
     * 1 submit
     * 2 cancel
     */
    const [submitted, setSubmitted] = useState(0);

    /**
     * Event Handlers
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(1);
    };

    const handleCancel = (event) => {
        event.preventDefault();
        setSubmitted(2);
    };

    const handleChange = ({ target }) => {
        const value = target.value;
        setSelection(value);
    };

    /**
     * Form error components
     */
    const errorAlerts = tablesIdError
        ? tablesIdError.map((err) => {
              return <ErrorAlert key={err.key} error={err} />;
          })
        : null;

    /**
     * Update call to API
     */
    useEffect(() => {
        const validateTableId = (table_name, capacity) => {
            const errArr = [];

            if (errArr.length) {
                setTablesIdError(() => [...errArr]);
                return false;
            }

            return true;
        };

        // Submit condition
        if (submitted === 1 && validateTableId(selection)) {
            const data = {
                reservation_id: reservation.reservation_id,
            };
            assignTableToReservation(data, selection)
                .then(() => history.push(`/dashboard?date=${today()}`))
                .catch((error) => setResponseError(error));
        }
        // Cancel condition
        else if (submitted === 2) {
            history.goBack();
        }

        // Clean Up
        return () => setSubmitted(() => 0);
    }, [submitted, history, selection, reservation.reservation_id]);

    /**
     * GET Request for filtering tables with available capacity
     */
    useEffect(() => {
        listAllTables().then(setTables).catch(setTablesError);
    }, []);

    /**
     * GET Request for selected reservation
     */
    useEffect(() => {
        listIDReservation(id).then(setReservation).catch(setReservationError);
    }, [id]);

    return (
        <div>
            {reservationError ? <ErrorAlert error={reservationError} /> : ""}
            {tablesError ? <ErrorAlert error={tablesError} /> : ""}
            {responseError ? <ErrorAlert error={responseError} /> : ""}
            {errorAlerts}
            <div># Of People: {reservation.people}</div>
            <SeatForm
                tables={tables}
                selection={selection}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
            />
        </div>
    );
}
