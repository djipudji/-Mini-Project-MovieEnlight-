const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const { user } = require('../../models')
const bcrypt = require('bcrypt')
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

// SIGNUP AUTHENTICATION
passport.use(
    'signup',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            // CREATING NEW USER IN DATABASE
            user.create({
                fullName: req.body.fullName,
                email: email,
                password: password
            }).then(newUser => { // IF SUCCESS
                return done(null, newUser, {
                    message: "User has been created successfully"
                })
            }).catch(err => { // IF NOT SUCCESS
                return done(null, false, {
                    message: "Can't create user!"
                })
            })
        }
    )
)

passport.use(
    'signupAdmin',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            // CREATING NEW USER IN DATABASE
            user.create({
                fullName: req.body.fullName,
                role: "user, admin",
                email: email,
                password: password
            }).then(newUser => { // IF SUCCESS
                return done(null, newUser, {
                    message: "User has been created successfully"
                })
            }).catch(err => { // IF NOT SUCCESS
                return done(null, false, {
                    message: "Can't create user!"
                })
            })
        }
    )
)

// LOGIN AUTHENTICATION
passport.use(
    'login',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            // SEARCH FOR USER EMAIL IN DATABASE
            const userLogin = await user.findOne({
                email: email
            })

            // IF USER EMAIL NOT FOUND
            if (!userLogin) {
                return done(null, false, {
                    message: "User email not found"
                })
            }

            // VALIDATING THE PASSWORD
            const validate = await bcrypt.compare(password, userLogin.password)

            // IF THE PASSWORD IS WRONG
            if (!validate) {
                return done(null, false, {
                    message: "Wrong password"
                })
            }

            // IF THE PASSWORD IS CORRECT
            return done(null, userLogin, {
                message: "Login success"
            })
        }
    )
)

// USER AUTHORIZATION
passport.use(
    'user',
    new JWTstrategy({
            secretOrKey: 'secret_key', // JWT KEY
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // EXTRACT TOKEN
        },
        async (token, done) => {

            // FIND USER USING EMAIL FROM EXTRACTED TOKEN
            const userLogin = await user.findOne({
                email: token.user.email
            })

            // IF USER ROLE INCLUDES "USER", IT WILL NEXT
            if (userLogin.role.includes('user')) {
                return done(null, token.user)
            }

            // IF USER ROLE NOT INCLUDES "USER", IT WILL NOT HAVE AUTHORIZATION
            return done(null, false)

        }
    )
)

// ADMIN AUTHORIZATION
passport.use(
    'admin',
    new JWTstrategy({
            secretOrKey: 'secret_key', // JWT KEY
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // EXTRACT TOKEN
        },
        async (token, done) => {

            // FIND USER USING EMAIL FROM EXTRACTED TOKEN
            const userLogin = await user.findOne({
                email: token.user.email
            })

            // IF USER ROLE INCLUDES "USER", IT WILL NEXT
            if (userLogin.role.includes('admin')) {
                return done(null, token.user)
            }

            // IF USER ROLE NOT INCLUDES "USER", IT WILL NOT HAVE AUTHORIZATION
            return done(null, false)

        }
    )
)