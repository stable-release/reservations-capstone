export default function TableForm({
    formData,
    handleChange,
    handleSubmit,
    handleCancel,
    handleCapacity,
}) {
    return (
        <form onSubmit={handleSubmit}>
            <fieldset style={{ display: "flex", flexDirection: "column" }}>
                <legend>Table Form</legend>
                <label htmlFor="table_name">Table Name</label>
                <input
                    name="table_name"
                    id="table_name"
                    required={true}
                    placeholder="Table Name"
                    onChange={handleChange}
                    value={formData.table_name}
                />
                <label htmlFor="capacity">Capacity</label>
                <input
                    name="capacity"
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleCapacity}
                    required
                />
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
