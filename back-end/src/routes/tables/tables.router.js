/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const cors = require("cors");
const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../../errors/methodNotAllowed");

router.route("/").all(cors()).get(controller.list).post(controller.create).all(methodNotAllowed);
router.route("/:table_id").all(cors()).get(controller.read).all(methodNotAllowed);
router.route("/:table_id/seat").all(cors()).put(controller.update).all(methodNotAllowed);

module.exports = router;
