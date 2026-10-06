import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/Feedback'
import { issueStatusLabel } from '../components/issues/IssueTimeline'
import { buildings } from '../data/local/campusSeed'
import type { Issue, IssueStatus } from '../domain/models'
import { ISSUE_STATUSES } from '../domain/constants'
import { getIssues } from '../services/issueService'

export function IssuesPage() {
  const [items, setItems] = useState<Issue[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | IssueStatus>('all')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    getIssues()
      .then(setItems)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load issues'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesStatus = status === 'all' || item.status === status
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [items, query, status])

  if (loading) return <LoadingState label="Loading issues…" />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Issue tracking</p>
          <h2>Reported infrastructure issues</h2>
        </div>
        <Link className="btn btn--primary" to="/report">
          Report issue
        </Link>
      </div>
      <div className="toolbar">
        <label className="search">
          <span className="sr-only">Search issues</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by ID, title, or location"
          />
        </label>
      </div>
      <div className="filter-row">
        <button
          type="button"
          className={status === 'all' ? 'chip chip--active' : 'chip'}
          onClick={() => setStatus('all')}
        >
          All
        </button>
        {ISSUE_STATUSES.map((item) => (
          <button
            key={item}
            type="button"
            className={status === item ? 'chip chip--active' : 'chip'}
            onClick={() => setStatus(item)}
          >
            {issueStatusLabel(item)}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <EmptyState title="No issues found" body="Try another filter or report a new issue." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Building</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link className="table-link" to={`/issues/${item.id}`}>
                      {item.id}
                    </Link>
                  </td>
                  <td>{item.title}</td>
                  <td>
                    {buildings.find((building) => building.id === item.buildingId)?.name ??
                      item.buildingId}
                  </td>
                  <td className={`priority priority--${item.priority}`}>{item.priority}</td>
                  <td>
                    <span className={`badge badge--${item.status === 'resolved' ? 'operational' : item.status === 'in_progress' ? 'maintenance' : 'unavailable'}`}>
                      {issueStatusLabel(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
