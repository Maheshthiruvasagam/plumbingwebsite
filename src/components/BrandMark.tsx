import { Droplets } from 'lucide-react'

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-label="AquaFlow Plumbing">
      <span className="brand-mark__icon"><Droplets size={compact ? 17 : 19} strokeWidth={2.3} /></span>
      {!compact && <span className="brand-mark__name">AquaFlow <b>Plumbing</b></span>}
    </div>
  )
}
