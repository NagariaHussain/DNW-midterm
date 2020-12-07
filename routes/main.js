// Export function to handle routing
module.exports = function(app) {
    // Index route
    app.get('/', (req, res) => {
        res.render("index");
    });


    // Catch all route for 404 page
    app.get('*', (req, res) => {
        res.status(404).send("404 page goes here!");
    });
};