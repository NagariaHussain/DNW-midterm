// Module imports
const express = require("express"); // Express Server
const bodyParser = require("body-parser"); // For parsing POST form data
const mysql = require("mysql"); // MySQL Driver

// Create instance of express app
const app = express();

// Port number for the 
// server to listen on
const PORT = 8089;

// Prepare MySQL connection configuration
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hussain@183",
    port: 3306,
    database: "food_db"
});

// Connect to database
db.connect((err) => {
    if (err) {
        // Log the error
        console.log(err);
        // Stop the current node process
        process.exit(1);
    }
});

// Attach the variable to 
// global scope
global.db = db;

// Express app configuration
// Setting the views directory
app.set("views", __dirname + "/views");
// Setting up ejs as the view engine
app.set("view engine", "ejs");

// For handling flash messages
app.set('message', null);

// Middleware functions
// For parsing POST request body
app.use(bodyParser.urlencoded({ extended: true }));

// Handling routes
require("./routes/main")(app);

// Starting the web server
// and listening on port `PORT`
app.listen(
    PORT, 
    () => console.log(`CalorieBuddy app listening on port ${PORT}!`)
);