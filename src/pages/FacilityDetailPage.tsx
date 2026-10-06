import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '../components/ui/Feedback'
import { StatusBadge } from '../components/ui/StatusBadge'
import { TypeBadge } from '../components/ui/TypeBadge'
import type { Facility, FacilityStatus } from '../domain/models'
import { FACILITY_STATUSES } from '../data/local/campusSeed'
import {
  buildingNameFor,
  getFacilityById,
  updateFacilityStatus,
} from '../services/facilityService'

const statusOptions: Array<{ id: FacilityStatus; label: string }> = [
  { id: 'operational', label: 'Operational' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'unavailable', label: 'Unavailable' },
]

export function FacilityDetailPage() {
  const { facilityId } = useParams()
  const [facility, setFacility] = useState<Facility | null>(null)
  const [status, setStatus] = useState<FacilityStatus>('operational')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  function load() {
    if (!facilityId) {
      setError('Missing facility id')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    getFacilityById(facilityId)
      .then((result) => {
        setFacility(result)
        if (result) setStatus(result.status)
        else setError('This facility is not in the inventory.')
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unable to load facility')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [facilityId])

  async function onSave(event: FormEvent) {
    event.preventDefault()
    if (!facility) return
    setSaving(true)
    setNotice(null)
    try {
      const updated = await updateFacilityStatus(facility.id, status)
      setFacility(updated)
      setNotice(`Status updated to ${updated.status.replace('_', ' ')}.`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to update status')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading facility…" />
  if (error && !facility) {
    return <ErrorState message={error} onRetry={facilityId ? load : undefined} />
  }
  if (!facility) return <ErrorState message="Facility not found" />

  return (
    <div className="stack">
      <Link className="back-link" to="/facilities">
        ← Back to facilities
      </Link>
      <section className="detail-hero">
        <div className="detail-hero__visual" aria-hidden="true">
          {facility.type === 'lab' ? 'LAB' : facility.type === 'room' ? 'RM' : 'FAC'}
        </div>
        <div>
          <p className="eyebrow">{buildingNameFor(facility.buildingId)}</p>
          <div className="title-row">
            <h2>{facility.name}</h2>
            <StatusBadge status={facility.status} />
          </div>
          <p className="lede">{facility.description}</p>
          <dl className="meta-grid">
            <div>
              <dt>Type</dt>
              <dd>
                <TypeBadge type={facility.type} />
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{facility.location}</dd>
            </div>
            <div>
              <dt>Building</dt>
              <dd>
                <Link to={`/buildings/${facility.buildingId}`}>
                  {buildingNameFor(facility.buildingId)}
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <form className="panel" onSubmit={onSave}>
        <h3>Update facility status</h3>
        <p className="muted">
          Local session only. This will call API Gateway in Sprint 5 instead of rewriting the form.
        </p>
        <label className="select-field">
          <span>Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as FacilityStatus)}
          >
            {FACILITY_STATUSES.map((value) => (
              <option key={value} value={value}>
                {statusOptions.find((option) => option.id === value)?.label}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save status'}
        </button>
        {notice ? <p className="notice">{notice}</p> : null}
        {error && facility ? <p className="notice notice--error">{error}</p> : null}
      </form>
    </div>
  )
}
