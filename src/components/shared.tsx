import { AlertTriangle, Check, Info, X } from 'lucide-react'
import type { LeadStatus, ToastVariant } from '../types'
import { useDemo } from '../context/DemoContext'

export function StatusBadge({ status }: { status: LeadStatus | string }) {
  const className = status.toLowerCase().replace(/\s+/g, '-').replace(/[^ -~]/g, '')
  return <span className={`status-badge status-badge--${className}`}>{status}</span>
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }: { eyebrow: string; title: string; description?: string; align?: 'left' | 'center' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

const toastIcon: Record<ToastVariant, React.ReactNode> = {
  success: <Check size={16} />,
  info: <Info size={16} />,
  warning: <AlertTriangle size={16} />,
}

export function ToastViewport() {
  const { toasts, dismissToast } = useDemo()
  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map((toast) => (
        <div className={`toast toast--${toast.variant}`} key={toast.id}>
          <span className="toast__icon">{toastIcon[toast.variant]}</span>
          <span>{toast.message}</span>
          <button className="icon-button icon-button--small" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification"><X size={15} /></button>
        </div>
      ))}
    </div>
  )
}
