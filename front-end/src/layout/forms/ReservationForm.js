import { PatternFormat } from "react-number-format";

export default function ReservationForm({ setFormData, formData, handleChange, handleSubmit, handleCancel, handleTimeChange }) {
    return (
        <form onSubmit={handleSubmit}>
        <fieldset
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <legend>Reservation Form</legend>
            <label htmlFor="first_name">First Name</label>
            <input
                name="first_name"
                id="first_name"
                required={true}
                placeholder="First Name"
                onChange={handleChange}
                value={formData.first_name}
            />
            <label htmlFor="last_name">Last Name</label>
            <input
                name="last_name"
                id="last_name"
                required={true}
                placeholder="Last Name"
                onChange={handleChange}
                value={formData.last_name}
            />
            <label htmlFor="mobile_number">Mobile Number</label>
            <PatternFormat
                type="tel"
                value={formData.mobile_number}
                onValueChange={(value) =>
                    setFormData({
                        ...formData,
                        mobile_number: value.formattedValue,
                    })
                }
                format="###-###-####"
                required
            />
            <label htmlFor="reservation_date">Reservation Date</label>
            <input
                name="reservation_date"
                id="reservation_date"
                type="date"
                value={formData.value}
                onChange={handleChange}
                required
                pattern="\d{4}-\d{2}-\d{2}"
            />
            <label htmlFor="reservation_time">Reservation Time</label>
            <input
                name="reservation_time"
                id="reservation_time"
                type="time"
                value={formData.reservation_time}
                onChange={handleTimeChange}
                required
                pattern="[0-9]{2}:[0-9]{2}"
                placeholder={formData.reservation_time}
            />
            <label htmlFor="people">People</label>
            <input
                name="people"
                id="people"
                type="number"
                value={formData.people}
                onChange={handleChange}
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
    )
}