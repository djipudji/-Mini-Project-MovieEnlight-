const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController.js');
const reviewValidator = require('../middlewares/validator/reviewValidator.js');
const passport = require('passport')
const auth = require('../middlewares/auth')

router.get('/show/movie/', ReviewController.showByMovies)
router.get('/show/user/', ReviewController.showByUser)
router.get('/rating/movie/', ReviewController.getRatingMovie)
router.get('/:id', reviewValidator.showOne, ReviewController.showOne)
router.post('/create', [passport.authenticate('user', {session: false})], reviewValidator.create, ReviewController.create)
router.put('/update/:id', [passport.authenticate('user', {session: false})], reviewValidator.update, ReviewController.update)
router.delete('/delete/:id', [passport.authenticate('user', {session: false})], ReviewController.delete)

module.exports = router;
