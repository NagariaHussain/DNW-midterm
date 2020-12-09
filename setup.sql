-- CREATE DATABASE food_db;

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

-- INSERT INTO foods VALUES ("flour", 100, "gram", 381, 81, 1.4, 9.1, 0.01, 0.6);

INSERT INTO foods VALUES ("apple", 1, "kilogram", 0.1, 0.2, 1.90, 10, 50.5, 9.8);


