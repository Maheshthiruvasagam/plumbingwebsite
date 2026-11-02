import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { initialAppointments, initialConversations, initialLeads } from '../data/mockData'
import type { AutomationActivity, Conversation, DemoContextValue, FollowUpTask, Lead, LeadStatus, MessagePreview, MessagePreviewKind, NewLeadInput, Toast, ToastVariant, WorkflowExecution, WorkflowStep, WorkflowStepKey } from '../types'

const STORAGE_KEY = 'aquaflow-demo-state-v2'
const LEGACY_STORAGE_KEY = 'aquaflow-demo-state-v1'
const DemoContext = createContext<DemoContextValue | null>(null)

const stepBlueprint: Array<Pick<WorkflowStep, 'key' | 'title' | 'description'>> = [
  { key: 'lead-created', title: 'New Lead Created', description: 'Trigger received from a website, chat or admin form.' },
  { key: 'welcome-email', title: 'Welcome Email', description: 'Prepare a personalized first-touch email preview.' },
  { key: 'whatsapp-follow-up', title: 'WhatsApp Follow-up', description: 'Prepare a personalized simulated WhatsApp message.' },
  { key: 'follow-up-reminder', title: 'Follow-up Reminder', description: 'Create a team task for the next human touchpoint.' },
  { key: 'appointment-confirmation', title: 'Appointment Confirmation', description: 'Confirm the requested appointment by email and WhatsApp.' },
]

const now = () => new Date().toISOString()
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
const displayTime = (value: string) => new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

const makeWorkflow = (lead: Lead): WorkflowExecution => ({
  id: uid('wf'),
  leadId: lead.id,
  status: 'idle',
  currentStepIndex: 0,
  steps: stepBlueprint.map((blueprint, index) => ({ ...blueprint, status: index === 0 ? 'completed' : 'pending', processedCount: index === 0 ? 1 : 0, executionAt: index === 0 ? lead.createdAt : undefined })),
})

const makeSeedWorkflows = (leads: Lead[]) => leads.map(makeWorkflow)

type PersistedState = {
  version?: number
  leads: Lead[]
  conversations: Conversation[]
  appointments: typeof initialAppointments
  workflows: WorkflowExecution[]
  followUpTasks: FollowUpTask[]
  automationActivities: AutomationActivity[]
  messagePreviews: MessagePreview[]
}

const seedState = (): PersistedState => ({ version: 2, leads: initialLeads, conversations: initialConversations, appointments: initialAppointments, workflows: makeSeedWorkflows(initialLeads), followUpTasks: [], automationActivities: [], messagePreviews: [] })

