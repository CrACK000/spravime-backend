import express from 'express'
import cors from 'cors'
import router from './router'
import passport from './plugins/passport'
import bodyParser from 'body-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'

export const app = express()

app.set('trust proxy', true)

app.use(cors({ origin: process.env.FRONTEND, credentials: true }))


const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  collectionName: 'sessions'
})

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())

app.use('/api/v1', router)
