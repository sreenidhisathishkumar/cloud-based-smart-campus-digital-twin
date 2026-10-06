import { NavLink } from 'react-router-dom'
import { isAwsConfigured } from '../../aws/config'

const links = [
  { to: '/', label: 'Campus overview', hint: 'Sprint 1' },
  { to: '/buildings', label: 'Buildings', hint: 'Sprint 1' },
  { to: '/facilities', label: 'Facilities', hint: 'Sprint 2' },
  { to: '/issues', label: 'Issue tracking', hint: 'Sprint 3' },
  { to: '/report', label: 'Report issue', hint: 'Sprint 3' },
  { to: '/events', label: 'Events', hint: 'Sprint 3' },
  { to: '/admin', label: 'Admin dashboard', hint: 'Sprint 4' },
  { to: '/cloud', label: 'Cloud status', hint: 'Sprint 5' },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__mark">NT</span>
        <div>
          <p className="brand__name">Northridge Twin</p>
          <p className="brand__sub">Smart campus monitor</p>
        </div>
      </div>
      <nav className="sidebar__nav" aria-label="Primary">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={
              link.to === '/' ||
              link.to === '/facilities' ||
              link.to === '/buildings' ||
              link.to === '/issues' ||
              link.to === '/admin'
            }
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            <span>{link.label}</span>
            <small>{link.hint}</small>
          </NavLink>
        ))}
      </nav>
      <p className="sidebar__cloud">
        Cloud: {isAwsConfigured() ? 'API connected' : 'Local data layer'}
      </p>
    </aside>
  )
}
