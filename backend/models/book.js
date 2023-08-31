const db = require('../util/database');

module.exports = class Book {
    constructor(bookId, bookTitle, bookCover, user) {
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.bookCover = bookCover;
        this.user = user;
    }

    static fetchAllReadingList(user) {
        return db.execute('SELECT * FROM readinglist WHERE user = ?', [user]);
    }

    static fetchAllCollection(user) {
        return db.execute('SELECT * FROM collection WHERE user = ?', [user]);
    }

    static saveToReadingList(book) {
        return db.execute(
            'INSERT INTO readinglist (bookId, bookTitle, bookCover, bookDate, user) VALUES (?, ?, ?, ?, ?)', 
            [book.bookId, book.bookTitle, book.bookCover, book.bookDate, book.user]
        );
    }

    static saveToCollection(book) {
        return db.execute(
            'INSERT INTO collection (bookId, bookTitle, bookCover, bookDate, user) VALUES (?, ?, ?, ?, ?)', 
            [book.bookId, book.bookTitle, book.bookCover, book.bookDate, book.user]
        );
    }

    static deleteFromReadingList(bookId, user) {
        return db.execute('DELETE FROM readinglist WHERE bookId = ? AND user = ?', [bookId, user]);
    }

    static deleteFromCollection(bookId, user) {
        return db.execute('DELETE FROM collection WHERE bookId = ? AND user = ?', [bookId, user]);
    }

    static findFromReadingList(bookId, user) {
        return db.execute('SELECT * FROM readinglist WHERE bookId = ? AND user = ?', [bookId, user])
          .then(([rows]) => {
            if (rows.length > 0) {
              return rows[0];
            }
            return null;
        });
    }
    
    static findFromCollection(bookId, user) {
        return db.execute('SELECT * FROM collection WHERE bookId = ? AND user = ?', [bookId, user])
          .then(([rows]) => {
            if (rows.length > 0) {
              return rows[0];
            }
            return null;
        });
    }
};
 