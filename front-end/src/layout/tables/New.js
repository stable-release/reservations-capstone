import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ErrorAlert from "../ErrorAlert";
import TableForm from "../forms/TableForm";
import { today } from "../../utils/date-time";
import { createTable } from "../../utils/api";

export default function NewTable() {
    const history = useHistory();

    const [formData, setFormData] = useState({
        table_name: "",
        capacity: Number(""),
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

    const handleCapacity = ({ target }) => {
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

    /**
     * Create call to API
     */
    useEffect(() => {
        const validateForm = (table_name, capacity) => {
            const errArr = [];

            // Validation for capacity
            if (Number(capacity) < 1) {
                errArr.push({
                    key: "Capacity",
                    message: "Capacity must be greater than zero",
                });
            }

            // Validation for table name
            if (table_name.length <= 3) {
                errArr.push({
                    key: "Name",
                    message: "Table name must be longer than 3 characters",
                });
            }

            if (errArr.length) {
                setFormDataError(() => [...errArr]);
                return false;
            }

            return true;
        };

        // Submit condition
        if (
            submitted === 1 &&
            validateForm(formData.table_name, formData.capacity)
        ) {
            const data = {
                table_name: formData.table_name,
                capacity: Number(formData.capacity),
            };
            createTable(data)
                .then(() => history.push(`/dashboard?date=${today()}`))
                .catch((error) => setResponseError(error));
        }
        // Cancel condition
        else if (submitted === 2) {
            history.goBack();
        }

        // Clean Up
        return () => setSubmitted(() => 0);
    }, [submitted, history, formData]);

    return (
        <div>
            {responseError ? <ErrorAlert error={responseError} /> : ""}
            {errorAlerts}
            <TableForm
                formData={formData}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                handleChange={handleChange}
                handleCapacity={handleCapacity}
            />
        </div>
    );
}
