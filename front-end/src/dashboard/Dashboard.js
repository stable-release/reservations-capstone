import React, { useEffect, useState } from "react";
import { listDateReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Link } from "react-router-dom";
import { today, previous, next } from "../utils/date-time";
import ReservationCard from "../layout/reservations/ReservationCard";
import useQuery from "../utils/useQuery";
import "./Dashboard.css";
import ListTables from "../layout/tables/ListTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
    const queryDate = useQuery().get("date");
    const [date, setDate] = useState(queryDate);

    const [refresh, setRefresh] = useState(false);
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    /**
     * Set date to query date
     */
    useEffect(() => {
        if (!queryDate) {
            setDate(today());
        }
    }, [queryDate]);

    /**
     * GET Request for current date reservations
     */
    useEffect(() => {
        listDateReservations(date)
            .then(setReservations)
            .catch(setReservationsError);
    }, [date, refresh]);

    const resList =
        reservations && reservations.length
            ? reservations.map((singleReservation, index, array) => {
                  return (
                      <ReservationCard
                          key={singleReservation.reservation_id}
                          id={singleReservation.reservation_id}
                          first={singleReservation.first_name}
                          last={singleReservation.last_name}
                          time={singleReservation.reservation_time}
                          date={date}
                          people={singleReservation.people}
                          contact={singleReservation.mobile_number}
                          status={singleReservation.status}
                          setRefresh={setRefresh}
                      />
                  );
              })
            : null;

    return (
        <main>
            <div style={{ display:"flex", alignItems:"baseline"}}>
                <h1 style={{ maxWidth: "50%"}}>Dashboard:</h1>
                <h2 style={{ maxWidth: "50%"}}>&nbsp; {date}</h2>
            </div>
            <div style={{ display: "flex" }}>
                <Link
                    to={`/dashboard?date=${
                        date ? previous(date) : previous(today())
                    }`}
                    style={{ margin: "1rem", marginLeft: "0" }}
                    onClick={() => setDate(previous(date))}
                >
                    Previous
                </Link>
                <Link
                    to={`/dashboard?date=${today()}`}
                    style={{ margin: "1rem" }}
                    onClick={() => setDate(today())}
                >
                    Today
                </Link>
                <Link
                    to={`/dashboard?date=${date ? next(date) : next(today())}`}
                    style={{ margin: "1rem" }}
                    onClick={() => setDate(next(date))}
                >
                    Next
                </Link>
            </div>
            <div className="d-md-flex mb-3" style={{ overflow: "auto" }}>
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Reservation Time</th>
                            <th>Reservation Date</th>
                            <th>Number of People</th>
                            <th>Contact Number</th>
                            <th
                                style={{
                                    right: "130px",
                                    position: "sticky",
                                    zIndex: "50",
                                    backgroundColor: "white",
                                }}
                            >
                                Table
                            </th>
                            <th
                                style={{
                                    right: "70px",
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "50",
                                    backgroundColor: "white",
                                }}
                            >
                                Status
                            </th>
                            <th
                                style={{
                                    right: "0",
                                    minWidth: "70px",
                                    position: "sticky",
                                    zIndex: "50",
                                    backgroundColor: "white",
                                }}
                            >
                                Edit / Cancel
                            </th>
                        </tr>
                    </thead>
                    <tbody>{resList}</tbody>
                </table>
            </div>
            <ErrorAlert error={reservationsError} />
            <div className="d-md-flex mb-3">
                <ListTables setRefresh={setRefresh} />
            </div>
        </main>
    );
}

export default Dashboard;
