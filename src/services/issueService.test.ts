import { describe, expect, it } from 'vitest'
import { createIssue, updateIssueStatus, validateIssueDraft } from './issueService'

const validDraft = {
  title: 'Broken projector in LT1',
  description: 'The projector shuts off after five minutes of use.',
  category: 'IT',
  buildingId: 'bldg-academic-a',
  location: 'Lecture Theatre 1',
  priority: 'high' as const,
}

describe('issue creation and status updates', () => {
  it('rejects a short title', () => {
    const errors = validateIssueDraft({ ...validDraft, title: 'Hi' })
    expect(errors[0]).toMatch(/Title/)
  })

  it('creates an issue with Reported status and an id', async () => {
    const issue = await createIssue(validDraft)
    expect(issue.id).toMatch(/^ISS-/)
    expect(issue.status).toBe('reported')
    expect(issue.title).toBe(validDraft.title)
  })

  it('updates issue status along the workflow', async () => {
    const issue = await createIssue({
      ...validDraft,
      title: 'Leaky tap in admin lobby',
      category: 'Plumbing',
      buildingId: 'bldg-admin',
      location: 'Ground lobby',
    })
    const updated = await updateIssueStatus(issue.id, 'in_progress')
    expect(updated.status).toBe('in_progress')
  })
})
