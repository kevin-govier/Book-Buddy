const express = require('express');

const { body } = require('express-validator');

const readingListController = require('../controllers/readingList');

const auth = require('../middleware/auth');

const router  = express.Router();

router.get('/', auth, readingListController.fetchAll);

router.get('/:bookId', auth, readingListController.isBookInReadingList);

router.post(
    '/add',
    [
        auth,
        body('bookId').trim().not().isEmpty(),
        body('bookTitle').trim().not().isEmpty(),
        body('bookCover').trim().not().isEmpty(),
        body('bookDate').trim().not().isEmpty(),
        body('user').trim().not().isEmpty()
    ],  

     readingListController.postBook
);

router.delete('/:bookId', auth, readingListController.deleteBook);

module.exports = router;