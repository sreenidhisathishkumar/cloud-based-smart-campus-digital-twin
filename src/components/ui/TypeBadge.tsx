import type { FacilityType } from '../../domain/models'

export const typeLabels: Record<FacilityType, string> = {
  room: 'Room',
  lab: 'Lab',
  facility: 'Facility',
}

export function TypeBadge({ type }: { type: FacilityType }) {
  return <span className={`badge badge--type-${type}`}>{typeLabels[type]}</span>
}
