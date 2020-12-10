// Utility function to convert req body into an Array
function convertToArray(reqBody) {
    return [
        reqBody.food_name, 
        parseFloat(reqBody.typical_value),
        reqBody.typical_value_unit,
        parseFloat(reqBody.calories),
        parseFloat(reqBody.carbs),
        parseFloat(reqBody.fats),
        parseFloat(reqBody.proteins),
        parseFloat(reqBody.salt),
        parseFloat(reqBody.sugar)
    ];
}
// Export function to handle routing
module.exports = function(app) {
    // Index route
    app.get('/', (req, res) => {
        return res.render("index");
    });

    app.get('/add', (req, res) => {
        return res.render("add_food");
    });

    app.post('/add', (req, res) => {
        // SQL INSERT statement to add row to foods table
        const insert_statement = "INSERT INTO foods VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        // Convert request body to Array 
        // suitable to pass to mysql driver
        const food_data = convertToArray(req.body);

        // Query the database with data and statment
        db.query(insert_statement, food_data, (err) => {
            // If an error occurs
            if (err) {
                // Set status to 500 (Internal Server Error)
                res.status(500).send("Something went wrong with the database.");
            }

            // No errors
            // redirect the user to list page
            // TODO: Show a success message (using a success page maybe?)
            return res.redirect("/foods");
        });
    });

    app.get('/search', (req, res) => {
        return res.render("search");
    });

    app.get('/about', (req, res) => {
        return res.render("about");
    });

    app.get('/foods', (req, res) => {
        // Select all foods with 
        // all columns from the database
        const sql_command = "SELECT * FROM foods";

        // Query the database
        db.query(sql_command, (err, foods) => {
            // Error occurs while performing queries
            if (err) {
                // Respond with Internal Server Error
                res.status(500).send("Internal Server Error");
            }

            // Everything went well
            // Render food list page with the data
            // from the database
            return res.render("list_food", {foods: foods});
        });
    }); 


    // Catch all route for 404 page
    // 404 page by: https://codepen.io/Tibixx/pen/GRKmppz
    app.get('*', (req, res) => {
        return res.status(404).render("404");
    });
};