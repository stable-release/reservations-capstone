export default function SeatForm({
    tables,
    selection,
    handleChange,
    handleSubmit,
    handleCancel,
}) {
    const options = tables && tables.length ? [...tables] : [];

    return (
        <form onSubmit={handleSubmit}>
            <fieldset style={{ display: "flex", flexDirection: "column" }}>
                <legend>Select Table</legend>
                <label htmlFor="table_id">/Table Name/ - /Capacity/</label>
                <select name="table_id" onChange={handleChange} value={selection}>
                <option value="" disabled hidden>Choose a table #Name - #Capacity</option>
                    {options.map((table, index) => {
                        return (
                            <option key={table.table_id} value={table.table_id}>
                                {table.table_name} - {table.capacity}
                            </option>
                        );
                    })}
                </select>
            </fieldset>
            <div
                style={{
                    display: "flex",
                }}
            >
                <button
                    onClick={handleCancel}
                    style={{
                        marginRight: "auto",
                        alignSelf: "left",
                    }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    style={{
                        alignSelf: "right",
                    }}
                >
                    Submit
                </button>
            </div>
        </form>
    );
}
