const { user, review } = require('../models');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

class UserController {

    // CONTROLLER FOR SIGNUP
    async signup(req, res) {

        // GETTING USER DATA FROM AUTH
        const body = {
            _id: req.user._id,
            email: req.user.email
        };

        // DECLARING TOKEN BY ID
        const token = await jwt.sign({
            user: body
        }, 'secret_key');
        res.status(200).json({
            message: "Signup success!",
            token: token
        });
    };

    // CONTROLLER FOR LOGIN
    async login(req, res) {

        // GETTING USER DATA FROM AUTH
        const body = {
            _id: req.user._id,
            email: req.user.email
        };

        // DECLARING TOKEN BY ID
        const token = await jwt.sign({
            user: body
        }, 'secret_key');

        res.status(200).json({
            message: "Login success!",
            token: token
        });
    };

    // CONTROLLER FOR GETTING USER OWN PROFILE
    async getOwnProfile(req, res) {
        user.findOne({
            _id: req.user._id
        }).then(result => {
            res.status(200).json({
                message: "success",
                data: {
                    userId: result._id,
                    fullName: result.fullName,
                    email: result.email,
                    role: result.role,
                    image: result.image
                }
            })
        })
    }

    // CONTROLLER FOR GETONE USER PROFILE
    async getOne(req, res) {
        user.findOne({
            _id: req.query.userId
        }).then(result => {
            res.json({
                status: "Get one user profile success",
                data: {
                    userId: result._id,
                    fullName: result.fullName,
                    email: result.email,
                    role: result.role,
                    image: result.image
                }
            })
        })
    }

    // CONTROLLER FOR UPDATING PROFILE NAME
    async updateProfileName(req, res) {
        try {
            const userUpdate = await user.findOneAndUpdate({
                email: req.user.email
            }, {
                fullName: req.body.fullName
            }, {
                new: true
            })

            const updateInReview = await review.updateMany({
                "user.email": {
                    $eq: req.user.email
                }
            }, {
                $set: {
                    "user": userUpdate
                }
            })

            res.json({
                status: "User update success",
                data: {
                    userId: userUpdate._id,
                    fullName: userUpdate.fullName,
                    email: userUpdate.email,
                    role: userUpdate.role,
                    image: userUpdate.image
                }
            })

        } catch (err) {
            console.log(err.message)
        }
    }

    // CONTROLLER FOR UPDATING PROFILE PASSWORD
    async updateProfilePassword(req, res) {
        user.findOneAndUpdate({
            _id: req.user._id
        }, {
            password: req.body.password
        }, {
            new: true
        }).then(result => {
            res.status(200).json({
                message: "Password update success",
                data: {
                    userId: result._id,
                    fullName: result.fullName,
                    email: result.email,
                    role: result.role,
                    image: result.image
                }
            });
        });
    };

    // CONTROLLER FOR UPDATING PHOTO
    async updateProfilePhoto(req, res) {
        try {
            const userUpdate = await user.findOneAndUpdate({
                email: req.user.email
            }, {
                image: req.file === undefined ? "" : req.file.filename
            }, {
                new: true
            })

            const updateInReview = await review.updateMany({
                "user.email": {
                    $eq: req.user.email
                }
            }, {
                $set: {
                    "user": userUpdate
                }
            })

            res.json({
                status: "User update success",
                data: {
                    userId: userUpdate._id,
                    fullName: userUpdate.fullName,
                    email: userUpdate.email,
                    role: userUpdate.role,
                    image: userUpdate.image
                }
            })

        } catch (err) {
            console.log(err.message)
        }
    };

    // CONTROLLER FOR DELETING PROFILE
    async deleteProfile(req, res) {
        user.delete({
            _id: req.user._id
        }).then(() => {
            res.status(200).json({
                message: "Profile delete success",
                data: null
            });
        });
    };
};

module.exports = new UserController;