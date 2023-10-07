export default function SearchForm({
    mobile_number,
    handleChange,
    handleSubmit,
}) {
    return (
        <form onSubmit={handleSubmit}>
            <fieldset style={{ display: "flex", flexDirection: "column" }}>
                <legend>Search by Mobile Number</legend>
                <label htmlFor="mobile_number">Mobile Number</label>
                <input
                    name="mobile_number"
                    id="mobile_number"
                    required={true}
                    placeholder="Mobile Number"
                    onChange={handleChange}
                    value={mobile_number}
                />
            </fieldset>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <button
                    type="submit"
                    style={{
                        alignSelf: "right",
                        marginTop: "0.5rem"
                    }}
                >
                    Find
                </button>
            </div>
        </form>
    );
}
