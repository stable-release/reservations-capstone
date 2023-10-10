import { useEffect, useState } from "react";
import { updateReservationStatus } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

const { addZero } = require("../../utils/addZero");

export default function ReservationCard({
    id,
    first,
    last,
    time,
    date,
    people,
    contact,
    status,
    setRefresh,
}) {
    const [cancel, setCancel] = useState(0);
    const [responseError, setResponseError] = useState(null);

    // Format Date and Time correctly in dashboard
    const DateUTC = new Date(`${date}T${time}`);
    const formattedTime = `${addZero(DateUTC.getHours())}:${addZero(
        DateUTC.getMinutes()
    )}`;
    const formattedDate = `${DateUTC.getFullYear()}-${
        DateUTC.getMonth() + 1
    }-${DateUTC.getDate()}`;

    // Seats
    const seat = () => {
        if (status === "booked") {
            return (
                <a href={`/reservations/${id}/seat`}>
                    <button>Seat</button>
                </a>
            );
        } else if (status === "seated") {
            return null;
        }
    };

    // Edit
    const editButton = () => {
        if (status === "booked") {
            return (
                <a href={`/reservations/${id}/edit`} style={{ display: "flex", justifyContent:"center"}}>
                    <button>Edit</button>
                </a>
            );
        } else {
            return null;
        }
    };

    // Cancel handler
    const handleCancel = (event) => {
        event.preventDefault();
        setCancel(1);
    };

    useEffect(() => {
        async function updateStatus() {
            const data = {
                status: "cancelled",
            };
            const response = await updateReservationStatus(data, id);
            if (response.error) {
                setResponseError(response.error);
            } else {
                setRefresh((prev) => !prev);
            }
        }

        if (cancel === 1) {
            if (
                window.confirm(
                    "Do you want to cancel this reservation? This cannot be undone."
                )
            ) {
                updateStatus();
            }
        }

        setCancel(0);

        return () => setCancel(0);
    }, [cancel, id, setRefresh]);

    return (
        <tr>
            <td>{first}</td>
            <td>{last}</td>
            <td>{formattedTime}</td>
            <td>{formattedDate}</td>
            <td>{people}</td>
            <td style={{ minWidth: "120px" }}>{contact}</td>
            <td
                style={{
                    right: "130px",
                    position: "sticky",
                    zIndex: "50",
                    backgroundColor: "white",
                }}
            >
                {seat()}
            </td>
            <td
                style={{
                    right: "70px",
                    minWidth: "60px",
                    position: "sticky",
                    zIndex: "50",
                    backgroundColor: "white",
                }}
            >
                <p data-reservation-id-status={id}>{status}</p>
            </td>
            <td
                style={{
                    right: "0",
                    minWidth: "70px",
                    position: "sticky",
                    zIndex: "50",
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {editButton()}
                <button
                    data-reservation-id-cancel={`${id}`}
                    onClick={handleCancel}
                >
                    Cancel
                    {responseError ? <ErrorAlert error={responseError} /> : ""}
                </button>
            </td>
        </tr>
    );
}
