import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { initialAppointments, initialConversations, initialLeads } from '../data/mockData'
import type { Conversation, DemoContextValue, Lead, LeadStatus, NewLeadInput, Toast, ToastVariant } from '../types'

const STORAGE_KEY = 'aquaflow-demo-state-v1'
const DemoContext = createContext<DemoContextValue | null>(null)

type StoredState = Pick<DemoContextValue, 'leads' | 'conversations' | 'appointments'>

const readStoredState = (): StoredState => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as StoredState
  } catch {
    // Demo state falls back to the seeded records when storage is unavailable.
  }
  return { leads: initialLeads, conversations: initialConversations, appointments: initialAppointments }
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(() => readStoredState().leads)
  const [conversations, setConversations] = useState<Conversation[]>(() => readStoredState().conversations)
  const [appointments, setAppointments] = useState(() => readStoredState().appointments)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ leads, conversations, appointments }))
  }, [leads, conversations, appointments])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((current) => [...current, { id, message, variant }])
    window.setTimeout(() => dismissToast(id), 4200)
  }, [dismissToast])

  const addLead = useCallback((input: NewLeadInput) => {
    const lead: Lead = {
      ...input,
      id: `AF-${String(Date.now()).slice(-5)}`,
      createdAt: new Date().toISOString(),
      status: 'New',
    }
    setLeads((current) => [lead, ...current])
    notify(`Demo lead ${lead.id} created and added to the pipeline.`)
    return lead
  }, [notify])

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status } : lead))
    notify(`Lead ${id} moved to ${status}.`, 'info')
  }, [notify])

  const sendConversationMessage = useCallback((conversationId: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    setConversations((current) => current.map((conversation) => conversation.id === conversationId ? {
      ...conversation,
      messages: [...conversation.messages, { id: `m-${Date.now()}`, sender: 'admin', text: trimmed, timestamp }],
      unread: 0,
      status: 'Active',
    } : conversation))
    notify('Reply added to the simulated inbox.', 'info')
  }, [notify])

  const markConversationRead = useCallback((conversationId: string) => {
    setConversations((current) => current.map((conversation) => conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation))
  }, [])

  const updateConversationStatus = useCallback((conversationId: string, status: Conversation['status']) => {
    setConversations((current) => current.map((conversation) => conversation.id === conversationId ? { ...conversation, status } : conversation))
    notify(`Conversation marked ${status.toLowerCase()}.`, 'info')
  }, [notify])

  const assignConversation = useCallback((conversationId: string, assignee: string) => {
    setConversations((current) => current.map((conversation) => conversation.id === conversationId ? { ...conversation, assignedTo: assignee } : conversation))
    notify(`Conversation assigned to ${assignee}.`, 'info')
  }, [notify])

  const resetDemo = useCallback(() => {
    setLeads(initialLeads)
    setConversations(initialConversations)
    setAppointments(initialAppointments)
    notify('Demo data reset to the original presentation state.', 'warning')
  }, [notify])

  const value = useMemo(() => ({ leads, conversations, appointments, toasts, addLead, updateLeadStatus, sendConversationMessage, markConversationRead, updateConversationStatus, assignConversation, notify, dismissToast, resetDemo }), [leads, conversations, appointments, toasts, addLead, updateLeadStatus, sendConversationMessage, markConversationRead, updateConversationStatus, assignConversation, notify, dismissToast, resetDemo])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) throw new Error('useDemo must be used within DemoProvider')
  return context
}
