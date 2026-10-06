import { Outlet } from 'react-router-dom'
import { useSession } from '../../app/SessionContext'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const { user, setRole } = useSession()

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <header className="topbar">
          <div>
            <p className="topbar__kicker">Cloud-based digital twin</p>
            <h1>Smart Campus Monitoring</h1>
          </div>
          <div className="topbar__meta">
            <span className="pill">Local app · Sprints 1–6</span>
            <span className="pill pill--ghost">{user.role} · {user.name}</span>
            {user.role === 'admin' ? (
              <button type="button" className="chip" onClick={() => setRole('student')}>
                Exit admin
              </button>
            ) : null}
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
