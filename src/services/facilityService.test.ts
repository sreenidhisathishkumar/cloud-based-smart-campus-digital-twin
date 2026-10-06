import { describe, expect, it } from 'vitest'
import { facilities } from '../data/local/campusSeed'
import {
  filterFacilities,
  getFacilities,
  getFacilitiesByBuilding,
  getFacilityById,
  updateFacilityStatus,
} from './facilityService'

describe('facility filtering and status', () => {
  it('returns all seeded facilities', async () => {
    const list = await getFacilities()
    expect(list.length).toBe(facilities.length)
  })

  it('filters labs that are under maintenance', () => {
    const result = filterFacilities(facilities, { type: 'lab', status: 'maintenance' })
    expect(result.every((item) => item.type === 'lab' && item.status === 'maintenance')).toBe(
      true,
    )
    expect(result.map((item) => item.id)).toContain('fac-elc-comp')
  })

  it('filters facilities by search text', () => {
    const result = filterFacilities(facilities, { query: 'circulation' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Circulation Desk')
  })

  it('returns facilities for a building', async () => {
    const list = await getFacilitiesByBuilding('bldg-library')
    expect(list.length).toBeGreaterThan(0)
    expect(list.every((item) => item.buildingId === 'bldg-library')).toBe(true)
  })

  it('updates facility status and reads it back', async () => {
    const updated = await updateFacilityStatus('fac-a-cr204', 'maintenance')
    expect(updated.status).toBe('maintenance')
    const fetched = await getFacilityById('fac-a-cr204')
    expect(fetched?.status).toBe('maintenance')
    await updateFacilityStatus('fac-a-cr204', 'operational')
  })

  it('rejects an invalid facility id on update', async () => {
    await expect(updateFacilityStatus('missing', 'operational')).rejects.toThrow(
      'Facility not found',
    )
  })
})
