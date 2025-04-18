-- Drop tables if they exist (for resetting during development)
DROP TABLE IF EXISTS jokes;
DROP TABLE IF EXISTS categories;

-- Create categories table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
);

-- Create jokes table
CREATE TABLE jokes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    setup TEXT NOT NULL,
    delivery TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert categories
INSERT INTO categories (name) VALUES ('funnyJoke'), ('lameJoke');

-- Insert jokes for funnyJoke (category_id = 1)
INSERT INTO jokes (category_id, setup, delivery) VALUES
(1, 'Why did the student eat his homework?', 'Because the teacher told him it was a piece of cake!'),
(1, 'What kind of tree fits in your hand?', 'A palm tree'),
(1, 'What is worse than raining cats and dogs?', 'Hailing taxis');

-- Insert jokes for lameJoke (category_id = 2)
INSERT INTO jokes (category_id, setup, delivery) VALUES
(2, 'Which bear is the most condescending?', 'Pan-DUH'),
(2, 'What would the Terminator be called in his retirement?', 'The Exterminator');
