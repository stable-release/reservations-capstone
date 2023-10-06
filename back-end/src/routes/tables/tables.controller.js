const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");
const hasProperties = require("../../errors/hasProperties");
const today = require("../../utils/today");
const { addZero } = require("../../utils/addZero");

/**
 * Property validation containing only VALID_PROPERTIES for create
 */
const VALID_PROPERTIES = ["table_name", "capacity"];

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
    res.locals.table_name = data.table_name;
    res.locals.capacity = data.capacity;
    res.locals.reservation_id = data.reservation_id ? data.reservation_id : null;
    next();
}

/**
 * Validation for table_name property
 */
async function validTableName(req, res, next) {
    const table_name = res.locals.table_name;
    if (table_name.length <= 1) {
        return next({
            message: `Property table_name ${table_name} must be longer than 1 character`,
            status: 400,
        })
    }
    next();
}

/**
 * Validation for capacity property
 */
async function validCapacity(req, res, next) {
    const capacity = res.locals.capacity;
    if (!capacity) {
        return next({
            message: "Property capacity must be greater than zero",
            status: 400,
        })
    }

    if (typeof capacity !== "number") {
        return next({
            message: "Property capacity must be a number",
            status: 400,
        })
    }

    next();
}

/**
 * Validation to check if table_id paramter is valid
 */
async function tableExists(req, res, next) {
    const { table_id } = req.params;
    const response = await tablesService.read(table_id);
    if (response[0]) {
        res.locals.table = response[0];
        res.locals.table_id = response[0].table_id;
        return next();
    }
    next({
        message: `table_id ${table_id} not found`,
        status: 404,
    });
}

/**
 * Validation to check if reservation_id property exists and is valid
 */
async function reservationExists(req, res, next) {
    const { data: { reservation_id } = {} } = req.body;
    if (!reservation_id) {
        return next({
            message: "Property reservation_id required",
            status: 400,
        });
    }

    const response = await tablesService.readReservation(reservation_id);
    if (response[0]) {
        res.locals.reservation = response[0];
        res.locals.reservation_id = response[0].reservation_id;
        return next();
    }

    next({
        message: `Reservation ${reservation_id} does not exist`,
        status: 404,
    });
}

/**
 * Validation to check if the table capacity is available
 * and enough to accommodate reservation people number
 */
async function isAvailable(req, res, next) {
    const table = res.locals.table;
    const reservation = res.locals.reservation;

    // Are seats available?
    if (table.reservation_id) {
        return next({
            message: `Seats occupied for table_id ${table.table_id}`,
            status: 400,
        });
    }

    // Are seats enough capacity?
    if (parseInt(table.capacity) < parseInt(reservation.people)) {
        return next({
            message: `Seats for table_id ${table.table_id} does not have sufficient capacity`,
            status: 400,
        });
    }

    next();
}

/**
 * Creates a new table that returns table created
 * @returns {table}
 */
async function create(req, res, next) {
    const data = {
        table_name: res.locals.table_name,
        capacity: res.locals.capacity,
        reservation_id: res.locals.reservation_id
    }
    const response = await tablesService.create(data);
    res.status(201).json({data: response});
}

async function read(req, res, next) {
    const table = res.locals.table;
    res.status(201).json(table);
}

/**
 * Sets reservation_id for table
 */
async function update(req, res, next) {
    const table_id = res.locals.table.table_id;
    const reservation_id = res.locals.reservation.reservation_id;
    const response = await tablesService.update(table_id, reservation_id);
    res.status(200).json(response);
}

/**
 * Deletes reservation with table_id
 */
async function del(req, res, next) {
    // Return error if seats are unoccupied
    const table = res.locals.table;
    if (!table.reservation_id) {
        return next({
            message: `Seats not occupied for table_id ${table.table_id}`,
            status: 400,
        });
    }

    // Try deleting reservation
    const table_id = res.locals.table_id;
    const response = await tablesService.del(table_id);
    if (response) {
        res.sendStatus(200);
    }
}

/**
 * Lists out all entries in tables sorted by table name
 */
async function list(req, res, next) {
    const data = await tablesService.list();
    res.json({ data });
}

module.exports = {
    create: [asyncErrorBoundary(propertiesExist),
        asyncErrorBoundary(validTableName),
        asyncErrorBoundary(validCapacity),
        asyncErrorBoundary(create),
    ],
    read: [asyncErrorBoundary(tableExists), read],
    update: [
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(isAvailable),
        asyncErrorBoundary(update),
    ],
    delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(del)],
    list: [asyncErrorBoundary(list)],
};
