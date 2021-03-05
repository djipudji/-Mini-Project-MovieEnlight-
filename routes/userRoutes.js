const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middlewares/auth');
const UserController = require('../controllers/userController.js');
const userValidator = require('../middlewares/validator/userValidator.js');

// IF ACCESSING LOCALHOST:6969/user/signup WE WILL GO TO USER SIGNUP ENDPOINT
router.post('/signup', [userValidator.signup, passport.authenticate('signup', {
    session: false
})], UserController.signup);

// SIGNUP FOR ADMIN
router.post('/admin/signup', [userValidator.signup, passport.authenticate('signupAdmin', {
    session: false
})], UserController.signup)

// IF ACCESSING LOCALHOST:6969/user/login WE WILL GO TO USER LOGIN ENDPOINT
router.post('/login', [userValidator.login, passport.authenticate('login', {
    session: false
})], UserController.login);

// IF ACCESSING LOCALHOST:6969/user/profile WE WILL GO TO GETTING USER OWN PROFILE ENDPOINT
router.get('/profile', [passport.authenticate('user', {
    session: false
})], UserController.getOwnProfile)

// IF ACCESSING LOCALHOST:6969/user/profile/get WE WILL GO TO GETONE USER PROFILE ENDPOINT
router.get('/profile/get', userValidator.getOne, UserController.getOne)

// IF ACCESSING LOCALHOST:6969/user/update/profile/name WE WILL GO TO USER UPDATE PROFILE NAME ENDPOINT
router.put('/update/profile/name', [passport.authenticate('user', {
    session: false
}), userValidator.updateProfileName], UserController.updateProfileName);

// IF ACCESSING LOCALHOST:6969/user/update/profile/password WE WILL GO TO USER UPDATE PROFILE PASSWORD ENDPOINT
router.put('/update/profile/password', [passport.authenticate('user', {
    session: false
}), userValidator.updateProfilePassword], UserController.updateProfilePassword);

// IF ACCESSING LOCALHOST:6969/user/update/profile/photo WE WILL GO TO USER UPDATE PROFILE PHOTO ENDPOINT
router.put('/update/profile/photo', [passport.authenticate('user', {
    session: false
}), userValidator.updateProfilePhoto], UserController.updateProfilePhoto)

// IF ACCESSING LOCALHOST:6969/user/delete WE WILL GO TO USER DELETE ENDPOINT
router.delete('/delete', [passport.authenticate('user', {
    session: false
})], UserController.deleteProfile)

module.exports = router