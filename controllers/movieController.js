const {
  movie
} = require('../models');

class movieController {
  async getAll(req, res) {
    const {
      page = 1, limit = 10
    } = req.query;
    try {
      const posts = await movie.find({},
          'title poster genre trailer')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await movie.countDocuments();
      res.json({
        status: "Succes get all the data",
        posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });

    } catch (err) {
      console.error(err.message);
    }

  };

  async getOne(req, res) {
    movie.findOne({
      _id: req.params.movieId
    }).then(result => {
      res.json({
        status: `Get one movie data success!`,
        data: {
          movieId: result._id,
          title: result.title,
          synopsis: result.synopsis,
          genre: result.genre,
          poster: result.poster,
          trailer: result.trailer,
          director: result.director,
          characters: result.characters,
          release_date: result.release_date
        }
      })
    })
  }

  async getGenre(req, res) {
    const {
      page = 1, limit = 10
    } = req.query;
    try {
      const posts = await movie.find({
          genre: {
            $regex: req.query.genre,
            $options: '$i'
          }
        }, 'title poster genre trailer')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await posts.length;
      res.json({
        status: "Succes get all the data",
        data: posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  async getByTitle(req, res) {
    movie.find({
        title: {
          $regex: req.query.title,
          $options: '$i'
        }
      }, 'title poster genre trailer')
      .then(result => {
        res.json({
          status: "Succes get data",
          data: result
        })
      })
  }

  async create(req, res) {
    movie.create({
      title: req.body.title,
      synopsis: req.body.synopsis,
      genre: req.body.genre,
      characters: req.body.characters,
      director: req.body.director,
      release_date: req.body.release_date
    }).then(result => {
      res.json({
        status: "Succes create new data",
        data: {
          movieId: result._id,
          title: result.title,
          synopsis: result.synopsis,
          genre: result.genre,
          poster: result.poster,
          trailer: result.trailer,
          director: result.director,
          characters: result.characters,
          release_date: result.release_date
        }
      })
    })
  }
  async update(req, res) {
    movie.findOneAndUpdate({
      title: req.params.title
    }, {
      synopsis: req.body.synopsis,
      genre: req.body.genre,
      characters: req.body.characters,
      director: req.body.director,
      release_date: req.body.release_date
    }, {
      new: true
    }).then(() => {
      return movie.findOne({
        title: req.params.title
      })
    }).then(result => {
      res.json({
        status: "Succes updating data",
        data: {
          movieId: result._id,
          title: result.title,
          synopsis: result.synopsis,
          genre: result.genre,
          poster: result.poster,
          trailer: result.trailer,
          director: result.director,
          characters: result.characters,
          release_date: result.release_date
        }
      })
    })
  }

  async delete(req, res) {
    movie.delete({
      title: req.params.title
    }).then(() => {
      res.json({
        status: "Succes delete data",
        data: null
      })
    })
  }
  async updatePoster(req, res) {
    movie.findOneAndUpdate({
      title: req.params.title
    }, {
      poster: req.file === undefined ? "poster tidak dimasukan" : req.file.filename,
    }, {
      new: true
    }).then(result => {
      res.json({
        status: "Succes updating Poster"
      })
    })
  }

  async updateTrailer(req, res) {
    movie.findOneAndUpdate({
      title: req.params.title
    }, {
      trailer: req.body.trailer,
    }, {
      new: true
    }).then(result => {
      res.json({
        status: "Succes updating Trailer",
        data: {
          movieId: result._id,
          title: result.title,
          synopsis: result.synopsis,
          genre: result.genre,
          poster: result.poster,
          trailer: result.trailer,
          director: result.director,
          characters: result.characters,
          release_date: result.release_date
        }
      })
    })
  }

}

module.exports = new movieController;