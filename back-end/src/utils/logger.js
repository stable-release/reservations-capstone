const path = require("path");
const { nanoid } = require("nanoid");
const pinoHttp = require("pino-http");
const pino = require('pino');

const level = process.env.LOG_LEVEL || "trace";

const nodeEnv = process.env.NODE_ENV || "development";
const prettyPrint = nodeEnv === "development";
const destination = pino.destination(path.join(__dirname, "..", "logs", "server.log"));

const logger = pinoHttp(
    {
        genReqId: (request) => request.headers["x-request-id"] || nanoid(),
        level,
        prettyPrint,
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    destination
);

module.exports = logger;
