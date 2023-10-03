import React, { useEffect, useState } from "react";
import { listDateReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useParams, Link, useLocation } from "react-router-dom";
import { today, previous, next } from "../utils/date-time";
import ReservationCard from "./ReservationCard";
import useQuery from "../utils/useQuery";
import "./Dashboard.css";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
    let query = useQuery();
    let date = query.get("date")
    console.log(date);
    // date = date ? date : today();

    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [dateNames, setDateNames] = useState({
        today: date,
        previous: "",
        next: "",
    })

    /**
     * GET Request for current date reservations
     */
    useEffect(() => {
        const abortController = new AbortController();
        listDateReservations(date, abortController).then(setReservations).catch(setReservationsError);
    }, [date]);

    /**
     * Set today, previous, next values
     */
    useEffect(() => {

    }, [])

    const resList = reservations && reservations.length
        ? reservations.map((singleReservation, index, array) => {
              return (
                  <ReservationCard
                      key={singleReservation.id}
                      first={singleReservation.first_name}
                      last={singleReservation.last_name}
                      time={singleReservation.reservation_time}
                      date={date}
                      people={singleReservation.people}
                      contact={singleReservation.mobile_number}
                  />
              );
          })
        : null;

    return (
        <main>
            <h1>Dashboard</h1>
            <div style={{display:"flex"}}>
                <Link to={`/dashboard?date=${previous(date)}`} style={{margin:"1rem", marginLeft:"0"}}>Previous</Link>
                <Link to={`/dashboard?date=${today()}`} style={{margin:"1rem"}}>Today</Link>
                <Link to={`/dashboard?date=${next(date)}`} style={{margin:"1rem"}}>Next</Link>
            </div>
            <div className="d-md-flex mb-3">
                <table style={{ width: "100%" }}>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Reservation Time</th>
                        <th>Reservation Date</th>
                        <th>Number of People</th>
                        <th>Contact Number</th>
                    </tr>
                    {resList}
                </table>
            </div>
            <ErrorAlert error={reservationsError} />
        </main>
    );
}

export default Dashboard;
