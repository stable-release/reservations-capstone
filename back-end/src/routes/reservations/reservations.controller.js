const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");
const hasProperties = require("../../errors/hasProperties");
const today = require("../../utils/today");
const { addZero } = require("../../utils/addZero");

/**
 * Property validation containing only VALID_PROPERTIES for create
 */
const VALID_PROPERTIES = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
];

/**
 * Validation to check for missing properties
 */
async function propertiesExist(req, res, next) {
    const { data = {} } = req.body;
    for (let key of VALID_PROPERTIES) {
        if (!Object.keys(data).includes(key)) {
            next({
                message: `Required ${key} property is missing`,
                status: 400,
            });
        }
    }
    res.locals.first_name = data.first_name;
    res.locals.last_name = data.last_name;
    res.locals.mobile_number = data.mobile_number;
    res.locals.reservation_date = data.reservation_date;
    res.locals.reservation_time = data.reservation_time;
    res.locals.people = data.people;
    res.locals.timezone = data.dateTime_timezone ? data.dateTime_timezone : "z";
    next();
}

/**
 * First name not empty
 */
async function validFirstName(req, res, next) {
    let alpha = /^[a-zA-Z]+$/;
    if (res.locals.first_name.length > 0 && alpha.test(res.locals.first_name)) {
        return next();
    }
    next({
        message: "Property first_name empty",
        status: 400,
    });
}

/**
 * Last name not empty
 */
async function validLastName(req, res, next) {
    if (res.locals.last_name.length > 0) {
        return next();
    }
    next({
        message: "Property last_name empty",
        status: 400,
    });
}

/**
 * Mobile Phone number not empty
 */
async function validPhone(req, res, next) {
    if (res.locals.mobile_number && res.locals.mobile_number.length === 12) {
        return next();
    }
    next({
        message: "Property mobile_number is invalid",
        status: 400,
    });
}

/**
 * Date is not empty or invalid
 */
async function validDate(req, res, next) {
    if (!res.locals.reservation_date) {
        return next({
            message: "Property reservation_date is empty",
            status: 400,
        });
    }
    const date = new Date(res.locals.reservation_date);
    if (date.getTime() !== date.getTime()) {
        return next({
            message: "Property reservation_date is invalid",
            status: 400,
        });
    }
    next();
}

/**
 * Time is not empty or invalid
 */
async function validTime(req, res, next) {
    if (!res.locals.reservation_time) {
        return next({
            message: "Property reservation_time is empty",
            status: 400,
        });
    }
    const splitTime = res.locals.reservation_time.replace(":", "");
    const nums = /^\d+$/;
    for (let n in splitTime) {
        if (!nums.test(splitTime[n])) {
            return next({
                message: "Property reservation_time is invalid",
                status: 400,
            });
        }
    }
    next();
}

/**
 * DateTime not past or on closed days
 */
async function validDateTime(req, res, next) {
    const d = new Date(
        `${res.locals.reservation_date}T${res.locals.reservation_time}z`
    );

    if (d.getDay() === 2) {
        return next({
            message: "Sorry, we're closed on Tuesdays",
            status: 400,
        });
    }
    if (Date.now() >= d.getTime()) {
        return next({
            message: "Reservation must be in the future",
            status: 400,
        });
    }

    const f = new Date(
        `${res.locals.reservation_date}T${res.locals.reservation_time}`
    );

    // Timezone differential in milliseconds

    const morning_minimum = new Date(`${res.locals.reservation_date}T10:30`);
    if (f.getTime() < morning_minimum.getTime()) {
        return next({
            message: `We open at 10:30 AM Local`,
            status: 400,
        });
    }

    const evening_maximum = new Date(`${res.locals.reservation_date}T21:30`);
    if (f.getTime() > evening_maximum.getTime()) {
        return next({
            message: `Our kitchen closes at 9:30 PM Local`,
            status: 400,
        });
    }

    next();
}

/**
 * Valid number of people
 */
async function validPeople(req, res, next) {
    if (res.locals.people === 0) {
        return next({
            message: "Property people is zero",
            status: 400,
        });
    }

    if (!res.locals.people) {
        return next({
            message: "Property people is empty",
            status: 400,
        });
    }

    if (typeof res.locals.people !== "number") {
        return next({
            message: "Property people is invalid",
            status: 400,
        });
    }
    next();
}

/**
 * Create handler for new reservations
 */
async function create(req, res, next) {
    const data = {
        first_name: res.locals.first_name,
        last_name: res.locals.last_name,
        mobile_number: res.locals.mobile_number,
        reservation_date: res.locals.reservation_date,
        reservation_time: res.locals.reservation_time,
        people: res.locals.people,
    };
    const response = await reservationsService.create(data);
    res.status(201).json({ data: response });
}

/**
 * Date query validaiton
 */
async function dateExists(req, res, next) {
    const date = req.query.date ? req.query.date : today();
    res.locals.date = date;
    next();
}

/**
 * Reservation_id query validation
 */
async function reservationIdExists(req, res, next) {
    const { reservation_id } = req.params;
    const response = await reservationsService.readById(reservation_id);
    if (response[0]) {
        res.locals.reservation = response[0];
        res.locals.reservation_id = response[0].reservation_id;
        return next();
    }
    next({
        message: `Reservation for reservation_id ${reservation_id} does not exist`,
        status: 400
    })
}

/**
 * Read handler for a single reservation by date
 * @returns {[]} Array of reservations : Empty array
 */
async function read(req, res, next) {
    const response = await reservationsService.read(res.locals.date);
    res.status(200).json({ data: response });
}

/**
 * Read handler for a single reservation by reservation_id
 * @returns {[]} Single reservation : Empty array
 */
async function readReservationId(req, res, next) {
    const reservation = res.locals.reservation;
    res.status(200).json({data: reservation})
}

module.exports = {
    create: [
        asyncErrorBoundary(propertiesExist),
        asyncErrorBoundary(validFirstName),
        asyncErrorBoundary(validLastName),
        asyncErrorBoundary(validPhone),
        asyncErrorBoundary(validDate),
        asyncErrorBoundary(validTime),
        asyncErrorBoundary(validDateTime),
        asyncErrorBoundary(validPeople),
        asyncErrorBoundary(create),
    ],
    read: [dateExists, asyncErrorBoundary(read)],
    readId: [
        asyncErrorBoundary(reservationIdExists),
        asyncErrorBoundary(readReservationId),
    ],
};
