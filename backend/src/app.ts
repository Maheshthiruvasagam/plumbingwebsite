import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import { allowedOrigins, config } from './config.js'
import { sendAdminEmail, sendLeadNotification } from './emailService.js'
import { addActivity, findLeadByIdempotencyKey, listActivities, saveLead } from './store.js'
import type { LeadRecord } from './types.js'

const leadSchema = z.object({
  idempotencyKey: z.string().min(3).max(160).optional(),
  clientLeadId: z.string().min(3).max(80).optional(),
  customerName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(40),
  email: z.string().trim().email(),
  service: z.string().trim().min(2).max(120),
  issue: z.string().trim().min(2).max(2000),
  source: z.string().trim().min(2).max(80),
})

const emailSchema = z.object({
  leadId: z.string().min(2).max(80).optional(),
  to: z.string().email().optional(),
  subject: z.string().trim().min(2).max(200),
  body: z.string().trim().min(2).max(10000),
})

const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Unexpected server error.'

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.has(origin)) callback(null, true); else callback(new Error('Origin is not allowed by the backend CORS policy.')) } }))
  app.use(express.json({ limit: '64kb' }))

  app.get('/api/health', (_request, response) => response.json({ ok: true, service: 'aquaflow-backend', resendConfigured: Boolean(config.resendApiKey && config.adminEmail), timestamp: new Date().toISOString() }))

  app.post('/api/leads', async (request, response, next) => {
    try {
      const input = leadSchema.parse(request.body)
      const idempotencyKey = input.idempotencyKey ?? input.clientLeadId ?? `${input.email.toLowerCase()}|${input.phone}|${input.service}`
      const existing = findLeadByIdempotencyKey(idempotencyKey)
      if (existing) return response.json({ ok: true, duplicate: true, leadId: existing.id, automation: { triggered: false, reason: 'Lead already processed.' }, email: { status: 'not_configured', provider: 'not-configured' } })
      const lead: LeadRecord = { id: `AF-BE-${Date.now().toString().slice(-7)}`, clientLeadId: input.clientLeadId, customerName: input.customerName, phone: input.phone, email: input.email, service: input.service, issue: input.issue, source: input.source, createdAt: new Date().toISOString(), idempotencyKey }
      saveLead(lead)
      addActivity({ id: `${lead.id}-created`, leadId: lead.id, step: 'lead-created', action: 'Lead accepted by backend', status: 'completed', timestamp: new Date().toISOString(), details: `Source: ${lead.source}` })
      const email = await sendLeadNotification(lead)
      addActivity({ id: `${lead.id}-email`, leadId: lead.id, step: 'welcome-email', action: email.status === 'sent' ? 'Admin email accepted by Resend' : 'Admin email not sent', status: email.status === 'failed' ? 'failed' : email.status === 'sent' ? 'completed' : 'pending', timestamp: new Date().toISOString(), details: email.error ?? email.providerId })
      return response.status(201).json({ ok: true, duplicate: false, leadId: lead.id, automation: { triggered: true }, email })
    } catch (error) { return next(error) }
  })

  app.post('/api/messages/email', async (request, response, next) => {
    try {
      const input = emailSchema.parse(request.body)
      const to = input.to ?? config.adminEmail
      if (!to || to !== config.adminEmail) return response.status(400).json({ ok: false, error: 'Email preview sending is restricted to ADMIN_EMAIL in test mode.' })
      const email = await sendAdminEmail({ to, subject: input.subject, body: input.body })
      return response.status(email.status === 'failed' ? 502 : 200).json({ ok: email.status !== 'failed', email })
    } catch (error) { return next(error) }
  })

  app.get('/api/automation/activity', (_request, response) => response.json({ ok: true, activities: listActivities() }))

  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof z.ZodError) return response.status(400).json({ ok: false, error: 'Validation failed.', issues: error.issues })
    if (error instanceof Error && error.message.includes('CORS')) return response.status(403).json({ ok: false, error: error.message })
    console.error(error)
    return response.status(500).json({ ok: false, error: errorMessage(error) })
  })
  return app
}
