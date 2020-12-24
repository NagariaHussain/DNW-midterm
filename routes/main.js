// Utility function to convert req body into an Array
// Used while passing data to mysql queries
function convertToArray(reqBody) {
    // Return as Array after parsing request body data
    // to correct data types and correct position
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

// To calculate total nutritional information
// Used for calculating recipe summaries
// Parameters:
// i.  `results`: Query results from mysql 
// ii. `selected_foods`: Map containing foodname, qty pairs
// for foods selected by the user 
function getCalculatedResults(results, selected_foods) {
    // For storing calculation of each 
    // type of nutritional value
    let calculated = {
        calories: 0,
        carbs: 0,
        fats: 0,
        proteins: 0,
        salt: 0,
        sugar: 0
    };

    // Iterating over each result `row` from mysql database
    for (let i = 0; i < results.length; i++) {
        // Getting the current row
        const current_food = results[i];
        // Getting the quantity of the current food
        // Selected by the user
        const qty = selected_foods.get(current_food["name"]);

        // Iterate over each nutritional value 
        for (let nutrition in calculated) {
            // Calculate and store the nutritional value
            calculated[nutrition] += qty * current_food[nutrition];
        }
    }

    // return the result (object) of the calculation
    return calculated;
}

// Export function to handle routing
module.exports = function(app) {
    // GET /
    // Renders home page of the application
    app.get('/', (req, res) => {
        // render "index.ejs" template
        return res.render("index");
    });

    
    // GET /about
    // Render the about page HTML template
    app.get('/about', (req, res) => {
        return res.render("about");
    });


    // GET /add
    // Renders the add food page  
    app.get('/add', (req, res) => {
        // render "add_food.ejs" containing a form
        return res.render("add_food");
    });


    // POST /add
    // Gets food data and adds the food to the database
    // redirects to '/foods' after successful operation
    // or returns 500 code if failure
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
            // Set flash message
            req.app.set(
                'message', 
                `"${food_data[0]}" successfully added to database`
            );

            // redirect the user to list page
            return res.redirect("/foods");
        });
    });


    // GET /search
    // Returns a HTML page with 
    // search form field
    app.get('/search', (req, res) => {
        // render the "search.ejs" template
        return res.render("search");
    });


    // GET /search_db
    // Uses the req's query paramater "keyword" to
    // search the database and returns HTML 
    // page containing search results
    app.get('/search_db', (req, res) => {
        // SQL command to select all columns for rows 
        // whose name column matches the given search keyword
        const sql_command = "SELECT * FROM foods WHERE REGEXP_LIKE(name, ?, 'i')";

        // Search keyword/name
        const key = req.query.keyword;

        // Run the SQL query
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
            return res.render(
                "results", 
                {queryString: key, foods: results}
            );
        });
       
    });


    // GET /foods
    // Returns a page containing a list of 
    // all the food items in the database
    app.get('/foods', (req, res) => {
        // Get any flash messages if any
        const flashMessage = req.app.get('message');

        // Remove any flash messages
        req.app.set('message', null);

        // SQL query to select all foods with 
        // all columns from the database
        // sorted by the `name` column
        const sql_command = "SELECT * FROM foods ORDER BY name";

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
            return res.render(
                "list_food", 
                {foods, flashMessage}
            );
        });
    }); 


    // GET /update/:name
    // returns a page containing all the data about the
    // food having the `name` in a prepopulated form
    app.get("/update/:name", (req, res) => {
        // Get `name` from query parameter
        const food_name = req.params.name;

        // SQL statement to select the 
        // food item having the given name
        const sql_query = "SELECT * FROM foods WHERE name = ?";

        // Run the SQL query
        db.query(sql_query, [food_name], (err, foodItem) =>  {
            // If any error occurs
            if (err) {
                // Set status code to 500
                // and return a message to user
                res.status(500).send("Something went wrong!");
            }

            // No error 
            // If any food item was not found with the given name
            if (foodItem.length == 0) {
                // Set a flash message
                req.app.set('message', `"${food_name}" not found!`);
                // redirect the user to list page
                return res.redirect("/foods");
            }

            // Everything went well
            // render the "update_food.ejs" template 
            // with the food data from database
            return res.render("update_food", {food: foodItem[0]});
        });
    });


    // POST /update/:name
    // Updates the food having the name `name` 
    // with the data in the request body
    app.post("/update/:name", (req, res) => {
        // Get `name` from query parameter
        const food_name = req.params.name;

        // SQL UPDATE statement to update the food
        // with given name with provided values
        const sql_query = "UPDATE foods SET name = ?, typical_values_per = ?, unit_of_tvp = ?, calories = ?, carbs = ?, fats = ?, proteins = ?, salt = ?, sugar = ? WHERE name = ?";
        
        // Convert request body to Array 
        // suitable to pass to mysql driver
        const food_data = convertToArray(req.body);

        // Add food name to food_data array
        food_data.push(food_name);

        // Run the SQL query with given data
        db.query(sql_query, food_data, (err) => {
            // If an error occurs
            if (err) {
                // Log it to the console
                console.log(err);
                // Set status code to 500 and 
                // send a message to the client
                return res.status(500)
                          .send("Something went wrong while updating db.");
            }

            // Set a flash message
            req.app.set('message', `"${food_name}" updated successfully`);
            // Redirect to list page
            return res.redirect("/foods");
        });
    });


    // GET /delete/:name
    // Deletes the food having the name `name`
    // if it exists and redirects to /foods
    // Shows a message after successful deletion
    // or food not exists for deletion
    app.get("/delete/:name", (req, res) => {
        // Get `name` from query parameter
        const food_name = req.params.name;

        // SQL DELETE statement to delete rows 
        // where name is the given value
        const sql_query = "DELETE FROM foods WHERE name = ?";

        // Run the SQL query
        db.query(sql_query, [food_name], (err) => {
            // If any error occurs
            if (err) {
                // Log the error to the console
                console.log(err);

                // Set status code to 500 and 
                // send a message to the client
                return res.status(500)
                          .send("Something went wrong while deleting record from database");
            }
            
            // Set a flash message
            req.app.set('message', `"${food_name}" successfully deleted`);

            // Redirect the user to food list page
            return res.redirect("/foods");
        });
    });


    // GET /calculate
    // Gets food name and quantity for various foods 
    // in a recipe  for diet calculation
    // Renders a results page with calculated values
    app.get("/calculate", (req, res) => {
        // To store name and qty of food items for calculation
        const selected_foods = new Map();

        // To store the name of all the selected
        // food items 
        const selected_food_names = [];

        // Store name and quantity of selected food items 
        // as an object in an Array
        for (let food of Object.keys(req.query)) {
            // Add `food`, `qty` key-value pair to the map
            selected_foods.set(food, parseInt(req.query[food]));
            // Push this name to food names Array
            selected_food_names.push(food);
        }

        // SQL query to get the rows for selected food items
        const sql_query = "SELECT * FROM foods WHERE name IN (?)";

        // Execute the query
        db.query(sql_query, [selected_food_names], (err, results) => {
            // If some error occurs
            if (err) {
                // Log the error
                console.log(err);
                // Set status code to 500 and 
                // send a message to the client
                return res.status(500).send("Something went wrong!");
            }
            
            // Perform calculation and store the result
            const total = getCalculatedResults(results, selected_foods);

            // Return a HTML Report ("report.ejs") 
            // with the calculated data
            return res.render(
                "report", 
                {report: total, unit: results[0].unit_of_tvp}
            );
        });
    });

    // Catch all route for 404 page
    // 404 page by: https://codepen.io/Tibixx/pen/GRKmppz
    app.get('*', (req, res) => {
        // Set status to 404
        // and render the 404.ejs page
        return res.status(404).render("404");
    });
};