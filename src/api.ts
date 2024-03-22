import express from 'express'
import mongoose from 'mongoose'
import lusca from 'lusca'
import cors from 'cors'
import bodyParser from 'body-parser'
import router from './middlewares/api.middleware'
import auth from './middlewares/auth.middleware'

export const app = express();
app.use(cors({ origin: process.env.FRONTEND, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(`${process.env.DB_URL}/${process.env.DB_NAME}?authSource=admin`)
  .then(() => {
    console.log(`✅ Database is connected`);
  })
  .catch((err) => {
    console.log(
      `⛔ MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    process.exit();
  });

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

const VERSION = '/api/v1'

app.use(VERSION, auth)
app.use(VERSION, router)