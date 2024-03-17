import { config } from 'dotenv'

const PORT        = process.env.PORT || 4000
const ENVIRONMENT = process.env.RAILWAY_ENVIRONMENT_NAME || "development"
const DOMAIN      = process.env.RAILWAY_PUBLIC_DOMAIN || "localhost"

if (ENVIRONMENT === 'development') {
  config({ path: './config.env' })
}

import { app } from './api'
import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL)
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    console.log('db ok')
  })
  .catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`)
    // process.exit()
  })

const http = PORT === 4000 ? 'http://' : 'https://'

const server = app.listen(PORT, () => {
  console.log(`🚀 API is running at ${http}${DOMAIN}:${PORT}`)
})

export default server