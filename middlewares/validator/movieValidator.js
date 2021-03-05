const {
  check,
  matchedData,
  validationResult,
  sanitize
} = require('express-validator');

const multer = require('multer'); //multipar form-data
const path = require('path'); // to detect path of directory
const crypto = require('crypto'); // to encrypt something
const { movie }  = require('../../models');



const uploadDirImage = '/img/'; // make images upload to /img/
const storageImages = multer.diskStorage({
  destination: "./public" + uploadDirImage , // make images upload to /public/img/
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err)
      cb(null, raw.toString('hex') + path.extname(file.originalname)) // encrypt filename and save it into the /public/img/ directory
    })
  }
})
const uploadImage = multer({
  storage: storageImages,
  dest: uploadDirImage
});


module.exports = {
  getOne: [
    check('movieId').custom(value => {
      return movie.findOne({
        _id: value
      }).then(result => {
        if (!result) {
          throw new Error('ID Movie tidak ada!')
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
  getGenre: [
    check('genre').custom(value => {
      return movie.findOne({
        genre : value
      }).then(result => {
        if (!result) {
          throw new Error('Genre Movie tidak ada!')
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
  create: [
    check('title').notEmpty().isString().custom(value => {
      return movie.findOne({
        title: value
      }).then(n => {
        if (n) {
          throw new Error('Judul Movie sudah ada')
        }
      })
    }),
    check('synopsis','synopsis tidak ada').isString().notEmpty(),
    check('genre','genre tidak ada').isString().notEmpty(),
    check('director','director tidak ada').isString().notEmpty(),
    check('characters','characters tidak ada').isString().notEmpty(),
    check('release_date','release date tidak ada').isString().notEmpty(),
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
  update: [
    check('title').notEmpty().isString().custom(value => {
      return movie.findOne({
        title: value
      }).then(m => {
        if (!m) {
          throw new Error('Judul Movie tidak ada')
        }
      })
    }),
    check('synopsis','synopsis tidak ada').isString().notEmpty(),
    check('genre','genre tidak ada').isString().notEmpty(),
    check('director','director tidak ada').isString().notEmpty(),
    check('characters','characters tidak ada').isString().notEmpty(),
    check('release_date','release date tidak ada').isString().notEmpty(),
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
    check('title').notEmpty().custom(value => {
      return movie.findOne({
        title: value
      }).then(o => {
        if (!o) {
          throw new Error('Judul Movie tidak ada!')
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
  updatePoster: [
    check('title').notEmpty().custom(value => {
      return movie.findOne({
        title: value
      }).then(o => {
        if (!o) {
          throw new Error('Judul Movie tidak ada!')
        }
      })
    }),
   uploadImage.single('poster'),
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
  updateTrailer: [
    check('title').custom(value => {
      return movie.findOne({
        title: value
      }).then(o => {
        if (!o) {
          throw new Error('Judul Movie tidak ada!')
        }
      })
    }),
    check('trailer','trailer tidak ada').isString().notEmpty(),
     (req, res, next) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(422).json({
           errors: errors.mapped()
         })
       }
       next();
     }
   ]

  

  
}
