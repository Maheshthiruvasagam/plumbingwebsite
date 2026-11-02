import { Resend } from 'resend'
import { config } from './config.js'
import type { EmailResult, LeadRecord } from './types.js'

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null

export async function sendAdminEmail(input: { to: string; subject: string; body: string }): Promise<EmailResult> {
  if (!resend || !config.resendApiKey || !config.emailFrom || !config.adminEmail) {
    return { status: 'not_configured', provider: 'not-configured', error: 'Resend is not configured with RESEND_API_KEY, EMAIL_FROM and ADMIN_EMAIL.' }
  }
  if (input.to !== config.adminEmail) {
    return { status: 'failed', provider: 'resend', error: 'Only ADMIN_EMAIL is allowed while using the restricted test sender.' }
  }
  try {
    const result = await resend.emails.send({ from: config.emailFrom, to: [config.adminEmail], subject: input.subject, text: input.body })
    if (result.error) return { status: 'failed', provider: 'resend', error: result.error.message }
    return { status: 'sent', provider: 'resend', providerId: result.data?.id }
  } catch (error) {
    return { status: 'failed', provider: 'resend', error: error instanceof Error ? error.message : 'Unknown Resend error.' }
  }
}

export function sendLeadNotification(lead: LeadRecord) {
  return sendAdminEmail({
    to: config.adminEmail,
    subject: `New AquaFlow Plumbing lead · ${lead.service}`,
    body: [
      `A new AquaFlow Plumbing lead was received.`,
      `Customer: ${lead.customerName}`,
      `Phone: ${lead.phone}`,
      `Email: ${lead.email}`,
      `Service: ${lead.service}`,
      `Issue: ${lead.issue}`,
      `Source: ${lead.source}`,
      `Lead ID: ${lead.id}`,
    ].join('\n'),
  })
}
