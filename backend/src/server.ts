
import { createApp } from './app.js'
import { config } from './config.js'

const app = createApp()

app.listen(config.port, '0.0.0.0', () => {
  console.log(`AquaFlow backend listening on 0.0.0.0:${config.port}`)
  console.log(`Resend configured: ${Boolean(config.resendApiKey && config.adminEmail)}`)
})

