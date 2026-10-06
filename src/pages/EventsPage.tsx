import { useEffect, useState } from 'react'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/Feedback'
import type { CampusEvent } from '../domain/models'
import { getEvents } from '../services/eventService'

export function EventsPage() {
  const [items, setItems] = useState<CampusEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    getEvents()
      .then(setItems)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load events'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <LoadingState label="Loading events…" />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (items.length === 0) {
    return <EmptyState title="No events listed" body="Campus events will appear here." />
  }

  return (
    <div className="stack">
      <div>
        <p className="eyebrow">Campus life</p>
        <h2>Upcoming events</h2>
      </div>
      <div className="card-grid">
        {items.map((item) => (
          <article key={item.id} className="panel">
            <p className="eyebrow">
              {item.date} · {item.time}
            </p>
            <h3>{item.name}</h3>
            <p className="muted">{item.location}</p>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
