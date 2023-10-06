export default function TableCard({ id, name, capacity, reservation_id }) {
    return (
        <tr>
            <td>{name}</td>
            <td>{capacity}</td>
            <td data-table-id-status={`${id}`}>{reservation_id ? "Occupied" : "Free"}</td>
        </tr>
)
}