const {
  check,
  validationResult,
  matchedData,
  sanitize
} = require('express-validator')
const {
  review,
  user,
  movie
} = require('../../models')
const {
  ObjectId
} = require('mongodb')
const multer = require('multer')
const path = require('path')

module.exports = {

  showOne: [
    check('id').custom(value => {
      return review.findOne({
        _id: value
      }).then(result => {
        if (result.length == 0) {
          throw new Error('Review not found!')
        }
      })
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        })
      }
      next();
    }
  ],
  create: [check('movie_id').custom(async (value, {
      req
    }) => {
      const checkMovie = await movie.findOne({
        _id: value
      })
      if (!checkMovie) throw new Error('Movie not found!')
      const checkReviewUser = await review.find({
        "user._id": new ObjectId(req.user._id),
        "movie._id": new ObjectId(req.body.movie_id)
      })
      if (checkReviewUser.length !== 0) throw new Error('User already review this movie!')
    }),
    check('comment', "Review must be String!").isString().notEmpty(),
    check('rating', "Rating must be a number 1-10!").isNumeric().notEmpty().isFloat({
      min: 0,
      max: 10
    }),
    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        });
      }
      next()
    }
  ],
  update: [
    check('id').custom(value => {
      return review.findOne({
        _id: value
      }).then(result => {
        if (!result) {
          throw new Error('Review not found')
        }
      })
    }),
    check('comment').isString().notEmpty()
    .custom(value => {
      return review.findOne({
        comment: value
      }).then(result => {
        if (result) {
          throw new Error('Review must not be empty or same')
        }
      })
    }),
    check('rating').notEmpty().isNumeric().isFloat({
      min: 0,
      max: 10
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        })
      }
      next();
    }
  ],
    delete: [
    check('id').custom(value => {
      return review.findOne({
        _id: value
      }).then(result => {
        if (result.length == 0) {
          throw new Error('review not found')
        }
      })
    }),
    (req, res, next) => {

    }
  ]
}
