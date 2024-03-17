import express from 'express'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import lusca from 'lusca'
import cors from 'cors'
import session from 'express-session'
import bodyParser from 'body-parser'
import flash from 'express-flash'
import passport from 'passport'
import router from './middlewares/api.middleware'
import auth from './middlewares/auth.middleware'

export const app = express()

mongoose.connect(process.env.DB_URL)
  .then(() => {
      /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    })
  .catch(err => {
      console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`)
      // process.exit()
    })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ origin: process.env.FRONTEND, credentials: true }))
app.use(session({
  name: "sessions",
  secret: process.env.SESSION_SECRET || "secret123",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: process.env.DB_URL,
    dbName: process.env.DB_NAME,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: process.env.RAILWAY_ENVIRONMENT_NAME === "production"
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(lusca.xframe("SAMEORIGIN"))
app.use(lusca.xssProtection(true))

const VERSION = '/api/v1'

app.use(VERSION, auth)
app.use(VERSION, router)
