export default function ReservationCard({ first, last, time, date, people, contact}) {
    return (
            <tr>
                <td>{first}</td>
                <td>{last}</td>
                <td>{time}</td>
                <td>{date}</td>
                <td>{people}</td>
                <td>{contact}</td>
            </tr>
    )
}