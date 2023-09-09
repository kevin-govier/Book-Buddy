const express = require('express');

const { body } = require('express-validator');

const collectionController = require('../controllers/collection');

const auth = require('../middleware/auth');

const router  = express.Router();

router.get('/', auth, collectionController.fetchAll);

router.get('/:bookId', auth, collectionController.isBookInCollection);

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

     collectionController.postBook
);

router.delete('/:bookId', auth, collectionController.deleteBook);

module.exports = router;