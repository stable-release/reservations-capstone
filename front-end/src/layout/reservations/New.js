import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { createReservation } from "../../utils/api";
import ReservationForm from "../forms/ReservationForm";

function addZero(n) {
    if (n < 10) {
        n = "0" + n;
    }
    return n;
}

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
    )}:${addZero(currentDate.getSeconds())}`;
}

export default function NewReservation() {
    const history = useHistory();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "123 456 7890",
        reservation_date: "",
        reservation_time: "",
        people: "0",
    });

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

    const handleTimeChange = ({ target }) => {
        const time = target.value;
        setFormData({
            ...formData,
            reservation_time: `${time}:00`,
        });
    };

    /**
     * Default Time & Date
     */
    useEffect(() => {
        const currentTime = todayTime();
        const currentDate = todayDate();
        setFormData({
            ...formData,
            reservation_time: currentTime,
            reservation_date: currentDate,
        });
    }, []);

    /**
     * Create call to API
     */
    useEffect(() => {
        const abortController = new AbortController();
        if (submitted === 1) {
            createReservation(formData, abortController).then(
                history.push(`/dashboard?date=${formData.reservation_date}`)
            );
        } else if (submitted === 2) {
            history.goBack();
        }
        return () => setSubmitted(() => 0);
    }, [submitted, history, formData]);

    return (
        <div>
            <ReservationForm
                setFormData={setFormData}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                handleTimeChange={handleTimeChange}
            />
        </div>
    );
}
