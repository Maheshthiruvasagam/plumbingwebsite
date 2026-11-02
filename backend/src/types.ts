export type EmailSendStatus = 'sent' | 'not_configured' | 'failed'

export interface LeadRecord {
  id: string
  clientLeadId?: string
  customerName: string
  phone: string
  email: string
  service: string
  issue: string
  source: string
  createdAt: string
  idempotencyKey: string
}

export interface AutomationActivity {
  id: string
  leadId: string
  step: string
  action: string
  status: 'completed' | 'pending' | 'failed'
  timestamp: string
  details?: string
}

export interface EmailResult {
  status: EmailSendStatus
  provider: 'resend' | 'not-configured'
  providerId?: string
  error?: string
}
