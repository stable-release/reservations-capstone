export default function TableCard({
    id,
    name,
    capacity,
    reservation_id,
    handleDelete,
}) {

    // Handle finish event with confirmation
    const handleFinish = (id) => {
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
            handleDelete(id)
        } else {

        }
    };

    // If table is occupied, show finish button
    // Otherwise, show free
    const finish = reservation_id ? (
        <button
            data-table-id-status={`${id}`}
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
                data-table-id-status={`${id}`}
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
