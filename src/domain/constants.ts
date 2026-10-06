export const ISSUE_CATEGORIES = [
  'Electrical',
  'Plumbing',
  'HVAC',
  'Safety',
  'Cleaning',
  'IT',
  'Structural',
  'Other',
] as const

export const ISSUE_STATUSES = [
  'reported',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
] as const

export const ISSUE_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const
