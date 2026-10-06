import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IssueTimeline, issueStatusLabel } from '../components/issues/IssueTimeline'
import { ErrorState, LoadingState } from '../components/ui/Feedback'
import { buildings } from '../data/local/campusSeed'
import { users } from '../data/local/opsSeed'
import type { Issue } from '../domain/models'
import { getIssueById } from '../services/issueService'

export function IssueDetailPage() {
  const { issueId } = useParams()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function load() {
    if (!issueId) {
      setError('Missing issue id')
      setLoading(false)
      return
    }
    setLoading(true)
    getIssueById(issueId)
      .then((result) => {
        setIssue(result)
        if (!result) setError('Issue not found')
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load issue'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [issueId])

  if (loading) return <LoadingState label="Loading issue…" />
  if (error || !issue) {
    return <ErrorState message={error ?? 'Issue not found'} onRetry={issueId ? load : undefined} />
  }

  const assignee = users.find((user) => user.id === issue.assignedTo)

  return (
    <div className="stack">
      <Link className="back-link" to="/issues">
        ← Back to issues
      </Link>
      <section className="panel">
        <p className="eyebrow">{issue.id}</p>
        <div className="title-row">
          <h2>{issue.title}</h2>
          <span className="badge badge--maintenance">{issueStatusLabel(issue.status)}</span>
        </div>
        <p className="lede">{issue.description}</p>
        <dl className="meta-grid">
          <div>
            <dt>Category</dt>
            <dd>{issue.category}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>{issue.priority}</dd>
          </div>
          <div>
            <dt>Building</dt>
            <dd>
              {buildings.find((building) => building.id === issue.buildingId)?.name ??
                issue.buildingId}
            </dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{issue.location}</dd>
          </div>
          <div>
            <dt>Assignee</dt>
            <dd>{assignee?.name ?? 'Unassigned'}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{new Date(issue.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>
      </section>
      <section className="panel">
        <h3>Status timeline</h3>
        <IssueTimeline status={issue.status} />
      </section>
      {issue.imageDataUrl ? (
        <section className="panel">
          <h3>Attached photo</h3>
          <img className="preview" src={issue.imageDataUrl} alt="Issue attachment" />
        </section>
      ) : null}
      {issue.resolutionNotes ? (
        <section className="panel">
          <h3>Resolution</h3>
          <p>{issue.resolutionNotes}</p>
        </section>
      ) : null}
    </div>
  )
}
