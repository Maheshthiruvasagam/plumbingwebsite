import { useMemo, useState } from 'react'
import { ArrowUpRight, CalendarDays, ChevronDown, Edit3, Mail, MoreHorizontal, Phone, Plus, Search, SlidersHorizontal, UserRound, X } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { serviceCatalog } from '../../data/mockData'
import { StatusBadge } from '../shared'
import type { LeadStatus } from '../../types'

const statuses: LeadStatus[] = ['New', 'Contacted', 'Follow-up Required', 'Appointment Scheduled', 'Converted', 'Lost']

export function LeadsPage() {
  const { leads, addLead, updateLeadStatus } = useDemo()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', service: serviceCatalog[0].name, issue: '' })
  const filteredLeads = useMemo(() => leads.filter((lead) => {
    const haystack = `${lead.customerName} ${lead.email} ${lead.phone} ${lead.service} ${lead.id}`.toLowerCase()
    return haystack.includes(query.toLowerCase()) && (statusFilter === 'All statuses' || lead.status === statusFilter)
  }), [leads, query, statusFilter])
  const selected = leads.find((lead) => lead.id === selectedId)

  const submitNewLead = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addLead({ ...form, source: 'Phone demo' })
    setShowAdd(false)
    setForm({ customerName: '', phone: '', email: '', service: serviceCatalog[0].name, issue: '' })
  }

  return (
    <div className="admin-page-stack">
      <div className="page-intro-row"><div><span className="eyebrow">Pipeline management</span><h1>Leads</h1><p>Track every request from first touch to completed service.</p></div><div className="page-actions"><button className="button button--dark button--small" onClick={() => setShowAdd(true)}><Plus size={16} /> Add new lead</button></div></div>
      <div className="filter-bar admin-card"><div className="search-field"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by customer, email or service..." /></div><div className="filter-divider" /><div className="select-wrap"><SlidersHorizontal size={15} /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option>All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={14} /></div><span className="filter-count">{filteredLeads.length} of {leads.length} leads</span></div>
      <section className="admin-card lead-table-card"><div className="card-heading"><div><span className="eyebrow">Live demo pipeline</span><h3>All leads</h3></div><button className="icon-button"><MoreHorizontal size={17} /></button></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Customer</th><th>Contact</th><th>Service</th><th>Source</th><th>Date</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{filteredLeads.map((lead) => <tr key={lead.id} onClick={() => setSelectedId(lead.id)}><td><div className="customer-cell"><span className="customer-avatar">{lead.customerName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><b>{lead.customerName}</b><span>{lead.id}</span></div></div></td><td><div className="contact-cell"><span>{lead.phone}</span><span>{lead.email}</span></div></td><td><span className="service-text">{lead.service}</span></td><td><span className="source-pill">{lead.source.replace(' demo', '')}</span></td><td>{new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td><td><StatusBadge status={lead.status} /></td><td><button className="icon-button icon-button--small" onClick={(event) => { event.stopPropagation(); setSelectedId(lead.id) }} aria-label={`Open ${lead.customerName}`}><ArrowUpRight size={15} /></button></td></tr>)}</tbody></table>{filteredLeads.length === 0 && <div className="empty-state"><Search size={22} /><b>No leads match this view</b><span>Try a different search or status filter.</span></div>}</div></section>
      {selected && <div className="drawer-backdrop" onClick={() => setSelectedId(null)}><aside className="details-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><span className="eyebrow">Lead details · {selected.id}</span><h2>{selected.customerName}</h2></div><button className="icon-button" onClick={() => setSelectedId(null)}><X size={18} /></button></div><div className="drawer-profile"><span className="profile-avatar">{selected.customerName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><b>{selected.service}</b><span>Created {new Date(selected.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span></div><StatusBadge status={selected.status} /></div><div className="drawer-section"><span className="drawer-label">Contact</span><a href={`tel:${selected.phone}`}><Phone size={15} /> {selected.phone}</a><a href={`mailto:${selected.email}`}><Mail size={15} /> {selected.email}</a><span><CalendarDays size={15} /> Demo follow-up queued</span></div><div className="drawer-section"><span className="drawer-label">Issue description</span><p className="issue-copy">{selected.issue}</p></div><div className="drawer-section"><span className="drawer-label">Update lead status</span><select className="full-select" value={selected.status} onChange={(event) => updateLeadStatus(selected.id, event.target.value as LeadStatus)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><div className="drawer-footer"><button className="button button--light button--full"><Edit3 size={15} /> Edit lead</button><button className="button button--dark button--full" onClick={() => setSelectedId(null)}>Done</button></div></aside></div>}
      {showAdd && <div className="modal-backdrop" onClick={() => setShowAdd(false)}><div className="modal-card" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">Manual entry</span><h2>Add a new lead</h2><p>Create a simulated lead for the presentation pipeline.</p></div><button className="icon-button" onClick={() => setShowAdd(false)}><X size={18} /></button></div><form className="modal-form" onSubmit={submitNewLead}><label>Customer name<input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Customer name" /></label><div className="form-grid"><label>Phone<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(312) 555-0140" /></label><label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" /></label></div><label>Service<select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>{serviceCatalog.map((service) => <option key={service.name}>{service.name}</option>)}</select></label><label>Issue description<textarea required rows={4} value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} placeholder="What does the customer need?" /></label><button className="button button--primary button--full" type="submit">Create demo lead <Plus size={16} /></button></form></div></div>}
    </div>
  )
}
