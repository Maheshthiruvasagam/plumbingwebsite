# AquaFlow Plumbing Client Demo — Plan

## Product scope

A polished client-presentation demo for a fictional U.S. plumbing company. The experience has two connected surfaces: a premium public site at `/` and a SaaS-style admin demo at `/admin-demo`. It uses local mock data and shared React state persisted to `localStorage`; it intentionally does not claim live AI, email, WhatsApp, SMS, payment, or production backend integrations.

## Design direction

Three candidate directions considered:

- **Civic Utility Editorial** — restrained editorial grids with strong navy type and thin rules. (0.06)
- **Tidal Service Luxe** — premium American home-service polish with fluid blue gradients, generous white space and confident product-like cards. (0.08)
- **Workshop Modernism** — practical field-service UI with industrial neutrals, compact controls and blueprint motifs. (0.07)

### Chosen direction: Tidal Service Luxe

- **Design movement:** contemporary premium SaaS meets trustworthy American home-service branding.
- **Core principles:** calm confidence, service clarity, generous breathing room, and visible operational proof.
- **Color philosophy:** navy anchors trust and expertise; AquaFlow blue supplies energy and action; pale blue surfaces make complex workflows feel approachable; success/warning/danger colors remain functional and restrained.
- **Layout paradigm:** asymmetric editorial hero with a visual proof panel, followed by alternating full-bleed bands and dense operational panels; avoid a monotonous centered-card stack.
- **Signature elements:** a small aqua “flow line” motif, soft gradient halos behind key panels, and capsule status treatments that make demo state legible.
- **Interaction philosophy:** every CTA either scrolls to a useful section, opens a real form/chat interaction, or changes visible demo state; no dead-end buttons.
- **Animation:** quick, purposeful easing for chat open/close, card hover lift, drawer entry and toast feedback; avoid looping decoration.
- **Typography system:** Manrope 700–800 for headlines and KPI numerals; Inter 400–700 for body copy, navigation, forms and dashboard controls.
- **Brand essence:** “Trusted plumbing response with a clearer next step.” Personality: dependable, composed, proactive.
- **Brand voice:** direct, reassuring and specific. Example lines: “A clear answer, then a clear next step.” / “Your home is in good hands from the first call.”
- **Wordmark & logo:** compact droplet-and-pipe monogram paired with a bold AquaFlow wordmark; the mark is rendered with CSS/Lucide geometry so it stays replaceable.
- **Signature brand color:** `#1769AA`, supported by a lighter aqua highlight for the flow-line motif.

## Implementation approach

- Use Vite + React + TypeScript with Tailwind CSS and Lucide React. Keep all application code under `src/` with public and admin surfaces separated into components.
- Use React Router for `/` and `/admin-demo`; include `public/manus-routes.json` for both routes.
- Create a shared `DemoProvider` that owns leads, conversations, appointments, toasts and the active demo state. Initialize with realistic demonstration records and persist changes to `localStorage`.
- Public website: responsive nav, hero, trust indicators, services, why-us, process, testimonials, contact lead form and footer. The form creates a lead and opens a success confirmation.
- Chatbot: fixed floating launcher, quick actions, local scripted conversation engine with typing state, timestamps, quick replies and a lead-capture path. Chat-created leads enter the same provider collection as contact-form leads.
- Admin: collapsible sidebar; Overview with KPIs and lightweight Recharts visualizations; Leads table with search/filter/status change and details drawer; Conversations inbox; Automation preview; Appointments view; lightweight Customers/AI Assistant/Analytics/Settings views that are still navigable and demonstrative rather than dead buttons.
- Use a generated hero photograph as the single custom visual asset; use Lucide service icons for consistent performance and clarity rather than a scattered stock-photo collage.
- Mark demonstration content and simulated automation prominently in the UI.

## Project structure

```text
src/
  main.tsx                 # React entry and router/provider wiring
  App.tsx                  # route shell and public/admin route composition
  index.css                # Tailwind layers, design tokens, responsive primitives
  types.ts                 # shared lead, message, appointment and demo types
  data/mockData.ts         # initial demo records and service metadata
  context/DemoContext.tsx  # shared state, persistence, lead creation and toasts
  components/
    BrandMark.tsx
    public/PublicSite.tsx
    public/ContactForm.tsx
    public/ChatWidget.tsx
    admin/AdminShell.tsx
    admin/OverviewPage.tsx
    admin/LeadsPage.tsx
    admin/ConversationsPage.tsx
    admin/AutomationPage.tsx
    admin/AppointmentsPage.tsx
    admin/PlaceholderPage.tsx
    shared/ToastViewport.tsx
    shared/StatusBadge.tsx
    shared/SectionHeading.tsx
public/
  assets/aquaflow-hero.png
  manus-routes.json
```

## Material constraints

No external API keys, authentication, database, payment or communications setup is needed for this demo. All customer data is fictional demonstration data. The generated hero asset is local to the project, and all automation labels are explicitly simulated.

## Serving

Run the Vite development server against the managed session port (`3000`) on `127.0.0.1` with strict-port behavior. Use the managed Webdev config for runtime declaration and the Webdev diagnostics hook before application code edits.
