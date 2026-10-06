import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '../../app/SessionContext'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user } = useSession()
  const location = useLocation()
  if (user.role !== 'admin') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return children
}
