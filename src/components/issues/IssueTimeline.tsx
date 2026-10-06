import { ISSUE_STATUSES } from '../../domain/constants'
import type { IssueStatus } from '../../domain/models'

const labels: Record<IssueStatus, string> = {
  reported: 'Reported',
  under_review: 'Under Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

export function IssueTimeline({ status }: { status: IssueStatus }) {
  const current = ISSUE_STATUSES.indexOf(status)
  return (
    <ol className="timeline">
      {ISSUE_STATUSES.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'todo'
        return (
          <li key={step} className={`timeline__step timeline__step--${state}`}>
            <span className="timeline__dot" />
            <span>{labels[step]}</span>
          </li>
        )
      })}
    </ol>
  )
}

export function issueStatusLabel(status: IssueStatus) {
  return labels[status]
}
