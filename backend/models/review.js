const db = require('../util/database');

module.exports = class Review {
    constructor(bookId, bookTitle, bookCover, bookDate, body, rating, user, date) {
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.bookCover = bookCover;
        this.bookDate = bookDate;
        this.body = body;
        this.rating = rating;
        this.user = user;
        this.date = date;
    }

    static findReview(bookId, user) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM reviews WHERE bookId = ? AND user = ?', [bookId, user], (err, row) => {
                if (err) {
                    reject(err);
                } 
                else {
                    resolve(row);
                }
            });
        });
    }

    static deleteReview(bookId, user) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM reviews WHERE bookId = ? AND user = ?', [bookId, user], function (err) {
                if (err) {
                    reject(err);
                } 
                else {
                    resolve(this);
                }
            });
        });
    }

    static saveReview(review) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO reviews (bookId, bookTitle, bookCover, bookDate, body, rating, user, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [review.bookId, review.bookTitle, review.bookCover, review.bookDate, review.body, review.rating, review.user, review.date],
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

    static fetchAllReviews(user) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM reviews WHERE user = ?', [user], (err, rows) => {
                if (err) {
                    reject(err);
                } 
                else {
                    resolve(rows);
                }
            });
        });
    }
};