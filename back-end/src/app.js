const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");

// Uncomment for development logging
// const logger = require("./utils/logger");
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

const reservationsRouter = require("./routes/reservations/reservations.router");
const tablesRouter = require("./routes/tables/tables.router");

const app = express();

// Uncomment for development logging
// app.use(logger);
app.use(express.json());

app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
