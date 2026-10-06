import type { Facility, Issue, IssueStatus } from '../domain/models'
import { ISSUE_STATUSES } from '../domain/constants'

export interface DashboardStats {
  total: number
  pending: number
  inProgress: number
  resolved: number
  byStatus: Record<IssueStatus, number>
  facilityOverview: {
    operational: number
    maintenance: number
    unavailable: number
  }
}

export function calculateDashboardStats(
  issues: Issue[],
  facilities: Facility[],
): DashboardStats {
  const byStatus = Object.fromEntries(ISSUE_STATUSES.map((status) => [status, 0])) as Record<
    IssueStatus,
    number
  >
  for (const issue of issues) {
    byStatus[issue.status] += 1
  }
  const resolved = byStatus.resolved
  const inProgress = byStatus.in_progress
  const pending = issues.length - resolved - inProgress

  return {
    total: issues.length,
    pending,
    inProgress,
    resolved,
    byStatus,
    facilityOverview: {
      operational: facilities.filter((item) => item.status === 'operational').length,
      maintenance: facilities.filter((item) => item.status === 'maintenance').length,
      unavailable: facilities.filter((item) => item.status === 'unavailable').length,
    },
  }
}
