const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const userRoutes = require('./routes/userRoutes.js')
const movieRoutes = require('./routes/movieRoutes.js')
const reviewRoutes = require('./routes/reviewRoutes.js')
var cors = require('cors')

// SET BODY PARSER FOR HTTP POST OPERATION
app.use(bodyParser.json()); // SUPPORT JSON ENCODED BODIES
app.use(bodyParser.urlencoded({
  extended: true
})); // SUPPORT ENCODED BODIES

// ENABLE ALL CORS REQUEST
app.use(cors())

// SET STATUS ASSETS TO PUBLIC DIR
app.use(express.static('public'));

// IF ACCESSING LOCALHOST:6969/user/ WE WILL GO TO USER ROUTES
app.use('/user', userRoutes)

// IF ACCESSING LOCALHOST:6969/movie/ WE WILL GO TO MOVIE ROUTES
app.use('/movie', movieRoutes)

// IF ACCESSING LOCALHOST:6969/review/ WE WILL GO TO REVIEW ROUTES
app.use('/review', reviewRoutes)

app.listen(6969, () => console.log("server running on http://localhost:6969"))