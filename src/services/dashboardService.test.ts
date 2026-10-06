import { describe, expect, it } from 'vitest'
import { issues } from '../data/local/opsSeed'
import { facilities } from '../data/local/campusSeed'
import { calculateDashboardStats } from './dashboardService'

describe('dashboard calculations', () => {
  it('counts total, resolved, in-progress, and pending issues', () => {
    const stats = calculateDashboardStats(issues, facilities)
    expect(stats.total).toBe(issues.length)
    expect(stats.resolved).toBe(issues.filter((item) => item.status === 'resolved').length)
    expect(stats.inProgress).toBe(issues.filter((item) => item.status === 'in_progress').length)
    expect(stats.pending + stats.inProgress + stats.resolved).toBe(stats.total)
  })

  it('builds a status distribution for every workflow step', () => {
    const stats = calculateDashboardStats(issues, facilities)
    expect(stats.byStatus.reported).toBeGreaterThanOrEqual(1)
    expect(
      Object.values(stats.byStatus).reduce((sum, value) => sum + value, 0),
    ).toBe(issues.length)
  })

  it('summarises facility operational health', () => {
    const stats = calculateDashboardStats(issues, facilities)
    const totalFacilities =
      stats.facilityOverview.operational +
      stats.facilityOverview.maintenance +
      stats.facilityOverview.unavailable
    expect(totalFacilities).toBe(facilities.length)
  })
})
