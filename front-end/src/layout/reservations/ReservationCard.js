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
                <a href={`/reservations/${id}/edit`}>
                    <button>Edit</button>
                </a>
            );
        } else {
            return null;
        }
    }

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
            <td>{contact}</td>
            <td>{seat()}</td>
            <td>
                <p data-reservation-id-status={id}>{status}</p>
            </td>
            <td>
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
