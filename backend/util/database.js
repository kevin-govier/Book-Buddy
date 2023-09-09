const sqlite3 = require('sqlite3').verbose();

const dbName = 'user-info.db';

// Sets up SQLite database
const db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database:', dbName);
  }
});

// Creates the database tables if they haven't already been created
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS reviews (
      bookId TEXT NOT NULL,
      bookTitle TEXT NOT NULL,
      bookCover TEXT NOT NULL,
      bookDate TEXT NOT NULL,
      body TEXT NOT NULL,
      rating INTEGER NOT NULL,
      user INTEGER NOT NULL,
      date TEXT NOT NULL
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS readinglist (
      bookId TEXT NOT NULL,
      bookTitle TEXT NOT NULL,
      bookCover TEXT NOT NULL,
      bookDate TEXT NOT NULL,
      user TEXT NOT NULL
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS collection (
      bookId TEXT NOT NULL,
      bookTitle TEXT NOT NULL,
      bookCover TEXT NOT NULL,
      bookDate TEXT NOT NULL,
      user TEXT NOT NULL
    )`
  );
});

module.exports = db;