import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listNotifications } from '../aws/notifications'
import { ErrorState, LoadingState } from '../components/ui/Feedback'
import { StatCard } from '../components/ui/StatCard'
import { issueStatusLabel } from '../components/issues/IssueTimeline'
import { ISSUE_STATUSES } from '../domain/constants'
import type { Facility, Issue } from '../domain/models'
import { calculateDashboardStats } from '../services/dashboardService'
import { getFacilities } from '../services/facilityService'
import { getIssues } from '../services/issueService'

export function AdminDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    Promise.all([getIssues(), getFacilities()])
      .then(([nextIssues, nextFacilities]) => {
        setIssues(nextIssues)
        setFacilities(nextFacilities)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load dashboard'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const stats = useMemo(
    () => calculateDashboardStats(issues, facilities),
    [issues, facilities],
  )
  const recent = issues.slice(0, 5)
  const notices = listNotifications().slice(0, 4)
  const maxStatus = Math.max(1, ...Object.values(stats.byStatus))

  if (loading) return <LoadingState label="Loading dashboard…" />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="stack">
      <div>
        <p className="eyebrow">Sprint 4</p>
        <h2>Operations dashboard</h2>
      </div>
      <section className="stats-grid stats-grid--four">
        <StatCard label="Total issues" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} hint="Not in progress or resolved" />
        <StatCard label="In progress" value={stats.inProgress} />
        <StatCard label="Resolved" value={stats.resolved} />
      </section>
      <section className="split">
        <article className="panel">
          <h3>Issue status distribution</h3>
          <ul className="bar-list">
            {ISSUE_STATUSES.map((status) => (
              <li key={status}>
                <span>{issueStatusLabel(status)}</span>
                <span className="bar">
                  <span
                    className="bar__fill"
                    style={{ width: `${(stats.byStatus[status] / maxStatus) * 100}%` }}
                  />
                </span>
                <strong>{stats.byStatus[status]}</strong>
              </li>
            ))}
          </ul>
        </article>
        <article className="panel">
          <h3>Facility status overview</h3>
          <dl className="meta-grid">
            <div>
              <dt>Operational</dt>
              <dd>{stats.facilityOverview.operational}</dd>
            </div>
            <div>
              <dt>Maintenance</dt>
              <dd>{stats.facilityOverview.maintenance}</dd>
            </div>
            <div>
              <dt>Unavailable</dt>
              <dd>{stats.facilityOverview.unavailable}</dd>
            </div>
          </dl>
        </article>
      </section>
      <section className="panel">
        <div className="section-head">
          <h3>Recent issues</h3>
        </div>
        <ul className="plain-list">
          {recent.map((item) => (
            <li key={item.id}>
              <Link className="table-link" to={`/admin/issues/${item.id}`}>
                {item.id} · {item.title}
              </Link>
              <span className="muted"> {issueStatusLabel(item.status)}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h3>Local notifications</h3>
        {notices.length === 0 ? (
          <p className="muted">No in-app notices yet this session.</p>
        ) : (
          <ul className="plain-list">
            {notices.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <p className="muted">{item.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
