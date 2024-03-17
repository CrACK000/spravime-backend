import express from 'express'
import cors from 'cors'
import router from './router'
import passport from 'passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Strategy as LocalStrategy } from 'passport-local'
import { User } from './app/models/user';
import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'
import lusca from "lusca"
import flash from "express-flash"
import mongoose from 'mongoose';

export const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({ origin: process.env.FRONTEND, credentials: true }))

app.use(session({
  name: "Spravime Sessions",
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
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"))
app.use(lusca.xssProtection(true))

passport.use(
  new LocalStrategy(async (username, password, done) => {

    try {

      const user = await User.findOne({ username: username })

      if (!user) {
        return done(null, false, { message: "No user with that username" })
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: "Wrong password" })
      }

      return done(null, user)

    } catch (error) {
      return done(error)
    }

  })

)

passport.serializeUser((user:any, done) => {

  done(null, user._id)

})

passport.deserializeUser(async (user: any, done) => {

  const userId = new mongoose.Types.ObjectId(String(user))

  try {
    const user = await User.findById(userId)
    done(null, user)
  } catch(err) {
    done(err)
  }

})

app.use('/api/v1', router)
