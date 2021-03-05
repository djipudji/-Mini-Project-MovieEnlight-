const {
  review,
  movie,
  user
} = require('../models');
const {
  ObjectId
} = require('mongodb')

class ReviewController {

  async create(req, res) {
    const data = await Promise.all([
      movie.findOne({
        _id: req.body.movie_id
      }, '_id title poster trailer'),
      user.findOne({
        _id: req.user._id
      }, '_id fullName email image')
    ])
    review.create({
      comment: req.body.comment,
      rating: req.body.rating,
      movie: data[0],
      user: data[1]
    }).then(result => {
      res.json({
        status: "Review created",
        data: result
      })
    })
  };

  async showByMovies(req, res) {
    let movieObj = new ObjectId(req.query.movie_id);
    const fillReview = await review
      .find({
        "movie._id": movieObj,
      }, 'comment rating movie user')
    try {
      const {
        page = 1, limit = 10
      } = req.query;
      review.findOne({
        "movie._id": req.param.movie_id
      })
      const post = await review
        .find({
          "movie._id": movieObj,
        }, 'comment rating movie user')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await fillReview.length;
      res.json({
        post,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (err) {
      console.log(err.message);
    }
  };
  async showByUser(req, res) {
    let userObj = new ObjectId(req.query.user_id);
    const fillReview = await review
      .find({
        "user._id": userObj,
      })
    try {
      const {
        page = 1, limit = 10
      } = req.query;
      review.findOne({
        "user._id": req.param.user_id
      });
      const post = await review
        .find({
          "user._id": userObj,
        }, 'comment rating movie user')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await fillReview.length;
      res.json({
        post,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (err) {
      console.log(err.message);
    }
  };
  async getRatingMovie(req, res) {
    let movieObj = new ObjectId(req.query.movie_id);
    const fillReview = await review
      .find({
        "movie._id": movieObj
      })
    let sumAverage = 0;
    await fillReview.forEach((item, i) => {
      sumAverage += item.rating
    });
    const averageRating = sumAverage / fillReview.length
    res.json({
      data: averageRating
    })
  };
  async showOne(req, res) {
    review.findOne({
      _id: req.params.id
    }, 'comment rating user.fullName user.email user.image movie.title movie.poster')
    .then(result => {
      res.json({
        status: "success get review",
        data: result
      })
    });
  };
  async update(req, res) {
    review.findOneAndUpdate({
        _id: req.params.id
      }, {
        comment: req.body.comment,
        rating: req.body.rating,
      }, {
        new: true
      }).then(() => {
        return review.findOne({
          _id: req.params.id
        })
      })
      .then(result => {
        res.status(200).json({
          message: "Review update success",
          data: result
        });
        console.log(result);
      });
  };
  async delete(req, res) {
    review.delete({
      _id: req.params.id
    }).then(() => {
      res.status(200).json({
        message: "review deleted",
        data: null
      });
    });
  };
};

module.exports = new ReviewController;
