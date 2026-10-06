import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IssueTimeline, issueStatusLabel } from '../components/issues/IssueTimeline'
import { ErrorState, LoadingState } from '../components/ui/Feedback'
import { ISSUE_STATUSES } from '../domain/constants'
import type { Issue, IssueStatus } from '../domain/models'
import { users } from '../data/local/opsSeed'
import { getIssueById, updateIssue } from '../services/issueService'

export function AdminIssuePage() {
  const { issueId } = useParams()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [status, setStatus] = useState<IssueStatus>('reported')
  const [assignedTo, setAssignedTo] = useState('')
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
        if (result) {
          setStatus(result.status)
          setAssignedTo(result.assignedTo ?? '')
          setResolutionNotes(result.resolutionNotes ?? '')
        } else setError('Issue not found')
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load issue'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [issueId])

  async function onSave(event: FormEvent) {
    event.preventDefault()
    if (!issue) return
    setSaving(true)
    setNotice(null)
    try {
      const updated = await updateIssue(issue.id, {
        status,
        assignedTo: assignedTo || undefined,
        resolutionNotes: resolutionNotes.trim() || undefined,
      })
      setIssue(updated)
      setNotice('Issue updated for this local session.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading issue…" />
  if (error && !issue) {
    return <ErrorState message={error} onRetry={issueId ? load : undefined} />
  }
  if (!issue) return <ErrorState message="Issue not found" />

  const staff = users.filter((user) => user.role !== 'student')

  return (
    <div className="stack">
      <Link className="back-link" to="/admin">
        ← Back to dashboard
      </Link>
      <section className="panel">
        <p className="eyebrow">{issue.id}</p>
        <h2>{issue.title}</h2>
        <p>{issue.description}</p>
        <p className="muted">
          {issue.category} · {issue.priority} · {issue.location}
        </p>
        {issue.imageDataUrl ? (
          <img className="preview" src={issue.imageDataUrl} alt="Uploaded issue" />
        ) : (
          <p className="muted">No photo uploaded.</p>
        )}
      </section>
      <IssueTimeline status={issue.status} />
      <form className="form-grid panel" onSubmit={onSave}>
        <label className="select-field">
          <span>Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as IssueStatus)}
          >
            {ISSUE_STATUSES.map((item) => (
              <option key={item} value={item}>
                {issueStatusLabel(item)}
              </option>
            ))}
          </select>
        </label>
        <label className="select-field">
          <span>Assign to</span>
          <select value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)}>
            <option value="">Unassigned</option>
            {staff.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </label>
        <label className="select-field form-span">
          <span>Resolution notes</span>
          <textarea
            rows={4}
            value={resolutionNotes}
            onChange={(event) => setResolutionNotes(event.target.value)}
          />
        </label>
        {notice ? <p className="notice">{notice}</p> : null}
        {error && issue ? <p className="notice notice--error">{error}</p> : null}
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
