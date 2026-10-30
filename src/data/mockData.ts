import type { Appointment, Conversation, Lead } from '../types'

export const serviceCatalog = [
  { name: 'Emergency Plumbing', icon: 'Siren', description: 'Fast, calm help for leaks, backups and urgent water shutoffs.' },
  { name: 'Drain Cleaning', icon: 'Waves', description: 'Clear stubborn clogs and restore smooth, reliable flow.' },
  { name: 'Leak Detection', icon: 'ScanSearch', description: 'Pinpoint hidden leaks before they become expensive damage.' },
  { name: 'Water Heater Repair', icon: 'Flame', description: 'Get hot water back with diagnosis-led repairs and replacements.' },
  { name: 'Pipe Repair & Replacement', icon: 'GitBranch', description: 'Dependable pipework solutions built for long-term peace of mind.' },
  { name: 'Bathroom Plumbing', icon: 'Bath', description: 'Thoughtful repairs and upgrades for the room you use every day.' },
  { name: 'Kitchen Plumbing', icon: 'ChefHat', description: 'Keep sinks, disposals and fixtures moving in the heart of your home.' },
  { name: 'Commercial Plumbing', icon: 'Building2', description: 'Responsive service plans for offices, retail and facilities teams.' },
]

export const initialLeads: Lead[] = [
  {
    id: 'AF-10482', customerName: 'Maya Thompson', phone: '(312) 555-0142', email: 'maya.thompson@example.com',
    service: 'Leak Detection', issue: 'Water stain appeared below the upstairs bathroom.', source: 'Website form', createdAt: '2026-10-30T08:42:00', status: 'New',
  },
  {
    id: 'AF-10481', customerName: 'Jordan Lee', phone: '(773) 555-0188', email: 'jordan.lee@example.com',
    service: 'Drain Cleaning', issue: 'Kitchen sink is draining slowly and gurgling.', source: 'AI chat demo', createdAt: '2026-10-29T16:24:00', status: 'Contacted',
  },
  {
    id: 'AF-10480', customerName: 'Carlos Ramirez', phone: '(847) 555-0126', email: 'carlos.ramirez@example.com',
    service: 'Water Heater Repair', issue: 'No hot water since yesterday morning.', source: 'Phone demo', createdAt: '2026-10-29T13:15:00', status: 'Appointment Scheduled',
  },
  {
    id: 'AF-10479', customerName: 'Avery Morgan', phone: '(312) 555-0194', email: 'avery.morgan@example.com',
    service: 'Emergency Plumbing', issue: 'Active supply line leak under the laundry sink.', source: 'AI chat demo', createdAt: '2026-10-28T11:06:00', status: 'Converted',
  },
  {
    id: 'AF-10478', customerName: 'Priya Shah', phone: '(630) 555-0171', email: 'priya.shah@example.com',
    service: 'Bathroom Plumbing', issue: 'Looking for a quote to replace an aging faucet.', source: 'Referral demo', createdAt: '2026-10-27T09:38:00', status: 'Follow-up Required',
  },
]

export const initialConversations: Conversation[] = [
  {
    id: 'conv-1', customerName: 'Jordan Lee', phone: '(773) 555-0188', email: 'jordan.lee@example.com', service: 'Drain Cleaning', status: 'Active', unread: 2, leadId: 'AF-10481', assignedTo: 'Alex Rivera',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Hi, my kitchen sink is draining very slowly. Is that something you can help with?', timestamp: '09:12 AM' },
      { id: 'm2', sender: 'assistant', text: 'Absolutely. We can help diagnose the blockage and recommend the safest way to clear it. Is water backing up anywhere else?', timestamp: '09:13 AM' },
      { id: 'm3', sender: 'customer', text: 'No, just the sink. It has been getting worse over the last week.', timestamp: '09:14 AM' },
    ],
  },
  {
    id: 'conv-2', customerName: 'Maya Thompson', phone: '(312) 555-0142', email: 'maya.thompson@example.com', service: 'Leak Detection', status: 'New', unread: 1, leadId: 'AF-10482', assignedTo: 'Unassigned',
    messages: [
      { id: 'm4', sender: 'customer', text: 'I noticed a water stain below the upstairs bathroom this morning.', timestamp: '08:42 AM' },
      { id: 'm5', sender: 'assistant', text: 'Thanks for flagging that. We can help locate the source before it causes more damage. Do you see active dripping or damp flooring?', timestamp: '08:43 AM' },
    ],
  },
  {
    id: 'conv-3', customerName: 'Avery Morgan', phone: '(312) 555-0194', email: 'avery.morgan@example.com', service: 'Emergency Plumbing', status: 'Resolved', unread: 0, leadId: 'AF-10479', assignedTo: 'Nina Patel',
    messages: [
      { id: 'm6', sender: 'customer', text: 'The leak is stopped and a technician already helped us. Thank you!', timestamp: 'Yesterday' },
      { id: 'm7', sender: 'admin', text: 'We are glad we could help. Your demonstration request is marked converted for this client walkthrough.', timestamp: 'Yesterday' },
    ],
  },
]

export const initialAppointments: Appointment[] = [
  { id: 'APT-2084', customerName: 'Carlos Ramirez', service: 'Water Heater Repair', date: 'Today, Oct 30', time: '1:30 PM – 2:30 PM', status: 'Confirmed', address: '1842 W Addison St, Chicago' },
  { id: 'APT-2085', customerName: 'Priya Shah', service: 'Bathroom Plumbing', date: 'Tomorrow, Oct 31', time: '9:00 AM – 10:00 AM', status: 'Requested', address: '721 Maple Ave, Evanston' },
  { id: 'APT-2086', customerName: 'Avery Morgan', service: 'Emergency Plumbing', date: 'Nov 02', time: '10:00 AM – 11:00 AM', status: 'Completed', address: '55 North Ave, Oak Park' },
]

export const automationSteps = [
  { label: 'New Lead Created', detail: 'Trigger received from website or AI chat', status: 'complete', time: 'Just now' },
  { label: 'Welcome Email', detail: 'Demo message prepared for customer', status: 'complete', time: '1 min ago' },
  { label: 'WhatsApp Follow-up', detail: 'Simulated touchpoint queued', status: 'active', time: 'Waiting' },
  { label: 'Follow-up Reminder', detail: 'Team reminder scheduled for 24 hours', status: 'pending', time: 'Pending' },
  { label: 'Appointment Confirmation', detail: 'Sent after appointment is booked', status: 'pending', time: 'Pending' },
]
