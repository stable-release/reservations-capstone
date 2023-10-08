import { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { editReservation, listIDReservation } from "../../utils/api";
import ReservationForm from "../forms/ReservationForm";
import ErrorAlert from "../ErrorAlert";
const { addZero } = require("../../utils/addZero");

export default function EditReservation() {
    const history = useHistory();
    // Reservation ID
    const { reservation_id } = useParams();
    const res_id = useMemo(() => {
        return { reservation_id: reservation_id };
    }, [reservation_id]);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "00:00",
        people: Number(""),
    });
    const [formDataError, setFormDataError] = useState(null);
    const [responseError, setResponseError] = useState(null);

    /**
     * 0 default
     * 1 submit
     * 2 cancel
     */
    const [submitted, setSubmitted] = useState(0);

    /**
     * Event Handlers
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(1);
    };

    const handleCancel = (event) => {
        event.preventDefault();
        setSubmitted(2);
    };

    const handleChange = ({ target }) => {
        const value = target.value;
        setFormData({
            ...formData,
            [target.name]: value,
        });
    };

    const handlePeople = ({ target }) => {
        const value = target.value;
        setFormData({
            ...formData,
            [target.name]: parseInt(value),
        });
    };

    /**
     * Form error components
     */
    const errorAlerts = formDataError
        ? formDataError.map((err) => {
              return <ErrorAlert key={err.key} error={err} />;
          })
        : null;

    // Sets default formdata properties for this single reservation
    useEffect(() => {
        async function defaultReservation() {
            const response = await listIDReservation(res_id.reservation_id);
            const d = new Date(response.reservation_date);
            const formattedDate = `${d.getFullYear()}-${d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1).toString() : d.getMonth() + 1}-${
                d.getDate() < 10
                    ? "0" + d.getDate().toString()
                    : d.getDate().toString()
            }`;
            response.reservation_date = formattedDate;

            setFormData(response);
        }

        defaultReservation();
    }, [res_id]);

    /**
     * Create call to API
     */
    useEffect(() => {
        let formattedNumber = "";
        let formattedDate = "";
        let formattedTime = "";

        const validateForm = (reservation_date, reservation_time) => {
            const errArr = [];

            // Date and Time Validation
            // By default, new Date() creates a Date object using time on local computer
            const d = new Date(`${reservation_date}T${reservation_time}`);

            formattedDate = `${d.getFullYear()}-${d.getMonth() + 1}-${
                d.getDate() < 10
                    ? "0" + d.getDate().toString()
                    : d.getDate().toString()
            }`;
            formattedTime = `${addZero(d.getHours())}:${addZero(
                d.getMinutes()
            )}`;

            // Open at 10:30 AM
            const morning_minimum = new Date(`${reservation_date}T10:30`);

            if (d.getTime() < morning_minimum.getTime()) {
                errArr.push({
                    key: "Time",
                    message: "We open at 10:30 AM",
                });
            }

            // Close at 9:30 PM
            const evening_maximum = new Date(`${reservation_date}T21:30`);
            if (d.getTime() > evening_maximum.getTime()) {
                errArr.push({
                    key: "Time",
                    message: "Our kitchen closes at 9:30 PM",
                });
            }

            // Close on Tuesdays
            if (d.getDay() === 2) {
                errArr.push({
                    key: "Closed",
                    message: "Sorry, we are closed on Tuesdays",
                });
            }

            // Date should be in the future
            if (Date.now() >= d.getTime()) {
                errArr.push({
                    key: "Past",
                    message: "Date must be in the future",
                });
            }

            // Phone validation
            const phone = formData.mobile_number;
            let finalString = "";
            for (let i in phone) {
                if (/\d/.test(phone[i])) {
                    finalString += phone[i];
                }
                if (finalString.length === 3 || finalString.length === 7) {
                    finalString += "-";
                }
            }

            // Phone number should have only 12 numbers within string
            if (finalString.length !== 12) {
                errArr.push({
                    key: "Phone",
                    message: "Phone must have at least 12 digits",
                });
            }

            // Change phone number to valid API call format
            formattedNumber = finalString;

            if (errArr.length) {
                setFormDataError(() => [...errArr]);
                return false;
            }

            return true;
        };

        // Submit condition
        if (
            submitted === 1 &&
            validateForm(formData.reservation_date, formData.reservation_time)
        ) {

            const data = {
                ...formData,
                mobile_number: formattedNumber,
                reservation_date: formattedDate,
                reservation_time: formattedTime,
            };

            editReservation(data, reservation_id)
                .then(() => history.push(`/dashboard?date=${formattedDate}`))
                .catch((error) => setResponseError(error));
        }
        // Cancel condition
        else if (submitted === 2) {
            history.goBack();
        }

        // Clean Up
        return () => setSubmitted(() => 0);
    }, [submitted, history, formData, formDataError, reservation_id]);

    return (
        <div>
            {responseError ? <ErrorAlert error={responseError} /> : ""}
            {errorAlerts}
            {formData.reservation_date ? (
                <ReservationForm
                    setFormData={setFormData}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    handleCancel={handleCancel}
                    handlePeople={handlePeople}
                />
            ) : null}
        </div>
    );
}
