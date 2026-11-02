export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Follow-up Required'
  | 'Appointment Scheduled'
  | 'Converted'
  | 'Lost'

export type LeadSource = 'Website form' | 'AI chat demo' | 'Phone demo' | 'Referral demo'
export type ToastVariant = 'success' | 'info' | 'warning'
export type ExecutionStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled'
export type WorkflowStepKey = 'lead-created' | 'welcome-email' | 'whatsapp-follow-up' | 'follow-up-reminder' | 'appointment-confirmation'
export type WorkflowStepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused'
export type FollowUpTaskStatus = 'pending' | 'completed' | 'snoozed' | 'cancelled'
export type MessagePreviewKind = 'welcome-email' | 'whatsapp-follow-up' | 'follow-up-reminder' | 'appointment-email' | 'appointment-whatsapp'

export interface Lead {
  id: string
  customerName: string
  phone: string
  email: string
  service: string
  issue: string
  source: LeadSource
  createdAt: string
  status: LeadStatus
}

export interface DemoMessage {
  id: string
  sender: 'customer' | 'assistant' | 'admin'
  text: string
  timestamp: string
}

export interface Conversation {
  id: string
  customerName: string
  phone: string
  email: string
  service: string
  status: 'New' | 'Active' | 'Resolved'
  unread: number
  leadId: string
  assignedTo: string
  messages: DemoMessage[]
}

export interface Appointment {
  id: string
  customerName: string
  service: string
  date: string
  time: string
  status: 'Requested' | 'Confirmed' | 'Completed'
  address: string
}

export interface NewLeadInput {
  customerName: string
  phone: string
  email: string
  service: string
  issue: string
  source: LeadSource
}

export interface WorkflowStep {
  key: WorkflowStepKey
  title: string
  description: string
  status: WorkflowStepStatus
  executionAt?: string
  processedCount: number
}

export interface WorkflowExecution {
  id: string
  leadId: string
  status: ExecutionStatus
  currentStepIndex: number
  startedAt?: string
  completedAt?: string
  steps: WorkflowStep[]
}

export interface FollowUpTask {
  id: string
  leadId: string
  type: 'reminder' | 'appointment-confirmation'
  title: string
  scheduledFor: string
  status: FollowUpTaskStatus
  createdAt: string
  completedAt?: string
}

export interface AutomationActivity {
  id: string
  leadId: string
  customerName: string
  step: WorkflowStepKey
  action: string
  status: 'completed' | 'pending' | 'running' | 'paused' | 'cancelled' | 'failed'
  timestamp: string
}

export interface MessagePreview {
  id: string
  leadId: string
  kind: MessagePreviewKind
  title: string
  recipient: string
  subject?: string
  body: string
  createdAt: string
  simulated: true
}

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

export interface DemoContextValue {
  leads: Lead[]
  conversations: Conversation[]
  appointments: Appointment[]
  workflows: WorkflowExecution[]
  followUpTasks: FollowUpTask[]
  automationActivities: AutomationActivity[]
  messagePreviews: MessagePreview[]
  toasts: Toast[]
  addLead: (input: NewLeadInput) => Lead
  updateLeadStatus: (id: string, status: LeadStatus) => void
  runWorkflow: (leadId: string) => void
  pauseWorkflow: (leadId: string) => void
  resumeWorkflow: (leadId: string) => void
  resetWorkflow: (leadId: string) => void
  completeReminder: (taskId: string) => void
  snoozeReminder: (taskId: string) => void
  cancelReminder: (taskId: string) => void
  getWorkflowForLead: (leadId: string) => WorkflowExecution | undefined
  getPreviewForLead: (leadId: string, kind?: MessagePreviewKind) => MessagePreview | undefined
  sendConversationMessage: (conversationId: string, text: string) => void
  markConversationRead: (conversationId: string) => void
  updateConversationStatus: (conversationId: string, status: Conversation['status']) => void
  assignConversation: (conversationId: string, assignee: string) => void
  notify: (message: string, variant?: ToastVariant) => void
  dismissToast: (id: string) => void
  resetDemo: () => void
}
