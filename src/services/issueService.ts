import { ISSUE_CATEGORIES, ISSUE_PRIORITIES } from '../domain/constants'
import type { Issue, IssueStatus } from '../domain/models'
import {
  localIssueRepository,
  type CreateIssueInput,
  type UpdateIssueInput,
} from '../data/repositories/issueRepository'
import { recordLocalEvent } from '../aws/cloudwatch'
import { notify } from '../aws/notifications'

export interface IssueDraft {
  title: string
  description: string
  category: string
  buildingId: string
  location: string
  priority: Issue['priority']
  imageDataUrl?: string
}

export function validateIssueDraft(draft: IssueDraft): string[] {
  const errors: string[] = []
  if (draft.title.trim().length < 5) errors.push('Title must be at least 5 characters')
  if (draft.description.trim().length < 12) {
    errors.push('Description must be at least 12 characters')
  }
  if (!ISSUE_CATEGORIES.includes(draft.category as (typeof ISSUE_CATEGORIES)[number])) {
    errors.push('Choose a valid category')
  }
  if (!draft.buildingId) errors.push('Choose a building')
  if (!draft.location.trim()) errors.push('Location is required')
  if (!ISSUE_PRIORITIES.includes(draft.priority)) errors.push('Choose a priority')
  return errors
}

export async function getIssues(): Promise<Issue[]> {
  return localIssueRepository.listIssues()
}

export async function getIssueById(id: string): Promise<Issue | null> {
  if (!id.trim()) throw new Error('Issue id is required')
  return localIssueRepository.getIssueById(id)
}

export async function createIssue(draft: IssueDraft): Promise<Issue> {
  const errors = validateIssueDraft(draft)
  if (errors.length) throw new Error(errors[0])
  const payload: CreateIssueInput = {
    title: draft.title.trim(),
    description: draft.description.trim(),
    category: draft.category,
    buildingId: draft.buildingId,
    location: draft.location.trim(),
    priority: draft.priority,
    imageDataUrl: draft.imageDataUrl,
  }
  const issue = await localIssueRepository.createIssue(payload)
  recordLocalEvent('issue_created', { id: issue.id })
  notify(`Issue ${issue.id} reported`, issue.title)
  return issue
}

export async function updateIssue(id: string, patch: UpdateIssueInput): Promise<Issue> {
  const issue = await localIssueRepository.updateIssue(id, patch)
  recordLocalEvent('issue_updated', { id: issue.id, status: issue.status })
  notify(`Issue ${issue.id} updated`, `Status: ${issue.status}`)
  return issue
}

export async function updateIssueStatus(id: string, status: IssueStatus): Promise<Issue> {
  return updateIssue(id, { status })
}
