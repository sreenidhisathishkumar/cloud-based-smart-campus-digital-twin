import type { Issue, IssueStatus } from '../../domain/models'
import { ISSUE_STATUSES } from '../../domain/constants'
import { issues as seedIssues } from '../local/opsSeed'

export interface CreateIssueInput {
  title: string
  description: string
  category: string
  buildingId: string
  location: string
  priority: Issue['priority']
  imageDataUrl?: string
}

export interface UpdateIssueInput {
  status?: IssueStatus
  assignedTo?: string
  resolutionNotes?: string
}

function delay(ms = 160): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const store: Issue[] = seedIssues.map((item) => ({ ...item }))
let sequence = 1100

export const localIssueRepository = {
  async listIssues() {
    await delay()
    return store.map((item) => ({ ...item }))
  },

  async getIssueById(id: string) {
    await delay()
    const found = store.find((item) => item.id === id)
    return found ? { ...found } : null
  },

  async createIssue(input: CreateIssueInput) {
    await delay()
    sequence += 1
    const now = new Date().toISOString()
    const issue: Issue = {
      id: `ISS-${sequence}`,
      title: input.title,
      description: input.description,
      category: input.category,
      buildingId: input.buildingId,
      location: input.location,
      priority: input.priority,
      status: 'reported',
      imageDataUrl: input.imageDataUrl,
      createdAt: now,
      updatedAt: now,
    }
    store.unshift(issue)
    return { ...issue }
  },

  async updateIssue(id: string, patch: UpdateIssueInput) {
    await delay()
    const index = store.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Issue not found')
    if (patch.status && !ISSUE_STATUSES.includes(patch.status)) {
      throw new Error('Invalid issue status')
    }
    store[index] = {
      ...store[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    return { ...store[index] }
  },
}
