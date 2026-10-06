import type { FacilityStatus } from '../../domain/models'

const labels: Record<FacilityStatus, string> = {
  operational: 'Operational',
  maintenance: 'Maintenance',
  unavailable: 'Unavailable',
}

export function StatusBadge({ status }: { status: FacilityStatus }) {
  return <span className={`badge badge--${status}`}>{labels[status]}</span>
}
