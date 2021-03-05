const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');
// const reviewModel = mongoose.model('ReviewModel', reviewSchema);
const mongoose_delete = require('mongoose-delete');
const ReviewSchema = new mongoose.Schema({
  /* your schema definition */
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    default: null,
    min: 0,
    max: 10
  },
  movie: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    get: getMovie
  },
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    get: getUser
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  versionKey: false,
  toJSON: { getters: true }
});

function getUser(value) {
  value.image = 'http://ec2-13-229-61-46.ap-southeast-1.compute.amazonaws.com:6969/img/' + value.image
  return value
}

function getMovie(nilai) {
  nilai.poster = 'http://ec2-13-229-61-46.ap-southeast-1.compute.amazonaws.com:6969/img/' + nilai.poster
  return nilai
}

ReviewSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});
module.exports = review = mongoose.model('review', ReviewSchema, 'review');
