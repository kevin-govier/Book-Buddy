const { validationResult } = require('express-validator');

const Review = require('../models/review');

exports.fetchAll = async (req, res, next) => {
    const user = req.query.user;
    try {
        const [allReviews] = await Review.fetchAllReviews(user);
        res.status(200).json(allReviews);
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err); 
    }
};

exports.postBookReview = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return; 
    } 

    const bookId = req.body.bookId;
    const bookTitle = req.body.bookTitle;
    const bookCover = req.body.bookCover;
    const bookDate = req.body.bookDate;
    const body = req.body.body;
    const rating = req.body.rating;
    const user = req.body.user;
    const date = req.body.date;

    try{
        
        //Checks if the user is adding a book that they've already added
        const existingReview = await Review.findReview(bookId, user);
        if (existingReview) {
            return res.status(400).json({ message: 'User already has a review for this book' });
        }

        else {
            const review = {
                bookId: bookId,
                bookTitle: bookTitle,
                bookCover: bookCover,
                bookDate: bookDate,
                body: body,
                rating: rating,
                user: user,
                date: date
            };
    
            const result = await Review.saveReview(review);
    
            res.status(201).json({ message: 'Review Added!' });
        }
        
    } 
    catch (err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteBookReview = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return; 
    } 

    const bookId = req.params.bookId;
    const user = req.query.user;

    try {
        const deleteResponse = await Review.deleteReview(bookId, user);
        return res.status(200).json(deleteResponse);
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getReview = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return;
    }

    const bookId = req.params.bookId;
    const user = req.query.user;

    try {
        const review = await Review.findReview(bookId, user);
        res.status(200).json(review);
    } catch (err) {
        if (!err.statusCode) {
        err.statusCode = 500;
        }
        next(err);
    }
};
