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


    // Catch all route for 404 page
    app.get('*', (req, res) => {
        res.status(404).send("404 page goes here!");
    });
};