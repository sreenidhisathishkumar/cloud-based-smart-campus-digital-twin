import { Link } from 'react-router-dom'
import type { Facility } from '../../domain/models'
import { buildingNameFor } from '../../services/facilityService'
import { StatusBadge } from '../ui/StatusBadge'
import { TypeBadge } from '../ui/TypeBadge'

export function FacilityTable({ items }: { items: Facility[] }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Building</th>
            <th>Location</th>
            <th>Status</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <Link className="table-link" to={`/facilities/${item.id}`}>
                  {item.name}
                </Link>
                <p className="muted table-desc">{item.description}</p>
              </td>
              <td>
                <TypeBadge type={item.type} />
              </td>
              <td>{buildingNameFor(item.buildingId)}</td>
              <td>{item.location}</td>
              <td>
                <StatusBadge status={item.status} />
              </td>
              <td>
                <Link className="btn btn--ghost" to={`/facilities/${item.id}`}>
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
