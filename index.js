require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./router')
const bodyParser = require("body-parser")
const passport = require('./config/passport')

const app = express()

app.use(cors({ origin: process.env.FRONTEND, credentials: true }))

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session(undefined))
app.use(bodyParser.json())

app.use(router)

app.listen(process.env.PORT, () => {
    console.log('Server listening on port ' + process.env.PORT)
})