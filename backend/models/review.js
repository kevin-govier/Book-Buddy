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
        return db.execute('SELECT * FROM reviews WHERE bookId = ? AND user = ?', [bookId, user])
          .then(([rows]) => {
            if (rows.length > 0) {
              return rows[0];
            }
            return null;
        });
    }

    static deleteReview(bookId, user) {
        return db.execute('DELETE FROM reviews WHERE bookId = ? AND user = ?', [bookId, user]);
    }

    static saveReview(review) {
        return db.execute(
            'INSERT INTO reviews (bookId, bookTitle, bookCover, bookDate, body, rating, user, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [review.bookId, review.bookTitle, review.bookCover, review.bookDate, review.body, review.rating, review.user, review.date]
        );
    }

    static fetchAllReviews(user) {
        return db.execute('SELECT * FROM reviews WHERE user = ?', [user]);
    }

}
