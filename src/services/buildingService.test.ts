import { describe, expect, it } from 'vitest'
import { buildings, buildCampusOverview } from '../data/local/campusSeed'
import {
  countFacilities,
  getBuildingById,
  getBuildings,
  getCampusOverview,
} from '../services/buildingService'

describe('building information retrieval', () => {
  it('returns the seeded campus buildings', async () => {
    const list = await getBuildings()
    expect(list).toHaveLength(buildings.length)
    expect(list.map((item) => item.id)).toContain('bldg-library')
  })

  it('returns a building by id', async () => {
    const building = await getBuildingById('bldg-labs')
    expect(building?.name).toBe('Engineering Lab Complex')
    expect(building?.status).toBe('maintenance')
  })

  it('returns null for an unknown building', async () => {
    await expect(getBuildingById('missing')).resolves.toBeNull()
  })

  it('rejects an empty building id', async () => {
    await expect(getBuildingById('   ')).rejects.toThrow('Building id is required')
  })

  it('summarises campus overview counts', async () => {
    const overview = await getCampusOverview()
    const expected = buildCampusOverview(buildings)
    expect(overview).toEqual(expected)
    expect(overview.totalBuildings).toBeGreaterThan(0)
  })

  it('counts rooms, labs, and facilities for a building', () => {
    const building = buildings[0]
    expect(countFacilities(building)).toBe(
      building.facilityCounts.rooms +
        building.facilityCounts.labs +
        building.facilityCounts.facilities,
    )
  })
})
