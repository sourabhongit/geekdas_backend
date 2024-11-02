require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ConnectDB = require("./Config/database");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const session = require('./Config/session');
const ListEndpoints = require("express-list-endpoints");

// View engine setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static assets
app.use(express.static(path.join(__dirname, "Public")));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));

// Set views
app.set("views", path.join(__dirname, "./Views"));

// Database connection
ConnectDB();

// Session config
app.use(session);

// Routes
app.use("/admin", require("./Routes/AdminRoutes/AdminRoutes"));
app.use("/admin/auth", require("./Routes/AuthRoutes/AuthRoutes"));

// List all the routes in console
console.log(ListEndpoints(app));

let port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log(`Server started successfully on port ${port}`);
});
