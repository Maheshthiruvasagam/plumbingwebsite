import { createApp } from './app.js'
import { config } from './config.js'

const app = createApp()
app.listen(config.port, '127.0.0.1', () => {
  console.log(`AquaFlow backend listening on http://127.0.0.1:${config.port}`)
  console.log(`Resend configured: ${Boolean(config.resendApiKey && config.adminEmail)}`)
})
