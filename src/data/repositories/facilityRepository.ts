import type { Facility, FacilityStatus } from '../../domain/models'
import { FACILITY_STATUSES, facilities as seedFacilities } from '../local/campusSeed'

export interface FacilityFilters {
  query?: string
  type?: Facility['type'] | 'all'
  status?: FacilityStatus | 'all'
  buildingId?: string | 'all'
}

export interface FacilityRepository {
  listFacilities(): Promise<Facility[]>
  getFacilityById(id: string): Promise<Facility | null>
  updateFacilityStatus(id: string, status: FacilityStatus): Promise<Facility>
}

function delay(ms = 160): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const store: Facility[] = seedFacilities.map((item) => ({ ...item }))

export const localFacilityRepository: FacilityRepository = {
  async listFacilities() {
    await delay()
    return store.map((item) => ({ ...item }))
  },

  async getFacilityById(id: string) {
    await delay()
    const found = store.find((item) => item.id === id)
    return found ? { ...found } : null
  },

  async updateFacilityStatus(id: string, status: FacilityStatus) {
    await delay()
    if (!FACILITY_STATUSES.includes(status)) {
      throw new Error('Invalid facility status')
    }
    const index = store.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Facility not found')
    }
    store[index] = { ...store[index], status }
    return { ...store[index] }
  },
}

export function filterFacilities(list: Facility[], filters: FacilityFilters): Facility[] {
  const query = filters.query?.trim().toLowerCase() ?? ''
  const type = filters.type ?? 'all'
  const status = filters.status ?? 'all'
  const buildingId = filters.buildingId ?? 'all'

  return list.filter((item) => {
    const matchesType = type === 'all' || item.type === type
    const matchesStatus = status === 'all' || item.status === status
    const matchesBuilding = buildingId === 'all' || item.buildingId === buildingId
    const matchesQuery =
      query.length === 0 ||
      item.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    return matchesType && matchesStatus && matchesBuilding && matchesQuery
  })
}
