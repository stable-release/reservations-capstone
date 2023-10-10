const { addZero } = require("../../utils/addZero");

export default function Results({
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
    const preFormatDate = new Date(date);
    const DateUTC = new Date(
        `${`${preFormatDate.getFullYear()}-${
            preFormatDate.getMonth() + 1
        }-${
            preFormatDate.getDate() < 10
                ? "0" + preFormatDate.getDate().toString()
                : preFormatDate.getDate().toString()
        }`}T${time}`
    );
    const formattedTime = `${addZero(DateUTC.getHours())}:${addZero(
        DateUTC.getMinutes()
    )}`;
    const formattedDate = `${DateUTC.getFullYear()}-${
        DateUTC.getMonth() + 1
    }-${DateUTC.getDate()}`;
    
    return (
        <tr>
            <td>{first}</td>
            <td>{last}</td>
            <td>{formattedTime}</td>
            <td>{formattedDate}</td>
            <td>{people}</td>
            <td>{contact}</td>
            <td                 style={{
                    right: "0",
                    minWidth: "60px",
                    position: "sticky",
                    zIndex: "50",
                    backgroundColor: "white",
                }}>
                <p data-reservation-id-status={id}>{status}</p>
            </td>
        </tr>
    );
}
