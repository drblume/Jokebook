const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/jokebook.db');

// Get all categories
exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT name FROM categories', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(row => row.name));
    });
  });
};

// Get jokes from a specific category with optional limit
exports.getJokesByCategory = (category, limit) => {
  return new Promise((resolve, reject) => {
    const categoryQuery = `SELECT id FROM categories WHERE name = ?`;
    db.get(categoryQuery, [category], (err, catRow) => {
      if (err) return reject(err);
      if (!catRow) return resolve(null);

      const jokeQuery = `SELECT setup, delivery FROM jokes WHERE category_id = ? ${limit ? 'LIMIT ?' : ''}`;
      const params = limit ? [catRow.id, limit] : [catRow.id];

      db.all(jokeQuery, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });
};

// Get a random joke
exports.getRandomJoke = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT setup, delivery FROM jokes
      ORDER BY RANDOM()
      LIMIT 1
    `;
    db.get(query, [], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Add a new joke
exports.addJoke = (category, setup, delivery) => {
  return new Promise((resolve, reject) => {
    const findCategory = `SELECT id FROM categories WHERE name = ?`;
    db.get(findCategory, [category], (err, catRow) => {
      if (err) return reject(err);
      if (!catRow) return reject({ message: 'Invalid category.' });

      const insertJoke = `INSERT INTO jokes (category_id, setup, delivery) VALUES (?, ?, ?)`;
      db.run(insertJoke, [catRow.id, setup, delivery], function (err) {
        if (err) return reject(err);

        // Return updated joke list for the category
        const updatedQuery = `SELECT setup, delivery FROM jokes WHERE category_id = ?`;
        db.all(updatedQuery, [catRow.id], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    });
  });
};

exports.createCategoryWithJokes = (categoryName, jokesArray) => {
    return new Promise((resolve, reject) => {
      const insertCategory = `INSERT INTO categories (name) VALUES (?)`;
  
      db.run(insertCategory, [categoryName], function (err) {
        if (err) return reject(err);
  
        const categoryId = this.lastID;
        const stmt = db.prepare(`INSERT INTO jokes (category_id, setup, delivery) VALUES (?, ?, ?)`);
  
        jokesArray.forEach(joke => {
          stmt.run(categoryId, joke.setup, joke.delivery);
        });
  
        stmt.finalize((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  };
  
