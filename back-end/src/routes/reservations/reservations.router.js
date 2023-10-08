/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const cors = require("cors");
const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../../errors/methodNotAllowed");

router.route("/").all(cors()).get(controller.read).post(controller.create).all(methodNotAllowed);
router.route("/:reservation_id").all(cors()).get(controller.readId).put(controller.updateReservation).all(methodNotAllowed);
router.route("/:reservation_id/status").all(cors()).put(controller.update).all(methodNotAllowed);

module.exports = router;
