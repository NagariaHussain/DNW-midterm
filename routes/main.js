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

    // Search page route
    // Returns a HTML page with 
    // search form field
    app.get('/search', (req, res) => {
        // render the search page
        return res.render("search");
    });


    // Search Database route
    // Uses the req's query paramater "keyword" to
    // search the database and returns HTML 
    // page containing search results
    app.get('/search_db', (req, res) => {
        // SQL command to select all columns for rows 
        // whose name column matches the given search keyword
        const sql_command = "SELECT * FROM foods WHERE REGEXP_LIKE(name, ?, 'i')";

        // Search keyword/name
        const key = req.query.keyword;
        db.query(sql_command, [key], (err, results) => {
            // If an error occurs
            if (err) {
                // Set response status code to 500
                // Send a message to the client
                res.status(500).send("Something went wrong.");
            }
            
            // No error occured
            // Render "results.ejs" page with given result 
            // data from the database
            return res.render("results", {queryString: key, foods: results})
        });
       
    });

    // About route
    // Render the about page HTML template
    app.get('/about', (req, res) => {
        return res.render("about");
    });

    // List foods route
    // Returns a page containing a list of 
    // all the food items in the database
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
            return res.render("list_food", {foods: foods, flashMessage: null});
        });
    }); 


    app.get("/update/:name", (req, res) => {
        const food_name = req.params.name;
        const sql_query = "SELECT * FROM foods WHERE name = ?";

        db.query(sql_query, [food_name], (err, foodItem) =>  {
            if (err) {
                res.status(500).send("Something went wrong!");
            }
            console.log(foodItem[0]);
            return res.render("update_food", {food: foodItem[0]});
        });
    });

    app.post("/update/:name", (req, res) => {
        const food_name = req.params.name;
        const sql_query = "UPDATE foods SET name = ?, typical_values_per = ?, unit_of_tvp = ?, calories = ?, carbs = ?, fats = ?, proteins = ?, salt = ?, sugar = ? WHERE name = ?";
        
        // Convert request body to Array 
        // suitable to pass to mysql driver
        const food_data = convertToArray(req.body);

        food_data.push(food_name);

        db.query(sql_query, food_data, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Something went wrong while updating db.");
            }

            return res.redirect("/foods");
        });
    });

    app.get("/delete/:name", (req, res) => {
        const food_name = req.params.name;
        const sql_query = "DELETE FROM foods WHERE name = ?";


        db.query(sql_query, [food_name], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Something went wrong while deleting record from database");
            }

            return res.redirect("/foods");
        });
    });

    // Catch all route for 404 page
    // 404 page by: https://codepen.io/Tibixx/pen/GRKmppz
    app.get('*', (req, res) => {
        return res.status(404).render("404");
    });
};