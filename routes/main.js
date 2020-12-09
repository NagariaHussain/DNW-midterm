// Export function to handle routing
module.exports = function(app) {
    // Index route
    app.get('/', (req, res) => {
        res.render("index");
    });

    app.get('/add', (req, res) => {
        res.render("add_food");
    });

    app.get('/search', (req, res) => {
        res.render("search");
    });

    app.get('/about', (req, res) => {
        res.render("about");
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
            res.render("list_food", {foods: foods});
        });
    }); 


    // Catch all route for 404 page
    app.get('*', (req, res) => {
        res.status(404).send("404 page goes here!");
    });
};