const knex = require("../../db/connection");

/**
 * 
 * @param {FormData} data 
 * Creates a new reservation
 */
async function create(data) {
    return knex("reservations").insert(data).returning("*").then((reservations) => reservations[0]);
}

/**
 * 
 * @param {Date} date of reservation 
 * Searches all matches with date of reservation
 */
async function read(date) {
    return knex("reservations").select("*").where("reservation_date", date).whereNot("status", "finished").orderBy("reservation_time");
}

/**
 * 
 * @param {Number} reservation_id
 * Searches for single reservation by reservation_id
 */
async function readById(reservation_id) {
    return knex("reservations").select("*").where("reservation_id", reservation_id);
}

async function update(reservation_id, status) {
    return knex("reservations").where("reservation_id", reservation_id).update("status", status);
}

/**
 * Lists out all reservations
 */
async function list() {
    return knex("reservations").select("*");
}

module.exports = {
    create,
    read,
    readById,
    update,
    list
}