const { validationResult } = require('express-validator');

const Book = require('../models/book');

exports.fetchAll = async (req, res, next) => {
    const user = req.query.user;
    try {
        const allBooks = await Book.fetchAllCollection(user);
        res.status(200).json(allBooks);
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err); 
    }
};

exports.postBook = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return; 
    } 

    const bookId = req.body.bookId;
    const bookTitle = req.body.bookTitle;
    const bookCover = req.body.bookCover;
    const bookDate = req.body.bookDate;
    const user = req.body.user

    try{
        
        //Checks if the user is adding a book that they've already added
        const existingBook = await Book.findFromCollection(bookId, user);
        if (existingBook) {
            return res.status(400).json({ message: 'User already added this book to their reading list' });
        }

        else {
            const book = {
                bookId: bookId,
                bookTitle: bookTitle,
                bookCover: bookCover,
                bookDate: bookDate,
                user: user
            };
    
            const result = await Book.saveToCollection(book);
    
            res.status(201).json({ message: 'Book Added!' });
        }
        
    } 
    catch (err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.deleteBook = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return; 
    } 

    const bookId = req.params.bookId;
    const user = req.query.user;

    try {
        
        // Checks if the user is logged in
        if (!req.isLoggedIn) {
            const error = new Error('User is not authenticated');
            error.statusCode = 401;
            throw error;
        }

        const deleteResponse = await Book.deleteFromCollection(bookId, user);
        return res.status(200).json(deleteResponse);
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.isBookInCollection = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return; 
    } 

    const bookId = req.params.bookId;
    const user = req.query.user;

    try{
        const inCollection = await Book.findFromCollection(bookId, user);
        return res.status(200).json(inCollection);        
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}