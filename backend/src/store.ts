import type { AutomationActivity, LeadRecord } from './types.js'

const leads = new Map<string, LeadRecord>()
const idempotencyIndex = new Map<string, string>()
const activities: AutomationActivity[] = []

export function findLeadByIdempotencyKey(key: string) {
  const leadId = idempotencyIndex.get(key)
  return leadId ? leads.get(leadId) : undefined
}

export function saveLead(lead: LeadRecord) {
  leads.set(lead.id, lead)
  idempotencyIndex.set(lead.idempotencyKey, lead.id)
  return lead
}

export function addActivity(activity: AutomationActivity) {
  activities.unshift(activity)
  if (activities.length > 200) activities.length = 200
  return activity
}

export function listActivities() {
  return activities
}

export function clearStoreForTests() {
  leads.clear()
  idempotencyIndex.clear()
  activities.length = 0
}
