const mongoose = require('mongoose');

// DATABASE HOST
const uri = "mongodb://localhost:27017/miniproject_dev"; 

// CONNECTING TO DATABASE
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

// IMPORTING MODELS USER.JS
const user = require('./user.js');

// IMPORTING MODELS MOVIE.JS
const movie = require('./movie.js')

// IMPORT MODEL REVIEW.JS
const review = require('./review.js')

// EXPORTING USER
module.exports = { user, movie, review };