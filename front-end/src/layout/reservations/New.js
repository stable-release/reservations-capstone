import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { createReservation } from "../../utils/api";
import ReservationForm from "../forms/ReservationForm";
import ErrorAlert from "../ErrorAlert";
const { addZero } = require("../../utils/addZero");

function todayDate() {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;
}

function todayTime() {
    const currentDate = new Date();
    return `${addZero(currentDate.getHours())}:${addZero(
        currentDate.getMinutes()
    )}`;
}

export default function NewReservation() {
    const history = useHistory();

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

    const errorAlerts = formDataError
        ? formDataError.map((err) => {
              return <ErrorAlert key={err.key} error={err} />;
          })
        : null;

    /**
     * Default Time & Date
     */
    useEffect(() => {
        if (!formData.reservation_date) {
            const currentTime = todayTime();
            const currentDate = todayDate();
            setFormData({
                ...formData,
                reservation_time: currentTime,
                reservation_date: currentDate,
            });
        }
    }, [formData]);

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
            // Date() object needs to be converted to UTC for accurate comparisons
            const d = new Date(`${reservation_date}T${reservation_time}`);

            formattedDate = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
            formattedTime = `${addZero(d.getUTCHours())}:${addZero(d.getUTCMinutes())}`;

            // Open at 10:30 AM
            const morning_minimum = new Date(`${reservation_date}T10:30`);

            if (d.getTime() < morning_minimum.getTime()) {
                errArr.push({
                    key: "Time",
                    message: "We open at 10:30 AM"
                })
            }

            // Close at 9:30 PM
            const evening_maximum = new Date(`${reservation_date}T21:30`);
            if (d.getTime() > evening_maximum.getTime()) {
                errArr.push({
                    key: "Time",
                    message: "Our kitchen closes at 9:30 PM"
                })
            }

            if (d.getDay() === 2) {
                errArr.push({
                    key: "Closed",
                    message: "Sorry, we are closed on Tuesdays",
                });
            }

            if (Date.now() >= d.getTime()) {
                errArr.push({
                    key: "Past",
                    message: "Date must be in the future",
                });
            }

            if (errArr.length) {
                setFormDataError(() => [...errArr]);
                return false;
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

            if (finalString.length !== 12) {
                return false;
            }

            formattedNumber = finalString;

            return true;
        };

        if (
            submitted === 1 &&
            validateForm(formData.reservation_date, formData.reservation_time)
        ) {
            const data = {
                ...formData,
                mobile_number: formattedNumber,
                reservation_date: formattedDate,
                reservation_time: formattedTime,
            }
            console.log(data);

            createReservation(data).then(() =>
                history.push(`/dashboard?date=${formattedDate}`)
            ).catch((error) => setResponseError(error));
        } else if (submitted === 2) {
            history.goBack();
        }

        return () => setSubmitted(() => 0);
    }, [submitted, history, formData, formDataError]);

    return (
        <div>
            {responseError ? <ErrorAlert error={responseError} /> : ""}
            {errorAlerts}
            <ReservationForm
                setFormData={setFormData}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                handlePeople={handlePeople}
            />
        </div>
    );
}
