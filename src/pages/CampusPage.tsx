import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BuildingCard } from '../components/campus/BuildingCard'
import { CampusMap } from '../components/campus/CampusMap'
import { ErrorState, LoadingState } from '../components/ui/Feedback'
import { StatCard } from '../components/ui/StatCard'
import type { Building, CampusOverview } from '../domain/models'
import { getBuildings, getCampusOverview } from '../services/buildingService'

export function CampusPage() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [overview, setOverview] = useState<CampusOverview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    setError(null)
    Promise.all([getBuildings(), getCampusOverview()])
      .then(([nextBuildings, nextOverview]) => {
        setBuildings(nextBuildings)
        setOverview(nextOverview)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unable to load campus data')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const unavailable = useMemo(
    () => buildings.filter((building) => building.status === 'unavailable').length,
    [buildings],
  )

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!overview) return <ErrorState message="Campus overview is unavailable." onRetry={load} />

  return (
    <div className="stack">
      <section className="hero">
        <div>
          <p className="eyebrow">Campus digital twin</p>
          <h2>{overview.name}</h2>
          <p className="lede">{overview.tagline}</p>
          <Link className="btn btn--primary" to="/buildings">
            Browse all buildings
          </Link>
        </div>
        <CampusMap buildings={buildings} />
      </section>

      <section className="stats-grid" aria-label="Campus summary">
        <StatCard label="Buildings" value={overview.totalBuildings} hint="Mapped in the twin" />
        <StatCard
          label="Operational"
          value={overview.operationalBuildings}
          hint="Ready for occupancy"
        />
        <StatCard
          label="Under maintenance"
          value={overview.maintenanceBuildings}
          hint="Limited access"
        />
        <StatCard label="Tracked facilities" value={overview.totalFacilities} hint="Rooms, labs, amenities" />
        <StatCard label="Unavailable" value={unavailable} hint="Temporarily offline" />
      </section>

      <section>
        <div className="section-head">
          <h2>Buildings</h2>
          <p className="muted">Open a card for description, facility counts, and navigation.</p>
        </div>
        <div className="card-grid">
          {buildings.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      </section>
    </div>
  )
}
