const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");
const hasProperties = require("../../errors/hasProperties");
const today = require("../../utils/today");

/**
 * Property validation containing only VALID_PROPERTIES
 */
const VALID_PROPERTIES = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
];

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;

    const invalidFields = Object.keys(data).filter(
        (field) => !VALID_PROPERTIES.includes(field)
    );

    if (invalidFields.length)
        return next({
            status: 400,
            message: `Invalid field(s): ${invalidFields.join(", ")}`,
        });
    next();
}

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
        })
    }
    if (Date.now() >= d.getTime()) {
        return next({
            message: "Reservation must be in the future",
            status: 400,
        })
    }

    const f = new Date(`${res.locals.reservation_date}T${res.locals.reservation_time}`);

    const morning_minimum = new Date(`${res.locals.reservation_date}T10:30`);

    if (f.getTime() < morning_minimum.getTime()) {
        return next({
            message: "We open at 10:30 AM",
            status: 400,
        })
    }

    const evening_maximum = new Date(`${res.locals.reservation_date}T21:30`);

    if (f.getTime() > evening_maximum.getTime()) {
        return next({
            message: "Our kitchen closes at 9:30 PM",
            status: 400,
        })
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
    const { data } = req.body;
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
 * Read handler for a single reservation
 * @returns Array of reservations : Empty array
 */
async function read(req, res, next) {
    const response = await reservationsService.read(res.locals.date);
    res.status(200).json({ data: response });
}

module.exports = {
    create: [
        hasOnlyValidProperties,
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
};
