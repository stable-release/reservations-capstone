/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * POST Call to create a new reservation
 * @param {reservation} params 
 * @returns {Promise<reservation>}
 */
export async function createReservation(params) {
    const abortController = new AbortController();
    try {
        const headers = {
            Accept: "*/*",
            "Content-Type": "application/json",
        };

        const bodyContent = JSON.stringify({
            data: {
                ...params,
            },
        });

        const response = await fetch(`${API_BASE_URL}/reservations`, {
            method: "POST",
            body: bodyContent,
            headers: headers,
        });

        const payload = await response.json();

        if (payload.error) {
            return Promise.reject({ message: payload.error });
        }
        return payload.data;
    } catch (err) {
        abortController.abort(err);
    }
}

/**
 * GET Call to retrieve all reservations for a date ordered by time
 * @param {Date} date
 * @returns {Promise<[reservation]>}
 */
export async function listDateReservations(date) {
    const abortController = new AbortController();
    try {
        const response = await fetch(
            `${API_BASE_URL}/reservations?date=${date}`,
            {
                method: "GET",
            }
        );
        const { data } = await response.json();
        return data;
    } catch (err) {
        abortController.abort(err);
    }
}

/**
 * GET Call to retrieve a reservation by ID
 * @param {Number} id
 * @returns {reservation}
 */
export async function listIDReservation(id) {
    const abortController = new AbortController();
    try {
        const response = await fetch(
            `${API_BASE_URL}/reservations/${id}`,
            {
                method: "GET",
            }
        );
        const { data } = await response.json();
        return data;
    } catch (err) {
        abortController.abort(err);
    }
}

/**
 * POST Call to create a new table entry
 * @param {table} params 
 * @returns {Promise<table>}
 */
export async function createTable(params) {
    const abortController = new AbortController();
    try {
        const headers = {
            Accept: "*/*",
            "Content-Type": "application/json",
        };

        const bodyContent = JSON.stringify({
            data: {
                ...params,
            },
        });

        const response = await fetch(`${API_BASE_URL}/tables`, {
            method: "POST",
            body: bodyContent,
            headers: headers,
        });

        const payload = await response.json();

        if (payload.error) {
            return Promise.reject({ message: payload.error });
        }
        return payload.data;
    } catch (err) {
        abortController.abort(err);
    }
}

/**
 * GET Call for all tables
 * @returns {Array<table>}
 */
export async function listAllTables() {
    const abortController = new AbortController();
    try {
        const response = await fetch(
            `${API_BASE_URL}/tables`,
            {
                method: "GET",
            }
        );
        const { data } = await response.json();
        return data;
    } catch (err) {
        abortController.abort(err);
    }
}

/**
 * PUT Call to link table with reservation
 * @param {table} params 
 * @param {number} table_id 
 * @returns {Promise<table>}
 */
export async function assignTableToReservation(params, table_id) {
    const abortController = new AbortController();
    try {
        const headers = {
            Accept: "*/*",
            "Content-Type": "application/json",
        };

        const bodyContent = JSON.stringify({
            data: {
                ...params,
            },
        });

        const response = await fetch(`${API_BASE_URL}/tables/${table_id}/seat`, {
            method: "PUT",
            body: bodyContent,
            headers: headers,
        });

        const payload = await response.json();

        if (payload.error) {
            return Promise.reject({ message: payload.error });
        }
        return payload.data;
    } catch (err) {
        abortController.abort(err);
    }
}

/**
 * DELETE Call for reservation
 * @param {table_id} params
 * @param {number} table_id 
 * @returns {Promise<number>}
 */
export async function deleteTable(params, table_id) {
    const abortController = new AbortController();
    try {
        const headers = {
            Accept: "*/*",
            "Content-Type": "application/json",
        };

        const bodyContent = JSON.stringify({
            data: {
                ...params,
            },
        });

        const response = await fetch(`${API_BASE_URL}/tables/${table_id}/seat`, {
            method: "DELETE",
            body: bodyContent,
            headers: headers,
        });

        const payload = await response.json();

        if (payload.error) {
            return Promise.reject({ message: payload.error });
        }
        return payload.data;
    } catch (err) {
        abortController.abort(err);
    }
}

/**
 * PUT Call to update reservation status
 * @param {status} params 
 * @param {number} reservation_id 
 * @returns {Promise<status>}
 */
export async function updateReservationStatus(params, reservation_id) {
    const abortController = new AbortController();
    try {
        const headers = {
            Accept: "*/*",
            "Content-Type": "application/json",
        };

        const bodyContent = JSON.stringify({
            data: {
                ...params,
            },
        });

        const response = await fetch(`${API_BASE_URL}/reservations/${reservation_id}/status`, {
            method: "PUT",
            body: bodyContent,
            headers: headers,
        });

        const payload = await response.json();

        if (payload.error) {
            return Promise.reject({ message: payload.error });
        }
        return payload.data;
    } catch (err) {
        abortController.abort(err);
    }
}

/**
 * GET Call to retrieve reservations matching mobile_number
 * @param {String} mobile_number
 * @returns {Array<reservations>}
 */
export async function listMobileNumberReservations(mobile_number) {
    const abortController = new AbortController();
    try {
        const response = await fetch(
            `${API_BASE_URL}/reservations?mobile_number=${mobile_number}`,
            {
                method: "GET",
            }
        );
        const payload = await response.json();

        if (payload.error) {
            return Promise.reject({ message: payload.error });
        }
        return payload.data;
    } catch (err) {
        abortController.abort(err);
    }
}

/**
 * PUT Call to edit a single reservation
 * @param {reservation} params 
 * @returns {Promise<reservation>}
 */
export async function editReservation(params, reservation_id) {
    const abortController = new AbortController();
    try {
        const headers = {
            Accept: "*/*",
            "Content-Type": "application/json",
        };

        const bodyContent = JSON.stringify({
            data: {
                ...params,
            },
        });

        const response = await fetch(`${API_BASE_URL}/reservations/${reservation_id}`, {
            method: "PUT",
            body: bodyContent,
            headers: headers,
        });

        const payload = await response.json();

        if (payload.error) {
            return Promise.reject({ message: payload.error });
        }
        return payload.data;
    } catch (err) {
        abortController.abort(err);
    }
}