const { addZero } = require("../utils/addZero");

export default function ReservationCard({ first, last, time, date, people, contact }) {
    const DateUTC = new Date(`${date}T${time}`);
    const formattedTime = `${addZero(DateUTC.getHours())}:${addZero(DateUTC.getMinutes())}`;
    const formattedDate = `${DateUTC.getFullYear()}-${DateUTC.getMonth()+1}-${DateUTC.getDate()}`;
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