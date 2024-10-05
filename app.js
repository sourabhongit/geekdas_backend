require('dotenv').config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const ConnectDB = require('./Config/database');
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

// View enginea
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up session management
app.use(
	session({
		secret: "yourSecretKey",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false }, // Note: Set secure to true in production with HTTPS
	})
);

// Static assets
app.use(express.static(path.join(__dirname, "Public")));
app.use(cors({ origin: "http://localhost:3000" }));

// Set views
app.set("views", path.join(__dirname, "./Views"));

// Database
ConnectDB();

// Routes
app.use("/admin", require("./Routes/AdminRoutes/AdminRoutes"));
app.use("/admin/auth", require("./Routes/AuthRoutes/AuthRoutes"));

let port = process.env.PORT;
if (port == null || port == "") {
	port = 3001;
}

app.listen(port, function () {
	console.log("Server started successfully on", { port });
});
