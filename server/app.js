const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ success: true, data: { status: "ok" } }));

app.use("/api/auth", require("./controllers/authController"));
app.use("/api/users", require("./controllers/userController"));
app.use("/api/leads", require("./controllers/leadController"));
app.use("/api/areas", require("./controllers/areaController"));
app.use("/api/dashboard", require("./controllers/dashboardController"));

app.use((req, res) => res.status(404).json({ success: false, message: "Not found" }));

app.use(errorHandler);

module.exports = app;
