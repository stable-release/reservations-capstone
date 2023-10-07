export default function TableCard({
    id,
    name,
    capacity,
    reservation_id,
    handleFinish
}) {
    // If table is occupied, show finish button
    // Otherwise, show free
    const finish = reservation_id ? (
        <button
            data-table-id-finish={`${id}`}
            style={{ width: "70%" }}
            onClick={() => handleFinish(id)}
        >
            Finish
        </button>
    ) : null;

    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{capacity}</td>
            <td
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <p data-table-id-status={`${id}`}>
                {reservation_id ? "occupied" : "free"} 
                </p>
                {finish}
            </td>
        </tr>
    );
}