import { localBuildingRepository } from '../data/repositories/buildingRepository'
import type { Building, CampusOverview } from '../domain/models'

const repository = localBuildingRepository

export async function getBuildings(): Promise<Building[]> {
  return repository.listBuildings()
}

export async function getBuildingById(id: string): Promise<Building | null> {
  if (!id.trim()) {
    throw new Error('Building id is required')
  }
  return repository.getBuildingById(id)
}

export async function getCampusOverview(): Promise<CampusOverview> {
  return repository.getCampusOverview()
}

export function countFacilities(building: Building): number {
  return (
    building.facilityCounts.rooms +
    building.facilityCounts.labs +
    building.facilityCounts.facilities
  )
}
