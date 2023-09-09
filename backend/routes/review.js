const express = require('express');

const { body } = require('express-validator');

const reviewController = require('../controllers/review');

const auth = require('../middleware/auth');

const router  = express.Router();

router.get('/', auth, reviewController.fetchAll);

router.get('/:bookId', auth, reviewController.getReview);

router.post(
    '/add',
    [
        auth,
        body('bookId').trim().not().isEmpty(),
        body('bookTitle').trim().not().isEmpty(),
        body('bookCover').trim().not().isEmpty(),
        body('bookDate').trim().not().isEmpty(),
        body('body').trim().not().isEmpty(),
        body('rating').trim().not().isEmpty(),
        body('user').trim().not().isEmpty(),
        body('date').trim().not().isEmpty()
    ],  

     reviewController.postBookReview
);

router.delete('/:bookId', auth, reviewController.deleteBookReview);

module.exports = router;