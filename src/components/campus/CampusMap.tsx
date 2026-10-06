import { Link } from 'react-router-dom'
import type { Building } from '../../domain/models'

export function CampusMap({ buildings }: { buildings: Building[] }) {
  return (
    <section className="campus-map" aria-label="Interactive campus map">
      <div className="campus-map__canvas">
        <div className="campus-map__grid" />
        {buildings.map((building) => (
          <Link
            key={building.id}
            to={`/buildings/${building.id}`}
            className={`map-pin map-pin--${building.status}`}
            style={{ left: `${building.mapX}%`, top: `${building.mapY}%` }}
            title={building.name}
          >
            <span className="map-pin__dot" />
            <span className="map-pin__label">{building.code}</span>
          </Link>
        ))}
      </div>
      <p className="muted campus-map__hint">
        Select a pin to open building details. Pin colour matches operational status.
      </p>
    </section>
  )
}
