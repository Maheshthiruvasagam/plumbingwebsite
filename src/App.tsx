import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicSite } from './components/public/PublicSite'
import { AdminShell } from './components/admin/AdminShell'
import { ToastViewport } from './components/shared'

export default function App() {
  return <><Routes><Route path="/" element={<PublicSite />} /><Route path="/admin-demo" element={<AdminShell />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes><ToastViewport /></>
}
