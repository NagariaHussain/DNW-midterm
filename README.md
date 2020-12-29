# DNW-midterm: Report

# Introduction

I started off by setting up the database by analysing the given requirements. I created the `foods` table and also inserted some sample data in order to test it. The SQL queries for creating the database and table schema can be found in the [Database Schema](#database-schema) section and also in the `setup.sql` file in the source code directory. I have used the open source [Primer CSS](https://primer.style/css/) framework by GitHub for styling my web pages and [VueJS](https://v3.vuejs.org/), an open source JavaScript framework to add interactivity to the food lists page. More information on how the requirements are satisfied is provided in the section that follows.

# Requirements

## R1: Home Page

I have added a home page that is rendered (`view/index.ejs`) when the user goes to the base route (i.e. '/'). This page contains two major parts:

1. A navigation bar containing the name of the application (`R1A`) and links to other pages (`R1B`). The markup for the navigation bar is placed in a separate template file (`view/header.ejs`) because it is used in every page. This reduces code repetition, since, we can use the `include` function to include this template code in any other template file like this:

```javascript
<%- include('header'); -%>
```

2. A [blankstate](https://primer.style/css/components/blankslate) prompting the user to start using the application by adding a new food to the database.

![Image](./report/home_page.png)


## R2: About Page

This page can be accessed by visiting the '`/about`' route. The `about.ejs` template gets rendered on recieving a `GET` request at this route.

 (R2A) This page shows a small summary of the web application's purpose, my name as a developer and the stack of technologies used (using some colorful span backgrounds). Also, there is a navigation bar with links to all other pages.

## R3: Add Food Page

This page contains a form with the following feilds to add a food item to the database:

* Food Name
* Typical Values Per
* Unit of Typical Values
* Calories
* Carbs
* Fats
* Protein
* Salt
* Sugar

There are two buttons: one to add the item to the database (`Add to Database`) and a second button (`clear`) to clear all the form feilds.

This page (rendered using the '`views/add_food.ejs`' template) can be accessed either by clicking the '`Add`' link in the navbar or by sending a `GET` request to the '`/add`' route. A navibar is present to let the user navigate the site easily. (R3A)

Once the user clicks the `Add to Database` button (or in other words, submits the form), the form data is sent to the server via a `POST` request to '`/add`' route.

On the server side, the data is accessed through the `request` object's body property and is converted into an array (in suitable order) for passing it to the `mysql` driver's `query` method. The conversion has been extracted into a function named `convertToArray` which takes `request.body` as paramter and returns a JavaScript Array containing values for different columns of the `foods` table. This function uses the `parseFloat` function of JavaScript to convert the string values into suitable format and it can be found at the top of the '`routes/main.js`' file.

Finally, the query method is called on the database object to `INSERT` a row in the database with the given values (R3B):

```javascript
const insert_statement = "INSERT INTO foods VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

// ...

// Query the database with data and statement
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
    // ...
}
```

If some error occurs while performing the insert operation, the status code of the response is set to `500` and a short message is sent to the client notifying them about the error. If there are no errors, then a 'message' is set on the app instance about the successful addition of the given food item to the database and the user is redirected to the lists page. The message is then retrieved on the list page's route handler and displayed to the user (R3C).

## R4: Search Food Page

...

# Database Schema

## Creating of Database

I have given the name `food_db` to the database:

```sql
CREATE DATABASE food_db;
```

## Tables
For this project only one table was sufficient, which I have named `foods`. According to the given data to store in the database, I used the following following table definition:

```sql
CREATE TABLE IF NOT EXISTS foods(
	name VARCHAR(255) PRIMARY KEY,
    typical_values_per NUMERIC(6, 2)  DEFAULT 100,
    unit_of_tvp VARCHAR(100) DEFAULT "gram",
    calories NUMERIC(6, 2) DEFAULT 0,
    carbs NUMERIC(6, 2) DEFAULT 0,    
    fats NUMERIC(6, 2) DEFAULT 0,
	proteins NUMERIC(6, 2) DEFAULT 0,
    salt NUMERIC(6, 2) DEFAULT 0,
    sugar NUMERIC(6, 2) DEFAULT 0
);
```

The data types and feild names can be seen in the above SQL statement.
I choose `name` as the primary key because no two food items can have exactly the same name, otherwise, it would cause ambiguity for the user.

Also, I have provided default values for all the nutritional values, so that if they are not specified, they can be assumed to be 0. The default unit of typical values is "gram" and its default amount is 100.

# Summary

Overall, this project helped me to practice all of the concepts learned up till now in this module. The "Going beyond" requirements also tested and revised my knowledge learned in the `Web Development` module of Level 4.
