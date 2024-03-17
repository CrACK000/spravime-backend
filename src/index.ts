import { config } from 'dotenv'

if (process.env.RAILWAY_ENVIRONMENT_NAME !== 'production') {
  config({ path: './config.env' })
}

import { app } from './api'
import { closeDb, connectToDb } from './config/db'

const PORT = process.env.PORT || 4000
//const ENVIRONMENT = process.env.RAILWAY_ENVIRONMENT_NAME || "development"

connectToDb().then(() => {
  app.listen(PORT, () =>
    console.log(`API available on http://localhost:${PORT}`)
  )
}).catch(err => {
  console.error("Database connection failed: ", err)
  process.exit(1)
})

process.on('SIGINT', closeGracefully)
process.on('SIGTERM', closeGracefully)

function closeGracefully() {
  closeDb().finally(() => {
    process.exit()
  })
}