const readStoredState = (): PersistedState => {
  try {
    const current = window.localStorage.getItem(STORAGE_KEY)
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    const parsed = current ? JSON.parse(current) as Partial<PersistedState> : legacy ? JSON.parse(legacy) as Partial<PersistedState> : undefined
    if (parsed && Array.isArray(parsed.leads) && Array.isArray(parsed.conversations) && Array.isArray(parsed.appointments)) {
      const leads = parsed.leads as Lead[]
      return {
        version: 2,
        leads,
        conversations: parsed.conversations as Conversation[],
        appointments: parsed.appointments,
        workflows: Array.isArray(parsed.workflows) ? parsed.workflows : makeSeedWorkflows(leads),
        followUpTasks: Array.isArray(parsed.followUpTasks) ? parsed.followUpTasks : [],
        automationActivities: Array.isArray(parsed.automationActivities) ? parsed.automationActivities : [],
        messagePreviews: Array.isArray(parsed.messagePreviews) ? parsed.messagePreviews : [],
      }
    }
  } catch {
    // Corrupted or unavailable demo storage safely falls back to seed records.
  }
  return seedState()
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [initialState] = useState<PersistedState>(readStoredState)
  const [leads, setLeads] = useState<Lead[]>(initialState.leads)
  const [conversations, setConversations] = useState<Conversation[]>(initialState.conversations)
  const [appointments, setAppointments] = useState(initialState.appointments)
  const [workflows, setWorkflows] = useState<WorkflowExecution[]>(initialState.workflows)
  const [followUpTasks, setFollowUpTasks] = useState<FollowUpTask[]>(initialState.followUpTasks)
  const [automationActivities, setAutomationActivities] = useState<AutomationActivity[]>(initialState.automationActivities)
  const [messagePreviews, setMessagePreviews] = useState<MessagePreview[]>(initialState.messagePreviews)
  const [toasts, setToasts] = useState<Toast[]>([])
  const leadsRef = useRef(leads)
  const workflowsRef = useRef(workflows)
  const followUpTasksRef = useRef(followUpTasks)
  const timersRef = useRef<Record<string, number | undefined>>({})
  const runningRef = useRef<Record<string, boolean>>({})

  useEffect(() => { leadsRef.current = leads }, [leads])
  useEffect(() => { workflowsRef.current = workflows }, [workflows])
  useEffect(() => { followUpTasksRef.current = followUpTasks }, [followUpTasks])
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, leads, conversations, appointments, workflows, followUpTasks, automationActivities, messagePreviews }))
    } catch {
      // The demo remains usable if browser storage is blocked or full.
    }
  }, [leads, conversations, appointments, workflows, followUpTasks, automationActivities, messagePreviews])

  const dismissToast = (id: string) => setToasts((current) => current.filter((toast) => toast.id !== id))
  const notify = (message: string, variant: ToastVariant = 'success') => {
    const id = uid('toast')
    setToasts((current) => [...current, { id, message, variant }])
    window.setTimeout(() => dismissToast(id), 4200)
  }

  const addActivity = (lead: Lead, step: WorkflowStepKey, action: string, status: AutomationActivity['status']) => {
    setAutomationActivities((current) => [{ id: uid('activity'), leadId: lead.id, customerName: lead.customerName, step, action, status, timestamp: now() }, ...current].slice(0, 100))
  }

  const updateWorkflowState = (leadId: string, updater: (workflow: WorkflowExecution) => WorkflowExecution) => {
    const next = workflowsRef.current.map((workflow) => workflow.leadId === leadId ? updater(workflow) : workflow)
    workflowsRef.current = next
    setWorkflows(next)
    return next.find((workflow) => workflow.leadId === leadId)
  }

  const upsertPreview = (lead: Lead, kind: MessagePreviewKind, body: string, recipient: string, subject?: string) => {
    const preview: MessagePreview = { id: uid('preview'), leadId: lead.id, kind, title: kind === 'welcome-email' ? 'Welcome email' : kind === 'whatsapp-follow-up' ? 'WhatsApp follow-up' : kind === 'follow-up-reminder' ? 'Follow-up reminder' : kind === 'appointment-email' ? 'Appointment confirmation email' : 'Appointment confirmation WhatsApp', recipient, subject, body, createdAt: now(), simulated: true }
    setMessagePreviews((current) => [preview, ...current.filter((item) => !(item.leadId === lead.id && item.kind === kind))])
    return preview
  }

  const ensureReminder = (lead: Lead) => {
    if (followUpTasksRef.current.some((task) => task.leadId === lead.id && task.type === 'reminder' && task.status !== 'cancelled')) return
    const task: FollowUpTask = { id: uid('task'), leadId: lead.id, type: 'reminder', title: `Follow up with ${lead.customerName}`, scheduledFor: new Date(Date.now() + 10 * 60 * 1000).toISOString(), status: 'pending', createdAt: now() }
    const next = [...followUpTasksRef.current, task]
    followUpTasksRef.current = next
    setFollowUpTasks(next)
    upsertPreview(lead, 'follow-up-reminder', `Reminder: follow up with ${lead.customerName} about their ${lead.service} request. Customer phone: ${lead.phone}.`, lead.phone)
  }

  const triggerAppointmentConfirmation = (lead: Lead) => {
    const appointmentText = `Appointment requested for ${lead.customerName}: ${lead.service} service, tomorrow at 10:00 AM. This confirmation is simulated for the demo.`
    upsertPreview(lead, 'appointment-email', appointmentText, lead.email, 'Your AquaFlow Plumbing appointment is confirmed')
    upsertPreview(lead, 'appointment-whatsapp', `Hi ${lead.customerName}! Your AquaFlow Plumbing appointment for ${lead.service} is confirmed for tomorrow at 10:00 AM. This is a simulated WhatsApp message.`, lead.phone)
    updateWorkflowState(lead.id, (workflow) => ({ ...workflow, status: workflow.status === 'running' ? workflow.status : 'completed', completedAt: now(), steps: workflow.steps.map((step) => step.key === 'appointment-confirmation' ? { ...step, status: 'completed', processedCount: step.processedCount + 1, executionAt: now() } : step) }))
    addActivity(lead, 'appointment-confirmation', 'Appointment email and WhatsApp previews prepared', 'completed')
    notify(`Appointment confirmation previews prepared for ${lead.customerName}.`, 'info')
  }

  const executeStep = (leadId: string, index: number) => {
    const lead = leadsRef.current.find((item) => item.id === leadId)
    const workflow = workflowsRef.current.find((item) => item.leadId === leadId)
    if (!lead || !workflow || !runningRef.current[leadId] || index >= workflow.steps.length) return
    const step = workflow.steps[index]
    updateWorkflowState(leadId, (current) => ({ ...current, status: 'running', currentStepIndex: index, steps: current.steps.map((item, itemIndex) => itemIndex === index ? { ...item, status: 'running' } : item) }))
    addActivity(lead, step.key, `Started ${step.title.toLowerCase()}`, 'running')
    timersRef.current[leadId] = window.setTimeout(() => {
      if (!runningRef.current[leadId]) return
      const executedAt = now()
      updateWorkflowState(leadId, (current) => ({ ...current, currentStepIndex: index, steps: current.steps.map((item, itemIndex) => itemIndex === index ? { ...item, status: 'completed', processedCount: item.processedCount + 1, executionAt: executedAt } : item) }))
      addActivity(lead, step.key, `${step.title} completed`, 'completed')
      if (step.key === 'welcome-email') upsertPreview(lead, 'welcome-email', `Hello ${lead.customerName},\n\nThank you for reaching out to AquaFlow Plumbing. We have received your request regarding ${lead.service}.\n\nOur team will review your request and contact you shortly.\n\nRegards,\nAquaFlow Plumbing Team`, lead.email, 'Thank you for contacting AquaFlow Plumbing!')
      if (step.key === 'whatsapp-follow-up') upsertPreview(lead, 'whatsapp-follow-up', `Hello ${lead.customerName}!\n\nThank you for contacting AquaFlow Plumbing. We received your request for ${lead.service}. Our team will contact you shortly.\n\nThank you!`, lead.phone)
      if (step.key === 'follow-up-reminder') ensureReminder(lead)
      if (step.key === 'appointment-confirmation') triggerAppointmentConfirmation(lead)
      if (index === workflow.steps.length - 1) {
        runningRef.current[leadId] = false
        delete timersRef.current[leadId]
        updateWorkflowState(leadId, (current) => ({ ...current, status: 'completed', completedAt: executedAt }))
        notify(`Demo workflow completed for ${lead.customerName}.`)
      } else {
        timersRef.current[leadId] = window.setTimeout(() => executeStep(leadId, index + 1), 750)
      }
    }, 1500)
  }

  const addLead = (input: NewLeadInput) => {
    const lead: Lead = { ...input, id: `AF-${String(Date.now()).slice(-5)}`, createdAt: now(), status: 'New' }
    setLeads((current) => [lead, ...current])
    const workflow = makeWorkflow(lead)
    workflowsRef.current = [workflow, ...workflowsRef.current]
    setWorkflows(workflowsRef.current)
    addActivity(lead, 'lead-created', 'New lead created and workflow queued', 'completed')
    notify(`Demo lead ${lead.id} created and added to the pipeline.`)
    return lead
  }

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    const lead = leadsRef.current.find((item) => item.id === id)
    if (!lead) return
    setLeads((current) => current.map((item) => item.id === id ? { ...item, status } : item))
    addActivity({ ...lead, status }, 'lead-created', `Lead status updated to ${status}`, 'completed')
    if (status === 'Appointment Scheduled') triggerAppointmentConfirmation({ ...lead, status })
    notify(`Lead ${id} moved to ${status}.`, 'info')
  }

  const runWorkflow = (leadId: string) => {
    const lead = leadsRef.current.find((item) => item.id === leadId)
    const workflow = workflowsRef.current.find((item) => item.leadId === leadId)
    if (!lead || !workflow) return
    if (runningRef.current[leadId]) { notify('This workflow is already running.'); return }
    if (timersRef.current[leadId]) window.clearTimeout(timersRef.current[leadId])
    runningRef.current[leadId] = true
    updateWorkflowState(leadId, (current) => ({ ...current, status: 'running', currentStepIndex: 0, startedAt: now(), completedAt: undefined, steps: current.steps.map((step) => ({ ...step, status: 'pending', executionAt: undefined, processedCount: 0 })) }))
    notify(`Demo workflow started for ${lead.customerName}.`, 'info')
    timersRef.current[leadId] = window.setTimeout(() => executeStep(leadId, 0), 350)
  }

  const pauseWorkflow = (leadId: string) => {
    const workflow = workflowsRef.current.find((item) => item.leadId === leadId)
    const lead = leadsRef.current.find((item) => item.id === leadId)
    if (!workflow || !lead || !runningRef.current[leadId]) return
    if (timersRef.current[leadId]) window.clearTimeout(timersRef.current[leadId])
    runningRef.current[leadId] = false
    updateWorkflowState(leadId, (current) => ({ ...current, status: 'paused', steps: current.steps.map((step) => step.status === 'running' ? { ...step, status: 'paused' } : step) }))
    addActivity(lead, workflow.steps[workflow.currentStepIndex].key, 'Workflow paused by admin', 'paused')
    notify('Workflow paused. Resume when you are ready.', 'warning')
  }

  const resumeWorkflow = (leadId: string) => {
    const workflow = workflowsRef.current.find((item) => item.leadId === leadId)
    const lead = leadsRef.current.find((item) => item.id === leadId)
    if (!workflow || !lead || workflow.status !== 'paused') return
    const nextIndex = workflow.steps[workflow.currentStepIndex]?.status === 'completed' ? workflow.currentStepIndex + 1 : workflow.currentStepIndex
    runningRef.current[leadId] = true
    updateWorkflowState(leadId, (current) => ({ ...current, status: 'running', steps: current.steps.map((step) => step.status === 'paused' ? { ...step, status: 'pending' } : step) }))
    addActivity(lead, workflow.steps[Math.min(nextIndex, workflow.steps.length - 1)].key, 'Workflow resumed by admin', 'running')
    notify('Workflow resumed.', 'info')
    executeStep(leadId, Math.min(nextIndex, workflow.steps.length - 1))
  }

  const resetWorkflow = (leadId: string) => {
    if (timersRef.current[leadId]) window.clearTimeout(timersRef.current[leadId])
    runningRef.current[leadId] = false
    const lead = leadsRef.current.find((item) => item.id === leadId)
    updateWorkflowState(leadId, (current) => ({ ...current, status: 'idle', currentStepIndex: 0, startedAt: undefined, completedAt: undefined, steps: current.steps.map((step, index) => ({ ...step, status: index === 0 ? 'completed' : 'pending', executionAt: index === 0 ? lead?.createdAt : undefined, processedCount: index === 0 ? 1 : 0 })) }))
    setFollowUpTasks((current) => current.filter((task) => task.leadId !== leadId))
    setMessagePreviews((current) => current.filter((preview) => preview.leadId !== leadId))
    if (lead) addActivity(lead, 'lead-created', 'Workflow reset by admin', 'pending')
    notify('Workflow reset to its starting state.', 'warning')
  }

  const updateTask = (taskId: string, status: FollowUpTask['status'], action: string) => {
    const task = followUpTasksRef.current.find((item) => item.id === taskId)
    if (!task) return
    const lead = leadsRef.current.find((item) => item.id === task.leadId)
    const next = followUpTasksRef.current.map((item) => item.id === taskId ? { ...item, status, completedAt: status === 'completed' ? now() : item.completedAt, scheduledFor: status === 'snoozed' ? new Date(Date.now() + 10 * 60 * 1000).toISOString() : item.scheduledFor } : item)
    followUpTasksRef.current = next
    setFollowUpTasks(next)
    if (lead) addActivity(lead, 'follow-up-reminder', action, status === 'cancelled' ? 'cancelled' : status === 'completed' ? 'completed' : 'pending')
    notify(action, status === 'cancelled' ? 'warning' : 'info')
  }

  const completeReminder = (taskId: string) => updateTask(taskId, 'completed', 'Reminder completed by admin')
  const snoozeReminder = (taskId: string) => updateTask(taskId, 'snoozed', 'Reminder snoozed for 10 minutes')
  const cancelReminder = (taskId: string) => updateTask(taskId, 'cancelled', 'Reminder cancelled by admin')
  const getWorkflowForLead = (leadId: string) => workflows.find((workflow) => workflow.leadId === leadId)
  const getPreviewForLead = (leadId: string, kind?: MessagePreviewKind) => messagePreviews.find((preview) => preview.leadId === leadId && (!kind || preview.kind === kind))

  const sendConversationMessage = (conversationId: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const timestamp = displayTime(now())
    setConversations((current) => current.map((conversation) => conversation.id === conversationId ? { ...conversation, messages: [...conversation.messages, { id: uid('message'), sender: 'admin', text: trimmed, timestamp }], unread: 0, status: 'Active' } : conversation))
    notify('Reply added to the simulated inbox.', 'info')
  }
  const markConversationRead = (conversationId: string) => setConversations((current) => current.map((conversation) => conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation))
  const updateConversationStatus = (conversationId: string, status: Conversation['status']) => { setConversations((current) => current.map((conversation) => conversation.id === conversationId ? { ...conversation, status } : conversation)); notify(`Conversation marked ${status.toLowerCase()}.`, 'info') }
  const assignConversation = (conversationId: string, assignee: string) => { setConversations((current) => current.map((conversation) => conversation.id === conversationId ? { ...conversation, assignedTo: assignee } : conversation)); notify(`Conversation assigned to ${assignee}.`, 'info') }

  const resetDemo = () => {
    Object.values(timersRef.current).forEach((timer) => { if (timer) window.clearTimeout(timer) })
    timersRef.current = {}
    runningRef.current = {}
    const next = seedState()
    leadsRef.current = next.leads
    workflowsRef.current = next.workflows
    setLeads(next.leads); setConversations(next.conversations); setAppointments(next.appointments); setWorkflows(next.workflows); setFollowUpTasks([]); setAutomationActivities([]); setMessagePreviews([])
    notify('Demo data reset to the original presentation state.', 'warning')
  }

  const value: DemoContextValue = { leads, conversations, appointments, workflows, followUpTasks, automationActivities, messagePreviews, toasts, addLead, updateLeadStatus, runWorkflow, pauseWorkflow, resumeWorkflow, resetWorkflow, completeReminder, snoozeReminder, cancelReminder, getWorkflowForLead, getPreviewForLead, sendConversationMessage, markConversationRead, updateConversationStatus, assignConversation, notify, dismissToast, resetDemo }
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) throw new Error('useDemo must be used within DemoProvider')
  return context
}
