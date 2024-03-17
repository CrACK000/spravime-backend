import { config } from 'dotenv'

const PORT        = process.env.PORT || 4000
const ENVIRONMENT = process.env.RAILWAY_ENVIRONMENT_NAME || "development"
const DOMAIN      = process.env.RAILWAY_PUBLIC_DOMAIN || "localhost"

if (ENVIRONMENT === 'development') {
  config({ path: './config.env' })
}

import { app } from './api'

const http = PORT === 4000 ? 'http://' : 'https://'

const server = app.listen(PORT, () => {
  console.log(`🚀 API is running at ${http}${DOMAIN}:${PORT}`)
})

export default server
