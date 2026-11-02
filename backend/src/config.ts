import 'dotenv/config'

const port = Number.parseInt(process.env.PORT ?? '8787', 10)

export const config = {
  port: Number.isFinite(port) ? port : 8787,
  frontendUrl: process.env.FRONTEND_URL ?? 'http://127.0.0.1:3000',
  resendApiKey: process.env.RESEND_API_KEY?.trim() ?? '',
  emailFrom: process.env.EMAIL_FROM?.trim() || 'onboarding@resend.dev',
  adminEmail: process.env.ADMIN_EMAIL?.trim() ?? '',
}

export const allowedOrigins = new Set([
  config.frontendUrl,
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'https://plumbingwebsite-587p.vercel.app',
])
