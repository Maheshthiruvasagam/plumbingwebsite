import type { Lead } from '../types'

const backendUrl = (import.meta.env.VITE_BACKEND_URL as string | undefined)?.replace(/\/$/, '') || 'http://127.0.0.1:8787'

export interface BackendLeadResult {
  ok: boolean
  duplicate?: boolean
  leadId?: string
  email?: { status: 'sent' | 'not_configured' | 'failed'; error?: string }
  error?: string
}

export async function submitLeadToBackend(lead: Lead): Promise<BackendLeadResult> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 4500)
  try {
    const response = await fetch(`${backendUrl}/api/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idempotencyKey: lead.id, clientLeadId: lead.id, customerName: lead.customerName, phone: lead.phone, email: lead.email, service: lead.service, issue: lead.issue, source: lead.source }), signal: controller.signal })
    const payload = await response.json() as BackendLeadResult
    if (!response.ok) return { ok: false, error: payload.error || `Backend request failed with ${response.status}.` }
    return payload
  } catch (error) {
    return { ok: false, error: error instanceof DOMException && error.name === 'AbortError' ? 'Backend request timed out.' : 'Backend is unavailable.' }
  } finally {
    window.clearTimeout(timeout)
  }
}
