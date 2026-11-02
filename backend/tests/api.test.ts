import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import test from 'node:test'
import * as httpMocks from 'node-mocks-http'
import { createApp } from '../src/app.js'
import { clearStoreForTests } from '../src/store.js'

const app = createApp()
const lead = {
  idempotencyKey: 'test-lead-001',
  clientLeadId: 'AF-TEST-001',
  customerName: 'Test Customer',
  phone: '(312) 555-0101',
  email: 'test@example.com',
  service: 'Drain Cleaning',
  issue: 'Kitchen sink backing up',
  source: 'Website form',
}

async function invoke(method: string, url: string, body?: unknown) {
  const request = httpMocks.createRequest({ method, url, body, headers: { 'content-type': 'application/json' } })
  const response = httpMocks.createResponse({ eventEmitter: EventEmitter })
  const done = new Promise<void>((resolve) => response.on('end', () => resolve()))
  app.handle(request, response)
  await done
  return { status: response.statusCode, body: response._getJSONData() as Record<string, any> }
}

test.beforeEach(() => clearStoreForTests())

test('health endpoint reports the service without exposing secrets', async () => {
  const response = await invoke('GET', '/api/health')
  assert.equal(response.status, 200)
  assert.equal(response.body.ok, true)
  assert.equal(typeof response.body.resendConfigured, 'boolean')
  assert.equal('resendApiKey' in response.body, false)
})

test('lead intake validates, records activity and prevents duplicate processing', async () => {
  const first = await invoke('POST', '/api/leads', lead)
  assert.equal(first.status, 201)
  assert.equal(first.body.ok, true)
  assert.equal(first.body.duplicate, false)
  assert.equal(first.body.email.status, 'not_configured')

  const duplicate = await invoke('POST', '/api/leads', lead)
  assert.equal(duplicate.status, 200)
  assert.equal(duplicate.body.ok, true)
  assert.equal(duplicate.body.duplicate, true)
  assert.equal(duplicate.body.leadId, first.body.leadId)

  const activity = await invoke('GET', '/api/automation/activity')
  assert.equal(activity.status, 200)
  assert.equal(activity.body.activities.length, 2)
})

test('lead validation rejects incomplete input', async () => {
  const response = await invoke('POST', '/api/leads', { customerName: 'A' })
  assert.equal(response.status, 400)
  assert.equal(response.body.ok, false)
  assert.equal(response.body.error, 'Validation failed.')
})

test('email endpoint refuses unrestricted recipients in test mode', async () => {
  const response = await invoke('POST', '/api/messages/email', { to: 'customer@example.com', subject: 'Test', body: 'Test body' })
  assert.equal(response.status, 400)
  assert.equal(response.body.ok, false)
})
