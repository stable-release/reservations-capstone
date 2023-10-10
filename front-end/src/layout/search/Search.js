import { useEffect, useState } from "react";
import SearchForm from "../forms/SearchForm";
import { listMobileNumberReservations } from "../../utils/api";
import Results from "./Results";

export default function Search() {
    const [mobileNumber, setMobileNumber] = useState("");
    const [reservations, setReservations] = useState(null);

    /**
     * 0 default
     * 1 submit
     */
    const [submitted, setSubmitted] = useState(0);

    /**
     * Event Handlers
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(1);
    };

    const handleChange = ({ target }) => {
        const value = target.value;
        setMobileNumber(value);
    };

    const resList = () => {
        if (reservations && reservations.length) {
            return reservations.map((singleReservation, index, array) => {
                return (
                    <Results
                        key={singleReservation.reservation_id}
                        id={singleReservation.reservation_id}
                        first={singleReservation.first_name}
                        last={singleReservation.last_name}
                        time={singleReservation.reservation_time}
                        date={singleReservation.reservation_date}
                        people={singleReservation.people}
                        contact={singleReservation.mobile_number}
                        status={singleReservation.status}
                    />
                );
            })
        }
        else if (reservations && !reservations.length) {
            return <tr><td>"No reservations found"</td></tr>
        } 
        else {
            return null;
        }
    };

    useEffect(() => {
        async function searchForReservations() {
            const data = await listMobileNumberReservations(mobileNumber);
            setReservations(data);
        }
        if (submitted === 1) {
            searchForReservations();
        }
        return () => setSubmitted(0);
    }, [submitted, mobileNumber]);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <SearchForm
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                mobile_number={mobileNumber}
            />
            <div className="d-md-flex mb-3" style={{ overflowX: "auto", width: "100%" }}>
                <table style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Reservation Time</th>
                            <th>Reservation Date</th>
                            <th>Number of People</th>
                            <th>Contact Number</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {resList()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
