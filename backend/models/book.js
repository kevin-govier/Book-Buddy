const db = require('../util/database');

module.exports = class Book {
  constructor(bookId, bookTitle, bookCover, user) {
    this.bookId = bookId;
    this.bookTitle = bookTitle;
    this.bookCover = bookCover;
    this.user = user;
  }

  static fetchAllReadingList(user) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM readinglist WHERE user = ?', [user], (err, rows) => {
        if (err) {
          reject(err);
        } 
        else {
          resolve(rows);
        }
      });
    });
  }

  static fetchAllCollection(user) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM collection WHERE user = ?', [user], (err, rows) => {
        if (err) {
          reject(err);
        } 
        else {
          resolve(rows);
        }
      });
    });
  }

  static saveToReadingList(book) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO readinglist (bookId, bookTitle, bookCover, bookDate, user) VALUES (?, ?, ?, ?, ?)',
        [book.bookId, book.bookTitle, book.bookCover, book.bookDate, book.user],
        (err) => {
          if (err) {
            reject(err);
          } 
          else {
            resolve();
          }
        }
      );
    });
  }

  static saveToCollection(book) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO collection (bookId, bookTitle, bookCover, bookDate, user) VALUES (?, ?, ?, ?, ?)',
        [book.bookId, book.bookTitle, book.bookCover, book.bookDate, book.user],
        (err) => {
          if (err) {
            reject(err);
          } 
          else {
            resolve();
          }
        }
      );
    });
  }

  static deleteFromReadingList(bookId, user) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM readinglist WHERE bookId = ? AND user = ?', [bookId, user], (err) => {
        if (err) {
          reject(err);
        } 
        else {
          resolve();
        }
      });
    });
  }

  static deleteFromCollection(bookId, user) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM collection WHERE bookId = ? AND user = ?', [bookId, user], (err) => {
        if (err) {
          reject(err);
        } 
        else {
          resolve();
        }
      });
    });
  }

  static findFromReadingList(bookId, user) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM readinglist WHERE bookId = ? AND user = ?', [bookId, user], (err, row) => {
        if (err) {
          reject(err);
        } 
        else {
          resolve(row);
        }
      });
    });
  }

  static findFromCollection(bookId, user) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM collection WHERE bookId = ? AND user = ?', [bookId, user], (err, row) => {
        if (err) {
          reject(err);
        } 
        else {
          resolve(row);
        }
      });
    });
  }
};