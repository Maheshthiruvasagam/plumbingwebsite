import { useState } from 'react'
import { ArrowRight, ArrowUpRight, BadgeCheck, Bath, Building2, Check, CheckCircle2, ChefHat, ChevronRight, Clock3, Droplets, Flame, GitBranch, Menu, Phone, ScanSearch, ShieldCheck, Siren, Star, Waves, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDemo } from '../../context/DemoContext'
import { serviceCatalog } from '../../data/mockData'
import { SectionHeading } from '../shared'
import { ChatWidget } from './ChatWidget'
import type { LucideIcon } from 'lucide-react'

const serviceIcons: Record<string, LucideIcon> = { Siren, Waves, ScanSearch, Flame, GitBranch, Bath, ChefHat, Building2 }

const testimonials = [
  { quote: 'The technician explained everything before touching a tool. We felt looked after, not sold to.', name: 'Sarah K.', location: 'Oak Park, IL', initials: 'SK' },
  { quote: 'AquaFlow showed up when they said they would and had our water heater running the same afternoon.', name: 'David R.', location: 'Evanston, IL', initials: 'DR' },
  { quote: 'The communication was clear from the first message. Exactly what a busy homeowner needs.', name: 'Monica T.', location: 'Chicago, IL', initials: 'MT' },
]

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export function PublicSite() {
  const { addLead, notify } = useDemo()
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ customerName: '', email: '', phone: '', address: '', service: 'Emergency Plumbing', issue: '', date: '' })

  const updateForm = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const chooseService = (service: string) => {
    updateForm('service', service)
    scrollTo('contact')
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addLead({ customerName: form.customerName, email: form.email, phone: form.phone, service: form.service, issue: `${form.issue} Preferred date: ${form.date || 'Flexible'}. Address: ${form.address}`, source: 'Website form' })
    setSubmitted(true)
  }

  return (
    <div className="public-app">
      <div className="demo-ribbon"><span className="demo-dot" /> Client presentation demo <span>•</span> All data and automations shown are simulated</div>
      <header className="public-header">
        <div className="container nav-shell">
          <Link to="/" className="brand-link"><span className="brand-mark__icon"><Droplets size={19} /></span><span className="brand-mark__name">AquaFlow <b>Plumbing</b></span></Link>
          <nav className={`public-nav ${menuOpen ? 'public-nav--open' : ''}`}>
            <button onClick={() => { scrollTo('top'); setMenuOpen(false) }}>Home</button>
            <button onClick={() => { scrollTo('services'); setMenuOpen(false) }}>Services</button>
            <button onClick={() => { scrollTo('why-us'); setMenuOpen(false) }}>About Us</button>
            <button onClick={() => { scrollTo('reviews'); setMenuOpen(false) }}>Reviews</button>
            <button onClick={() => { scrollTo('contact'); setMenuOpen(false) }}>Contact</button>
            <button className="nav-emergency" onClick={() => { chooseService('Emergency Plumbing'); setMenuOpen(false) }}><Phone size={14} /> Emergency Plumbing</button>
          </nav>
          <div className="nav-actions"><button className="button button--dark button--small" onClick={() => scrollTo('contact')}>Request Service <ArrowUpRight size={15} /></button><button className="mobile-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-scrim" aria-hidden="true" />
          <div className="container hero-content">
            <div className="hero-copy">
              <div className="eyebrow eyebrow--light"><span className="eyebrow-line" /> Trusted service across Chicagoland</div>
              <h1>Reliable Plumbing Solutions. <em>Right When You Need Them.</em></h1>
              <p className="hero-lede">Professional plumbing services for your home and business. Fast response, trusted technicians and dependable solutions.</p>
              <div className="hero-actions"><button className="button button--primary" onClick={() => scrollTo('contact')}>Schedule a Service <ArrowUpRight size={17} /></button><button className="button button--ghost" onClick={() => scrollTo('services')}>Explore Our Services <ArrowRight size={17} /></button></div>
              <div className="hero-proof"><div className="avatar-stack"><span>JD</span><span>ML</span><span>RC</span><span className="avatar-more">+2k</span></div><div><div className="stars">★★★★★ <b>4.9/5</b></div><small>Trusted by local homeowners</small></div></div>
            </div>
            <div className="hero-float-card"><span className="float-card__icon"><ShieldCheck size={18} /></span><div><strong>Ready when you need us</strong><span>Same-day service slots available</span></div><span className="live-indicator"><i /> Live</span></div>
          </div>
        </section>

        <section className="trust-strip"><div className="container trust-grid"><div><BadgeCheck size={20} /><span><b>Licensed & Insured</b><small>Peace of mind, every visit</small></span></div><div><ShieldCheck size={20} /><span><b>Professional Technicians</b><small>Skilled, respectful and prepared</small></span></div><div><Clock3 size={20} /><span><b>Reliable Service</b><small>Clear arrival windows</small></span></div><div><Star size={20} fill="currentColor" /><span><b>Customer Satisfaction</b><small>4.9 average rating</small></span></div></div></section>

        <section id="services" className="section services-section"><div className="container"><SectionHeading eyebrow="What we do" title="The right fix, without the runaround." description="From a dripping faucet to a full commercial line, our team brings a clear plan and quality workmanship to every job." /><div className="services-grid">{serviceCatalog.map((service, index) => { const Icon = serviceIcons[service.icon]; return <button className={`service-card ${index === 0 ? 'service-card--featured' : ''}`} key={service.name} onClick={() => chooseService(service.name)}><span className="service-card__number">0{index + 1}</span><span className="service-icon"><Icon size={21} /></span><span className="service-card__body"><strong>{service.name}</strong><span>{service.description}</span></span><span className="service-card__link">Learn more <ChevronRight size={16} /></span></button> })}</div></div></section>

        <section id="why-us" className="section why-section"><div className="container split-section"><div className="why-visual"><div className="why-orbit orbit-one" /><div className="why-orbit orbit-two" /><div className="why-card-main"><span className="eyebrow">A calmer way to call a plumber</span><div className="why-card-number">24<span>/7</span></div><p>Clear communication, even when the problem is urgent.</p><div className="mini-meter"><span /><span /><span /><span /><span /></div><small>Response readiness</small></div><div className="why-mini-card"><CheckCircle2 size={18} /><div><b>Job well done</b><span>1,248 demo jobs tracked</span></div></div></div><div className="why-copy"><SectionHeading eyebrow="Why AquaFlow" title="The little details make the biggest difference." description="You deserve a plumbing partner who treats your home, time and questions with respect." /><div className="why-list"><div><span>01</span><div><b>Experienced technicians</b><p>Skilled professionals who explain the “why,” not just the “what.”</p></div></div><div><span>02</span><div><b>Transparent pricing</b><p>Clear options before work begins, so there are no surprise turns.</p></div></div><div><span>03</span><div><b>Fast response</b><p>Practical arrival windows and proactive updates when plans change.</p></div></div></div><button className="text-link" onClick={() => scrollTo('contact')}>Meet your next plumbing partner <ArrowUpRight size={15} /></button></div></div></section>

        <section className="section process-section"><div className="container"><SectionHeading eyebrow="How it works" title="From first message to finished job." description="A simple, human process that keeps you informed at every step." align="center" /><div className="process-grid"><div className="process-line" />{['Contact our team', 'Describe your plumbing issue', 'Schedule your appointment', 'Get professional service'].map((step, index) => <div className="process-step" key={step}><span className="process-step__number">0{index + 1}</span><span className="process-step__icon">{index === 0 ? <Phone /> : index === 1 ? <Droplets /> : index === 2 ? <Clock3 /> : <CheckCircle2 />}</span><strong>{step}</strong><p>{['Start with a quick call, form or chat.', 'Share the details that help us prepare.', 'Pick a time window that works for you.', 'Relax while our team gets it handled.'][index]}</p></div>)}</div></div></section>

        <section id="reviews" className="section reviews-section"><div className="container"><div className="reviews-header"><SectionHeading eyebrow="Customer notes" title="Good work travels by word of mouth." description="Sample testimonials for this client presentation demo." /><div className="review-summary"><strong>4.9</strong><div><div className="stars">★★★★★</div><span>Based on 2,000+ demo reviews</span></div></div></div><div className="testimonials-grid">{testimonials.map((testimonial) => <article className="testimonial-card" key={testimonial.name}><div className="testimonial-top"><div className="testimonial-avatar">{testimonial.initials}</div><div><b>{testimonial.name}</b><span>{testimonial.location}</span></div><div className="verified"><BadgeCheck size={14} /> Verified demo</div></div><p>“{testimonial.quote}”</p><div className="stars">★★★★★</div></article>)}</div></div></section>

        <section id="contact" className="section contact-section"><div className="container contact-wrap"><div className="contact-copy"><span className="eyebrow eyebrow--light"><span className="eyebrow-line" /> Let’s get it handled</span><h2>Tell us what’s going on. We’ll take it from here.</h2><p>Share a few details and our team will follow up with a clear next step. No pressure, no plumbing jargon.</p><div className="contact-points"><span><Phone size={16} /> (312) 555-0140</span><span><Clock3 size={16} /> Mon–Sun · 7am–9pm</span><span><ShieldCheck size={16} /> Licensed across Chicagoland</span></div><div className="contact-demo-note"><span className="demo-dot" /><div><b>Demo interaction</b><small>Submitting this form adds a simulated lead to the admin dashboard.</small></div></div></div><div className="contact-card">{submitted ? <div className="form-success"><span className="success-mark"><Check size={27} /></span><span className="eyebrow">Request received</span><h3>We’ve got it from here.</h3><p>Your demo request is now visible in the AquaFlow lead pipeline. In a live build, a team member would follow up with your next step.</p><button className="button button--dark" onClick={() => { setSubmitted(false); setForm({ customerName: '', email: '', phone: '', address: '', service: 'Emergency Plumbing', issue: '', date: '' }) }}>Submit another demo request</button></div> : <form onSubmit={handleSubmit}><div className="form-heading"><span className="eyebrow">Request service</span><h3>A little context goes a long way.</h3></div><div className="form-grid"><label>Full name<input required value={form.customerName} onChange={(e) => updateForm('customerName', e.target.value)} placeholder="Jordan Lee" /></label><label>Email address<input required type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="jordan@example.com" /></label><label>Phone number<input required type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="(312) 555-0140" /></label><label>Service address<input required value={form.address} onChange={(e) => updateForm('address', e.target.value)} placeholder="Street, city, ZIP" /></label><label>Service type<select value={form.service} onChange={(e) => updateForm('service', e.target.value)}>{serviceCatalog.map((service) => <option key={service.name}>{service.name}</option>)}</select></label><label>Preferred appointment date<input type="date" value={form.date} onChange={(e) => updateForm('date', e.target.value)} /></label><label className="form-full">What can we help with?<textarea required value={form.issue} onChange={(e) => updateForm('issue', e.target.value)} placeholder="Tell us what you’re noticing..." rows={4} /></label></div><button className="button button--primary button--full" type="submit">Send service request <ArrowUpRight size={17} /></button><small className="form-footnote">By submitting, you’re creating a demo request only. No messages are sent.</small></form>}</div></div></section>
      </main>

      <footer className="public-footer"><div className="container footer-grid"><div className="footer-brand"><Link to="/" className="brand-link brand-link--footer"><span className="brand-mark__icon"><Droplets size={19} /></span><span className="brand-mark__name">AquaFlow <b>Plumbing</b></span></Link><p>Reliable plumbing solutions for homes and businesses across Chicagoland.</p><div className="socials"><button aria-label="Instagram">IG</button><button aria-label="Facebook">FB</button><button aria-label="LinkedIn">in</button></div></div><div><b className="footer-title">Services</b><button onClick={() => scrollTo('services')}>Emergency plumbing</button><button onClick={() => scrollTo('services')}>Drain cleaning</button><button onClick={() => scrollTo('services')}>Water heaters</button><button onClick={() => scrollTo('services')}>Commercial plumbing</button></div><div><b className="footer-title">Company</b><button onClick={() => scrollTo('why-us')}>About us</button><button onClick={() => scrollTo('reviews')}>Reviews</button><button onClick={() => scrollTo('contact')}>Contact</button><Link to="/admin-demo">Admin demo <ArrowUpRight size={13} /></Link></div><div><b className="footer-title">Talk to a human</b><a href="tel:+13125550140">(312) 555-0140</a><span>Mon–Sun · 7am–9pm</span><span>Serving Chicago, Evanston, Oak Park & nearby communities.</span></div></div><div className="container footer-bottom"><span>© 2026 AquaFlow Plumbing · Demonstration data</span><span>Privacy · Terms · License #IL-PL-2048 (demo)</span></div></footer>
      <ChatWidget />
    </div>
  )
}
