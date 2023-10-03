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
    }

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
        if (submitted === 1) {
            createReservation(formData).then(() =>
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
                handlePeople={handlePeople}
            />
        </div>
    );
}
