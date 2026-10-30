import { useEffect, useRef, useState } from 'react'
import { Bot, CalendarDays, Check, ChevronDown, CircleHelp, Clock3, MessageCircle, Phone, Send, Sparkles, X } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import type { DemoMessage } from '../../types'

type ChatStep = 'idle' | 'issue' | 'name' | 'contact' | 'date' | 'done'

const quickActions = ['Emergency Plumbing', 'Schedule a Service', 'Get a Service Estimate', 'Track My Request', 'Talk to Support']

const timeNow = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

export function ChatWidget() {
  const { addLead } = useDemo()
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const [step, setStep] = useState<ChatStep>('idle')
  const [chatLead, setChatLead] = useState({ service: 'General Plumbing', issue: '', name: '', contact: '', emergency: false })
  const [messages, setMessages] = useState<DemoMessage[]>([
    { id: 'welcome', sender: 'assistant', text: 'Hi! Welcome to AquaFlow Plumbing. How can we help you today?', timestamp: timeNow() },
  ])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const addMessage = (sender: DemoMessage['sender'], text: string) => setMessages((current) => [...current, { id: `${Date.now()}-${Math.random()}`, sender, text, timestamp: timeNow() }])
  const reply = (text: string, callback?: () => void) => {
    setTyping(true)
    window.setTimeout(() => { setTyping(false); addMessage('assistant', text); callback?.() }, 560)
  }

  const startAction = (action: string) => {
    addMessage('customer', action)
    if (action === 'Emergency Plumbing') {
      setChatLead((current) => ({ ...current, service: 'Emergency Plumbing', emergency: true }))
      setStep('issue')
      reply('I can help triage that. Is water actively flowing, is there a sewage backup, or do you smell gas? Tell me what you are seeing right now.')
    } else if (action === 'Schedule a Service') {
      setStep('issue')
      reply('Great. What plumbing issue would you like a technician to look at? A short description is perfect.')
    } else if (action === 'Get a Service Estimate') {
      setStep('issue')
      reply('Happy to help you get a starting point. What service do you think you need, and what are you noticing?')
    } else if (action === 'Track My Request') {
      reply('This client demo does not connect to a live dispatch system, but the admin dashboard can show how a request would move from New to Appointment Scheduled.')
    } else {
      reply('You are in the right place. I can collect the basics for a team member, or you can call (312) 555-0140 during demo hours.')
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = draft.trim()
    if (!value || typing) return
    addMessage('customer', value)
    setDraft('')
    if (step === 'idle') {
      setStep('issue')
      setChatLead((current) => ({ ...current, issue: value }))
      reply('Thanks — I can help with that. Is this an emergency, and which name should we put on the request?', () => setStep('name'))
    } else if (step === 'issue') {
      setChatLead((current) => ({ ...current, issue: value }))
      reply('Got it. What name should we use for the request?', () => setStep('name'))
    } else if (step === 'name') {
      setChatLead((current) => ({ ...current, name: value }))
      reply('Thanks. What phone number and email should the team use to follow up?', () => setStep('contact'))
    } else if (step === 'contact') {
      setChatLead((current) => ({ ...current, contact: value }))
      reply('Almost there. What day would you prefer for an appointment? You can say “tomorrow” or give a date.', () => setStep('date'))
    } else if (step === 'date') {
      const phone = value.match(/(?:\+?1[ -.]?)?(?:\(?\d{3}\)?[ -.]?)\d{3}[ -.]?\d{4}/)?.[0] ?? chatLead.contact.match(/(?:\+?1[ -.]?)?(?:\(?\d{3}\)?[ -.]?)\d{3}[ -.]?\d{4}/)?.[0] ?? '(312) 555-0199'
      const email = chatLead.contact.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0] ?? 'demo.customer@example.com'
      const lead = addLead({ customerName: chatLead.name || 'Demo Customer', phone, email, service: chatLead.service, issue: `${chatLead.emergency ? '[Emergency] ' : ''}${chatLead.issue || 'Plumbing service request'} Preferred date: ${value}.`, source: 'AI chat demo' })
      reply(`You’re all set. I created demo lead ${lead.id} for the AquaFlow team. A live version would now confirm the next available appointment by phone or email.`, () => setStep('done'))
    }
  }

  return (
    <>
      {open && <div className="chat-panel" role="dialog" aria-label="AquaFlow demo support chat"><div className="chat-header"><div className="chat-agent"><span className="chat-agent__avatar"><Bot size={19} /></span><div><b>AquaFlow support</b><span><i /> Online · demo assistant</span></div></div><button className="icon-button icon-button--light" onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button></div><div className="chat-notice"><Sparkles size={13} /> Predefined demo responses · no live AI connected</div><div className="chat-messages">{messages.map((message) => <div className={`chat-message chat-message--${message.sender}`} key={message.id}><div className="chat-bubble">{message.text}</div><span>{message.timestamp}</span></div>)}{typing && <div className="chat-message chat-message--assistant"><div className="chat-bubble typing"><i /><i /><i /></div></div>}<div ref={endRef} /></div>{step === 'idle' && <div className="chat-quick"><span>Try a demo path</span><div>{quickActions.map((action) => <button key={action} onClick={() => startAction(action)}>{action === 'Emergency Plumbing' ? <Phone size={13} /> : action === 'Schedule a Service' ? <CalendarDays size={13} /> : action === 'Track My Request' ? <Clock3 size={13} /> : action === 'Talk to Support' ? <MessageCircle size={13} /> : <CircleHelp size={13} />}{action}</button>)}</div></div>}{step === 'done' && <button className="chat-reset" onClick={() => { setStep('idle'); setChatLead({ service: 'General Plumbing', issue: '', name: '', contact: '', emergency: false }); addMessage('assistant', 'What else can we help you explore in the demo?') }}>Start another demo path</button>}<form className="chat-input" onSubmit={handleSubmit}><input aria-label="Chat message" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={step === 'date' ? 'Preferred appointment day...' : 'Type a message...'} /><button type="submit" aria-label="Send message"><Send size={16} /></button></form></div>}
      <button className={`chat-launcher ${open ? 'chat-launcher--open' : ''}`} onClick={() => setOpen((current) => !current)} aria-label={open ? 'Close support chat' : 'Open support chat'}>{open ? <ChevronDown size={23} /> : <><MessageCircle size={22} /><span className="chat-launcher__ping"><i /></span></>}</button>
    </>
  )
}
