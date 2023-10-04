const { addZero } = require("../utils/addZero");

export default function ReservationCard({ first, last, time, date, people, contact }) {
    const DateUTC = new Date(`${date}T${time}z`);
    const formattedTime = `${addZero(DateUTC.getUTCHours())}:${addZero(DateUTC.getUTCMinutes())}`;
    const formattedDate = `${DateUTC.getUTCFullYear()}-${DateUTC.getUTCMonth()+1}-${DateUTC.getUTCDate()}`;
    return (
            <tr>
                <td>{first}</td>
                <td>{last}</td>
                <td>{formattedTime}</td>
                <td>{formattedDate}</td>
                <td>{people}</td>
                <td>{contact}</td>
            </tr>
    )
}