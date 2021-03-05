const { check, validationResult, matchedData, sanitize } = require('express-validator')
const { user } = require('../../models')

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

// START (UPLOADING IMAGE)
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

// IMAGE DIRECTORY
const uploadDir = '/img/'
const storage = multer.diskStorage({
    destination: './public' + uploadDir,
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if(err) return cb(err)

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})

const upload = multer({ storage: storage, dest: uploadDir})
// END (UPLOADING IMAGE)

module.exports = {

    // VALIDATING SIGNUP
    signup: [

        // VALIDATING FULL NAME
        check('fullName', 'Full name must not be empty').isString().notEmpty(),
        
        // VALIDATING EMAIL
        check('email', 'Email field must be an email address').normalizeEmail().isEmail(),

        // VALIDATING EMAIL IF THE EMAIL IS ALREADY EXIST OR NOT
        check('email', 'Email is already exist').custom(value => {
            return user.findOne({
                email: value
            }).then(result => {
                if(result) {
                    throw new Error('Email is already exist')
                }
            })
        }),

        // VALIDATING PASSWORD
        check('password', 'Password field must contains 8 to 32 characters and not contains symbols or spaces').isString().isLength({
            min: 8,
            max: 32
        })
        .custom(value => { return !isEmptyOrSpaces(value) }),

        // VALIDATING PASSWORD CONFIRMATION
        check('passwordConfirmation', 'Password confirmation field must have the same value as the password field')
        .exists()
        .custom((value, {req}) => value === req.body.password),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                })
            }
            next();
        }
    ],

    // VALIDATING LOGIN
    login: [

        // VALIDATING EMAIL
        check('email', 'Email field must be an email address').normalizeEmail().isEmail(),

        // VALIDATING EMAIL IF THE EMAIL IS ALREADY EXIST OR NOT
        check('email', 'Email is not exist').custom(value => {
            return user.findOne({
                email: value
            }).then(result => {
                if(!result) {
                    throw new Error('Email is not exist')
                }
            })
        }),
        
        // VALIDATING PASSWORD
        check('password', 'Password field must contains 8 to 32 characters and not contains symbols or spaces').isString().isLength({
            min: 8,
            max: 32
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                })
            }
            next();
        }
    ],

    // VALIDATING GETONE USER PROFILE
    getOne: [

        // VALIDATING USER PROFILE ID
        check('userId', 'UserID must have 24 characters').isLength({ 
            min: 24,
            max: 24
         }).custom(value => {
            return user.findOne({
                _id: value
            }).then(result => {
                if(!result) {
                    throw new Error("User not found")
                }
            })
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                });
            };
            next();
        }
    ],

    // VALIDATING UPDATE PROFILE NAME
    updateProfileName: [

        // VALIDATING FULL NAME
        check('fullName', 'Full name must not be empty').isString().notEmpty(),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                });
            };
            next();
        }
    ],

    // VALIDATING UPDATE PROFILE PASSWORD
    updateProfilePassword: [
        
        // VALIDATING PASSWORD
        check('password', 'Password field must contains 8 to 32 characters and not contains symbols or spaces').isString().isLength({
            min: 8,
            max: 32
        })
        .custom(value => { return !isEmptyOrSpaces(value) }),

        // VALIDATING PASSWORD CONFIRMATION
        check('passwordConfirmation', 'Password confirmation field must have the same value as the password field')
        .exists()
        .custom((value, {req}) => value === req.body.password),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                });
            };
            next();
        }
    ],

    // VALIDATING UPDATE PROFILE PHOTO
    updateProfilePhoto: [

        // UPLOADING PHOTO
        upload.single('image'),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.mapped()
                })
            }
            next();
        }
    ]
}