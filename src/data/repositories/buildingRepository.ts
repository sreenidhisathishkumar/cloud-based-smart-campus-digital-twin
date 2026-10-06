import type { Building, CampusOverview } from '../../domain/models'
import { buildCampusOverview, buildings as seedBuildings } from '../local/campusSeed'

export interface BuildingRepository {
  listBuildings(): Promise<Building[]>
  getBuildingById(id: string): Promise<Building | null>
  getCampusOverview(): Promise<CampusOverview>
}

function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const localBuildingRepository: BuildingRepository = {
  async listBuildings() {
    await delay()
    return [...seedBuildings]
  },

  async getBuildingById(id: string) {
    await delay()
    return seedBuildings.find((building) => building.id === id) ?? null
  },

  async getCampusOverview() {
    await delay()
    return buildCampusOverview(seedBuildings)
  },
}
