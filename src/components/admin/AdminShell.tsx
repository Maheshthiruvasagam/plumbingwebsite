import { useState } from 'react'
import { Activity, BarChart3, Bell, Bot, CalendarDays, ChevronLeft, ChevronRight, Command, GitBranch, LayoutDashboard, Menu, MessageSquare, Settings2, Sparkles, Users, UsersRound, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../BrandMark'
import { OverviewPage } from './OverviewPage'
import { LeadsPage } from './LeadsPage'
import { ConversationsPage } from './ConversationsPage'
import { AutomationPage } from './AutomationPage'
import { AppointmentsPage } from './AppointmentsPage'
import { PlaceholderPage } from './PlaceholderPage'

type AdminView = 'overview' | 'leads' | 'customers' | 'conversations' | 'assistant' | 'automation' | 'appointments' | 'analytics' | 'settings'
const navItems: { id: AdminView; label: string; icon: typeof LayoutDashboard; section?: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users, section: 'Manage' },
  { id: 'customers', label: 'Customers', icon: UsersRound },
  { id: 'conversations', label: 'Conversations', icon: MessageSquare },
  { id: 'assistant', label: 'AI Assistant', icon: Bot, section: 'Operate' },
  { id: 'automation', label: 'Follow-up Automation', icon: GitBranch },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, section: 'Workspace' },
  { id: 'settings', label: 'Settings', icon: Settings2 },
]
const titles: Record<AdminView, string> = { overview: 'Overview', leads: 'Leads', customers: 'Customers', conversations: 'Conversations', assistant: 'AI Assistant', automation: 'Follow-up Automation', appointments: 'Appointments', analytics: 'Analytics', settings: 'Settings' }

export function AdminShell() {
  const [activeView, setActiveView] = useState<AdminView>('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const openView = (view: AdminView) => { setActiveView(view); setMobileOpen(false) }
  const renderContent = () => {
    if (activeView === 'overview') return <OverviewPage onOpenLeads={() => openView('leads')} />
    if (activeView === 'leads') return <LeadsPage />
    if (activeView === 'conversations') return <ConversationsPage />
    if (activeView === 'automation') return <AutomationPage />
    if (activeView === 'appointments') return <AppointmentsPage />
    return <PlaceholderPage kind={activeView as 'customers' | 'assistant' | 'analytics' | 'settings'} />
  }
  return <div className={`admin-app ${collapsed ? 'admin-app--collapsed' : ''}`}><aside className={`admin-sidebar ${mobileOpen ? 'admin-sidebar--open' : ''}`}><div className="sidebar-top"><Link to="/admin-demo" className="sidebar-brand"><BrandMark /><span className="sidebar-brand__compact"><Command size={19} /></span></Link><button className="sidebar-collapse" onClick={() => setCollapsed((value) => !value)} aria-label="Collapse sidebar">{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button><button className="sidebar-mobile-close" onClick={() => setMobileOpen(false)}><X size={18} /></button></div><div className="sidebar-demo-label"><span className="demo-dot" /> <span>Client demo workspace</span></div><nav className="admin-nav">{navItems.map((item) => { const Icon = item.icon; return <div key={item.id}>{item.section && !collapsed && <span className="nav-section-label">{item.section}</span>}<button className={`admin-nav__item ${activeView === item.id ? 'admin-nav__item--active' : ''}`} onClick={() => openView(item.id)} title={collapsed ? item.label : undefined}><Icon size={17} /><span>{item.label}</span>{item.id === 'leads' && <em>5</em>}{item.id === 'conversations' && <em className="nav-badge">3</em>}</button></div> })}</nav><div className="sidebar-bottom"><div className="sidebar-help"><Sparkles size={16} /><div><b>Need a hand?</b><span>Demo support is ready.</span></div></div><Link to="/" className="back-to-site"><ChevronLeft size={15} /> <span>Back to public site</span></Link><div className="sidebar-user"><span className="user-avatar">AR</span><div><b>Alex Rivera</b><span>Admin · Demo</span></div><button className="icon-button icon-button--small"><Settings2 size={14} /></button></div></div></aside><div className="admin-main"><header className="admin-header"><div className="admin-header__left"><button className="admin-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open dashboard navigation"><Menu size={20} /></button><div className="breadcrumb"><span>AquaFlow</span><ChevronRight size={14} /><b>{titles[activeView]}</b></div></div><div className="admin-header__right"><span className="demo-chip"><span className="demo-dot" /> Simulation mode</span><button className="icon-button"><Bell size={17} /><i className="notification-dot" /></button><span className="header-date">Oct 30, 2026</span></div></header><main className="admin-content">{renderContent()}</main></div>{mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}</div>
}
