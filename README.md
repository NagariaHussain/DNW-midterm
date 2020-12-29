# DNW-midterm: Report

# Introduction

I started off by setting up the database by analysing the given requirements. I created the `foods` table and also inserted some sample data in order to test it. The SQL queries for creating the database and table schema can be found in the [Database Schema](#database-schema) section and also in the `setup.sql` file in the source code directory. I have used the open source [Primer CSS](https://primer.style/css/) framework by GitHub for styling my web pages and [VueJS](https://v3.vuejs.org/), an open source JavaScript framework to add interactivity to the food lists page. More information on how the requirements are satisfied is provided in the section that follows.

# Requirements

## R1

### R1A


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
