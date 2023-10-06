const knex = require("../../db/connection");

/**
 *
 * @param {table} data
 * Creates a new table entry
 */
async function create(data) {
    return knex("tables")
        .insert(data)
        .returning("*")
        .then((tables) => tables[0]);
}

/**
 * 
 * @param {Number} table_id
 * Returns the table matching table_id
 */
async function read(table_id) {
    return knex("tables").select("*").where("table_id", table_id).orderBy("reservation_id");
}

/**
 * 
 * @param {Number} reservation_id
 * Returns the reservation matching reservation_id
 */
async function readReservation(reservation_id) {
    return knex("reservations").select("*").where("reservation_id", reservation_id).orderBy("reservation_id");
}

/**
 * 
 * @param {Number} table_id 
 * Updates table matching table_id
 */
async function update(table_id, reservation_id) {
    return knex("tables").where("table_id", table_id).update("reservation_id", reservation_id);
}

/**
 * Lists out all tables
 */
async function list() {
    return knex("tables").select("*").orderBy("table_name");
}


module.exports = {
    create,
    read,
    readReservation,
    update,
    list,
};
