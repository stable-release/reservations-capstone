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
}) {
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
                <p
                    data-reservation-id-status={
                        id
                    }
                >
                    {status}
                </p>
            </td>
        </tr>
    );
}
