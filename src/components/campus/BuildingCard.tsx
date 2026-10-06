import { Link } from 'react-router-dom'
import type { Building } from '../../domain/models'
import { countFacilities } from '../../services/buildingService'
import { StatusBadge } from '../ui/StatusBadge'

export function BuildingCard({ building }: { building: Building }) {
  const total = countFacilities(building)

  return (
    <article className="building-card">
      <div className="building-card__visual" aria-hidden="true">
        {building.imageLabel}
      </div>
      <div className="building-card__body">
        <div className="building-card__row">
          <h3>{building.name}</h3>
          <StatusBadge status={building.status} />
        </div>
        <p className="muted">
          {building.code} · {building.zone} · {building.floors} floors
        </p>
        <p>{building.description}</p>
        <ul className="chip-row">
          <li>{building.facilityCounts.rooms} rooms</li>
          <li>{building.facilityCounts.labs} labs</li>
          <li>{building.facilityCounts.facilities} facilities</li>
          <li>{total} total</li>
        </ul>
        <Link className="btn btn--primary" to={`/buildings/${building.id}`}>
          Open building
        </Link>
      </div>
    </article>
  )
}
