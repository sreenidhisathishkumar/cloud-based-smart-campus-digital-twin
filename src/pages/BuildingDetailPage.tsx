import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FacilityTable } from '../components/facilities/FacilityTable'
import { ErrorState, LoadingState } from '../components/ui/Feedback'
import { StatusBadge } from '../components/ui/StatusBadge'
import type { Building, Facility } from '../domain/models'
import { countFacilities, getBuildingById } from '../services/buildingService'
import { getFacilitiesByBuilding } from '../services/facilityService'

export function BuildingDetailPage() {
  const { buildingId } = useParams()
  const [building, setBuilding] = useState<Building | null>(null)
  const [spaces, setSpaces] = useState<Facility[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function load() {
    if (!buildingId) {
      setError('Missing building id')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    Promise.all([getBuildingById(buildingId), getFacilitiesByBuilding(buildingId)])
      .then(([result, nextSpaces]) => {
        setBuilding(result)
        setSpaces(nextSpaces)
        if (!result) setError('This building is not in the campus directory.')
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unable to load building')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [buildingId])

  const rooms = useMemo(() => spaces.filter((item) => item.type === 'room'), [spaces])
  const labs = useMemo(() => spaces.filter((item) => item.type === 'lab'), [spaces])
  const amenities = useMemo(
    () => spaces.filter((item) => item.type === 'facility'),
    [spaces],
  )

  if (loading) return <LoadingState label="Loading building…" />
  if (error || !building) {
    return (
      <ErrorState
        message={error ?? 'Building not found'}
        onRetry={buildingId ? load : undefined}
      />
    )
  }

  const total = countFacilities(building)

  return (
    <div className="stack">
      <Link className="back-link" to="/">
        ← Back to campus
      </Link>
      <section className="detail-hero">
        <div className="detail-hero__visual" aria-hidden="true">
          {building.imageLabel}
        </div>
        <div>
          <p className="eyebrow">{building.code}</p>
          <div className="title-row">
            <h2>{building.name}</h2>
            <StatusBadge status={building.status} />
          </div>
          <p className="lede">{building.description}</p>
          <dl className="meta-grid">
            <div>
              <dt>Zone</dt>
              <dd>{building.zone}</dd>
            </div>
            <div>
              <dt>Floors</dt>
              <dd>{building.floors}</dd>
            </div>
            <div>
              <dt>Tracked spaces</dt>
              <dd>{total}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="split">
        <article className="panel">
          <h3>Rooms</h3>
          <p className="panel__count">{rooms.length}</p>
          <p className="muted">Lecture halls, seminar rooms, and offices in this building.</p>
        </article>
        <article className="panel">
          <h3>Labs</h3>
          <p className="panel__count">{labs.length}</p>
          <p className="muted">Teaching and research laboratories attached to this building.</p>
        </article>
        <article className="panel">
          <h3>Facilities</h3>
          <p className="panel__count">{amenities.length}</p>
          <p className="muted">Shared amenities such as lobbies, help desks, and stores.</p>
        </article>
      </section>

      <section className="stack">
        <div className="section-head">
          <h2>Spaces in this building</h2>
          <Link className="btn btn--ghost" to={`/facilities?building=${building.id}`}>
            Open in directory
          </Link>
        </div>
        {spaces.length === 0 ? (
          <p className="muted">No rooms, labs, or facilities are listed yet.</p>
        ) : (
          <FacilityTable items={spaces} />
        )}
      </section>
    </div>
  )
}
