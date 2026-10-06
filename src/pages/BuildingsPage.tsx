import { useEffect, useMemo, useState } from 'react'
import { BuildingCard } from '../components/campus/BuildingCard'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/Feedback'
import type { Building, FacilityStatus } from '../domain/models'
import { getBuildings } from '../services/buildingService'

const filters: Array<{ id: 'all' | FacilityStatus; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'operational', label: 'Operational' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'unavailable', label: 'Unavailable' },
]

export function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | FacilityStatus>('all')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    setError(null)
    getBuildings()
      .then(setBuildings)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unable to load buildings')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return buildings.filter((building) => {
      const matchesStatus = status === 'all' || building.status === status
      const matchesQuery =
        !q ||
        building.name.toLowerCase().includes(q) ||
        building.code.toLowerCase().includes(q) ||
        building.zone.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [buildings, query, status])

  if (loading) return <LoadingState label="Loading buildings…" />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Directory</p>
          <h2>Campus buildings</h2>
        </div>
      </div>
      <div className="toolbar">
        <label className="search">
          <span className="sr-only">Search buildings</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, code, or zone"
          />
        </label>
        <div className="filter-row" role="group" aria-label="Filter by status">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={status === filter.id ? 'chip chip--active' : 'chip'}
              onClick={() => setStatus(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      {visible.length === 0 ? (
        <EmptyState
          title="No buildings match"
          body="Try another search term or clear the status filter."
        />
      ) : (
        <div className="card-grid">
          {visible.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      )}
    </div>
  )
}
