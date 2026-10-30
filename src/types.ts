export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Follow-up Required'
  | 'Appointment Scheduled'
  | 'Converted'
  | 'Lost'

export type LeadSource = 'Website form' | 'AI chat demo' | 'Phone demo' | 'Referral demo'
export type ToastVariant = 'success' | 'info' | 'warning'

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

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

export interface DemoContextValue {
  leads: Lead[]
  conversations: Conversation[]
  appointments: Appointment[]
  toasts: Toast[]
  addLead: (input: NewLeadInput) => Lead
  updateLeadStatus: (id: string, status: LeadStatus) => void
  sendConversationMessage: (conversationId: string, text: string) => void
  markConversationRead: (conversationId: string) => void
  updateConversationStatus: (conversationId: string, status: Conversation['status']) => void
  assignConversation: (conversationId: string, assignee: string) => void
  notify: (message: string, variant?: ToastVariant) => void
  dismissToast: (id: string) => void
  resetDemo: () => void
}
