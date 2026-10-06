import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FacilityTable } from '../components/facilities/FacilityTable'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/Feedback'
import { StatCard } from '../components/ui/StatCard'
import { buildings } from '../data/local/campusSeed'
import type { Facility, FacilityStatus, FacilityType } from '../domain/models'
import {
  filterFacilities,
  getFacilities,
} from '../services/facilityService'

const typeFilters: Array<{ id: 'all' | FacilityType; label: string }> = [
  { id: 'all', label: 'All types' },
  { id: 'room', label: 'Rooms' },
  { id: 'lab', label: 'Labs' },
  { id: 'facility', label: 'Facilities' },
]

const statusFilters: Array<{ id: 'all' | FacilityStatus; label: string }> = [
  { id: 'all', label: 'All statuses' },
  { id: 'operational', label: 'Operational' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'unavailable', label: 'Unavailable' },
]

export function FacilitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState<Facility[]>([])
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'all' | FacilityType>('all')
  const [status, setStatus] = useState<'all' | FacilityStatus>('all')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const buildingId = searchParams.get('building') ?? 'all'

  function load() {
    setLoading(true)
    setError(null)
    getFacilities()
      .then(setItems)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unable to load facilities')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const visible = useMemo(
    () => filterFacilities(items, { query, type, status, buildingId }),
    [items, query, type, status, buildingId],
  )

  const stats = useMemo(
    () => ({
      total: visible.length,
      rooms: visible.filter((item) => item.type === 'room').length,
      labs: visible.filter((item) => item.type === 'lab').length,
      down: visible.filter((item) => item.status !== 'operational').length,
    }),
    [visible],
  )

  if (loading) return <LoadingState label="Loading facilities…" />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Facility management</p>
          <h2>Rooms, labs, and campus facilities</h2>
          <p className="muted">
            Search and filter the live inventory. Open a row to inspect status or update it.
          </p>
        </div>
      </div>

      <section className="stats-grid stats-grid--four" aria-label="Facility summary">
        <StatCard label="Showing" value={stats.total} hint="After current filters" />
        <StatCard label="Rooms" value={stats.rooms} />
        <StatCard label="Labs" value={stats.labs} />
        <StatCard label="Needs attention" value={stats.down} hint="Maintenance or unavailable" />
      </section>

      <div className="toolbar toolbar--wrap">
        <label className="search">
          <span className="sr-only">Search facilities</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, location, or description"
          />
        </label>
        <label className="select-field">
          <span className="sr-only">Building</span>
          <select
            value={buildingId}
            onChange={(event) => {
              const value = event.target.value
              if (value === 'all') setSearchParams({})
              else setSearchParams({ building: value })
            }}
          >
            <option value="all">All buildings</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-row" role="group" aria-label="Filter by type">
        {typeFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={type === filter.id ? 'chip chip--active' : 'chip'}
            onClick={() => setType(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="filter-row" role="group" aria-label="Filter by status">
        {statusFilters.map((filter) => (
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

      {visible.length === 0 ? (
        <EmptyState
          title="No facilities match"
          body="Clear search or filters to see the full campus inventory."
        />
      ) : (
        <FacilityTable items={visible} />
      )}
    </div>
  )
}
