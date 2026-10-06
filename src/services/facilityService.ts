import {
  filterFacilities,
  localFacilityRepository,
} from '../data/repositories/facilityRepository'
import type { Facility, FacilityStatus } from '../domain/models'
import { buildings } from '../data/local/campusSeed'

const repository = localFacilityRepository

export async function getFacilities(): Promise<Facility[]> {
  return repository.listFacilities()
}

export async function getFacilityById(id: string): Promise<Facility | null> {
  if (!id.trim()) {
    throw new Error('Facility id is required')
  }
  return repository.getFacilityById(id)
}

export async function getFacilitiesByBuilding(buildingId: string): Promise<Facility[]> {
  const list = await repository.listFacilities()
  return filterFacilities(list, { buildingId })
}

export async function updateFacilityStatus(
  id: string,
  status: FacilityStatus,
): Promise<Facility> {
  if (!id.trim()) {
    throw new Error('Facility id is required')
  }
  return repository.updateFacilityStatus(id, status)
}

export function buildingNameFor(buildingId: string): string {
  return buildings.find((building) => building.id === buildingId)?.name ?? 'Unknown building'
}

export { filterFacilities }
