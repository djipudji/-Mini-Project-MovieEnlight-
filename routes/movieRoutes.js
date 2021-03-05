const express = require('express') // Import express
const router = express.Router() // Make router from app
const passport = require('passport') // import passport
const auth = require('../middlewares/auth') // import passport auth
const movieController = require('../controllers/movieController.js') // Import TransaksiController
const movieValidator = require('../middlewares/validator/movieValidator.js') // Import validator to validate every request from user

router.get('/', movieController.getAll) 
router.get('/findGenre', movieController.getGenre)
router.get('/findTitle', movieController.getByTitle) 
router.get('/get/:movieId', movieValidator.getOne, movieController.getOne)
router.post('/create',[passport.authenticate('admin',{
    session:false
}), movieValidator.create], movieController.create)

 router.put('/update/:title',[passport.authenticate('admin',{
    session:false
}), movieValidator.update], movieController.update) 

router.delete('/delete/:title',[passport.authenticate('admin',{
    session:false
}), movieValidator.delete], movieController.delete) 

router.put('/update/poster/:title',[passport.authenticate('admin',{
    session:false
}), movieValidator.updatePoster], movieController.updatePoster)

router.put('/update/trailer/:title',[passport.authenticate('admin',{
    session:false
}), movieValidator.updateTrailer], movieController.updateTrailer)

module.exports = router; // Export router