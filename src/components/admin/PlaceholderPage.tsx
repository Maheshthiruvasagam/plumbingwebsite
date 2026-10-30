import { ArrowUpRight, BarChart3, Bot, Building2, CheckCircle2, Settings2, Sparkles, UsersRound } from 'lucide-react'
import { useDemo } from '../../context/DemoContext'

const copy = {
  customers: { icon: UsersRound, eyebrow: 'Relationship view', title: 'Customers', description: 'A clean customer record view would sit here once this demo connects to a live CRM.', metric: '24', metricLabel: 'demo customer records' },
  assistant: { icon: Bot, eyebrow: 'AI experience', title: 'AI assistant', description: 'Show the client where a future assistant can be tuned, audited and reviewed by the team.', metric: '5', metricLabel: 'guided demo paths' },
  analytics: { icon: BarChart3, eyebrow: 'Performance insights', title: 'Analytics', description: 'A deeper reporting workspace for channels, response time and service revenue can grow from the dashboard foundation.', metric: '92%', metricLabel: 'simulated follow-up health' },
  settings: { icon: Settings2, eyebrow: 'Workspace controls', title: 'Settings', description: 'Brand, team and notification preferences can be configured here in a production build.', metric: 'Demo', metricLabel: 'workspace mode' },
} as const

export function PlaceholderPage({ kind }: { kind: keyof typeof copy }) {
  const { notify, resetDemo } = useDemo()
  const item = copy[kind]
  const Icon = item.icon
  return <div className="admin-page-stack"><div className="page-intro-row"><div><span className="eyebrow">{item.eyebrow}</span><h1>{item.title}</h1><p>{item.description}</p></div><div className="demo-chip"><Sparkles size={13} /> Presentation view</div></div><section className="placeholder-hero admin-card"><div className="placeholder-hero__icon"><Icon size={24} /></div><div><h2>A thoughtful next step, not a dead end.</h2><p>This secondary area is intentionally lightweight for the client demo while keeping the navigation functional and the product story coherent.</p><div className="placeholder-actions"><button className="button button--dark button--small" onClick={() => notify(`${item.title} preview action completed.`, 'info')}>Preview interaction <ArrowUpRight size={15} /></button>{kind === 'settings' && <button className="button button--light button--small" onClick={resetDemo}>Reset demo data</button>}</div></div></section><div className="placeholder-grid"><div className="admin-card placeholder-metric"><span className="eyebrow">Demo snapshot</span><strong>{item.metric}</strong><span>{item.metricLabel}</span></div><div className="admin-card placeholder-checklist"><span className="eyebrow">Built for the walkthrough</span><div><CheckCircle2 size={16} /><span>Responsive, client-ready layouts</span></div><div><CheckCircle2 size={16} /><span>Shared local demo state</span></div><div><CheckCircle2 size={16} /><span>Clear “simulated” labeling</span></div></div><div className="admin-card placeholder-note"><Building2 size={18} /><div><b>Production note</b><p>Connect this view to your preferred CRM, scheduling and communications tools when the concept is approved.</p></div></div></div></div>
}
