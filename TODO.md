# AquaFlow Plumbing Client Demo — Outcomes

## Public website and visual system

- [ ] Deliver a premium, modern, professional, interactive U.S. plumbing business demo for the fictional brand “AquaFlow Plumbing,” clearly positioned as a client presentation demo rather than a production application.
- [ ] Use white, deep navy, professional blue and light blue surfaces with the specified palette; use Manrope for headings and Inter for body, navigation, forms and dashboard interfaces; maintain consistent spacing, responsive desktop/tablet/mobile layouts and a professional American home-service tone.
- [ ] Provide a functional public navigation with Home, Services, About Us, Reviews, Contact, Emergency Plumbing CTA and Request Service button.
- [ ] Make the first screen visually impressive with the exact hero headline “Reliable Plumbing Solutions. Right When You Need Them.”, exact supporting text, Schedule a Service and Explore Our Services actions, a professional residential plumbing technician visual, and trust indicators Licensed & Insured, Professional Technicians, Reliable Service and Customer Satisfaction.
- [ ] Provide service cards for Emergency Plumbing, Drain Cleaning, Leak Detection, Water Heater Repair, Pipe Repair & Replacement, Bathroom Plumbing, Kitchen Plumbing and Commercial Plumbing; each has a relevant icon/image, short description and Learn More action.
- [ ] Include Why Choose Us (Experienced Technicians, Transparent Pricing, Fast Response, Quality Workmanship, Customer-First Service), How It Works (Contact Our Team, Describe Your Plumbing Issue, Schedule Your Appointment, Get Professional Service), demonstration testimonials with names/star ratings, a complete contact form, and footer contact/service/business-hours/service-area/social information.

## Lead capture and shared demo state

- [ ] Contact form includes customer name, email, phone number, service address, plumbing service type, issue description and preferred appointment date.
- [ ] Contact form submission shows a successful demo confirmation and adds a lead to the shared frontend demo state.
- [ ] Every lead contains Lead ID, customer name, phone number, email, service required, issue description, lead source, date created and lead status.
- [ ] Support lead statuses New, Contacted, Follow-up Required, Appointment Scheduled, Converted and Lost.
- [ ] Persist demo data using localStorage where appropriate so public and admin surfaces stay connected after navigation/refresh.

## Chatbot demonstration

- [ ] Keep a floating chat widget accessible throughout the public website with welcome message “Hi! Welcome to AquaFlow Plumbing. How can we help you today?”
- [ ] Provide quick actions Emergency Plumbing, Schedule a Service, Get a Service Estimate, Track My Request and Talk to Support.
- [ ] Use a predefined local mock response engine and clearly avoid claiming actual AI integration.
- [ ] Demonstrate issue understanding, relevant questions, name/phone/email collection, service category, emergency status, preferred appointment date, sample lead creation and confirmation.
- [ ] Include modern chat UI, typing indicator, chat history, quick reply buttons, message timestamps and smooth opening/closing animations.

## Follow-up automation demonstration

- [ ] Show the visual flow New Lead Created -> Welcome Email -> WhatsApp Follow-up -> Follow-up Reminder -> Appointment Confirmation with execution statuses.
- [ ] Provide sample WhatsApp and email message previews, clearly labeled as simulated demonstration only; do not send real WhatsApp, SMS or email.

## Admin dashboard at `/admin-demo`

- [ ] Provide a premium SaaS dashboard with collapsible sidebar entries Overview, Leads, Customers, Conversations, AI Assistant, Follow-up Automation, Appointments, Analytics and Settings.
- [ ] Overview includes KPI cards Total Leads, New Leads, Converted Customers, Pending Follow-ups and Appointments plus realistic demonstration views for Leads Generated Over Time, Lead Conversion Rate, Service Request Distribution and Follow-up Performance.
- [ ] Lead management table includes Customer, Contact, Service, Source, Date, Status and Actions, with search, filters, status updates, lead details drawer, Add New Lead and Edit Lead interactions.
- [ ] Conversations provides searchable inbox list, unread indicators, customer status, selected conversation history, customer details, lead status and assign/update actions.
- [ ] Automation Center shows Trigger: New Lead Submitted, actions Send Welcome Email, Send WhatsApp Message, Wait for Customer Response, Schedule Follow-up and Notify Admin, plus demo activity logs.
- [ ] Appointment Management shows upcoming appointments, customer details, requested service, date/time and status.

## Product behavior and delivery

- [ ] Keep public website components separate from admin dashboard components and use React, TypeScript, Vite, Tailwind CSS, Lucide React icons, Recharts and React Router.
- [ ] Navigation, chatbot, lead submission, shared state, search/filtering, dashboard sidebar, status updates, conversation selection, workflow preview, responsive mobile navigation, forms, toast notifications, modals and drawers all work in the demo.
- [ ] Avoid dead buttons, unnecessary backend/payment/API-key infrastructure, excessive animations and claims of connected AI, WhatsApp or email automation.
- [ ] Provide the route manifest for `/` and `/admin-demo`, run the application, resolve diagnostics/runtime errors and verify the demo surfaces through local checks.
