import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '../app/SessionContext'

const DEMO_EMAIL = 'admin@northridge.edu'
const DEMO_PIN = 'campus-admin'

export function AdminLoginPage() {
  const { user, setRole } = useSession()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user.role === 'admin') return <Navigate to={from} replace />

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (email.trim() === DEMO_EMAIL && pin === DEMO_PIN) {
      setRole('admin')
      return
    }
    setError('Use the local demo admin email and PIN. This is not AWS Cognito.')
  }

  return (
    <div className="stack" style={{ maxWidth: 480 }}>
      <div>
        <p className="eyebrow">Admin access</p>
        <h2>Operations console</h2>
        <p className="muted">
          Local demo only. Email <code>{DEMO_EMAIL}</code> and PIN <code>{DEMO_PIN}</code>.
        </p>
      </div>
      <form className="form-grid" onSubmit={onSubmit}>
        <label className="select-field">
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="select-field">
          <span>PIN</span>
          <input
            type="password"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
        </label>
        {error ? <p className="notice notice--error">{error}</p> : null}
        <button className="btn btn--primary" type="submit">
          Enter admin dashboard
        </button>
      </form>
    </div>
  )
}
