import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { buildings } from '../data/local/campusSeed'
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES } from '../domain/constants'
import type { Issue, IssuePriority } from '../domain/models'
import { uploadIssueImage } from '../services/imageUpload'
import { createIssue, validateIssueDraft } from '../services/issueService'

export function ReportIssuePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [buildingId, setBuildingId] = useState(buildings[0]?.id ?? '')
  const [location, setLocation] = useState('')
  const [priority, setPriority] = useState<IssuePriority>('medium')
  const [preview, setPreview] = useState<string | undefined>()
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState<Issue | null>(null)

  async function onFile(file: File | undefined) {
    if (!file) {
      setPreview(undefined)
      return
    }
    try {
      const dataUrl = await uploadIssueImage(file)
      setPreview(dataUrl)
      setErrors([])
    } catch (err: unknown) {
      setPreview(undefined)
      setErrors([err instanceof Error ? err.message : 'Image upload failed'])
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const draft = {
      title,
      description,
      category,
      buildingId,
      location,
      priority,
      imageDataUrl: preview,
    }
    const nextErrors = validateIssueDraft(draft)
    if (nextErrors.length) {
      setErrors(nextErrors)
      return
    }
    setSaving(true)
    setErrors([])
    try {
      const issue = await createIssue(draft)
      setCreated(issue)
    } catch (err: unknown) {
      setErrors([err instanceof Error ? err.message : 'Could not submit issue'])
    } finally {
      setSaving(false)
    }
  }

  if (created) {
    return (
      <div className="state-panel">
        <p className="eyebrow">Report received</p>
        <h2>Issue {created.id}</h2>
        <p>
          Thank you. Campus operations can now track <strong>{created.title}</strong>. Current
          status: Reported.
        </p>
        <div className="filter-row">
          <Link className="btn btn--primary" to={`/issues/${created.id}`}>
            Track this issue
          </Link>
          <button type="button" className="btn btn--ghost" onClick={() => setCreated(null)}>
            Report another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="stack">
      <div>
        <p className="eyebrow">Sprint 3</p>
        <h2>Report a campus issue</h2>
        <p className="muted">
          Photos stay on this device for now. The same form will upload to S3 later.
        </p>
      </div>
      <form className="form-grid" onSubmit={onSubmit}>
        <label className="select-field">
          <span>Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        <label className="select-field">
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} required>
            <option value="">Select category</option>
            {ISSUE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="select-field">
          <span>Building</span>
          <select value={buildingId} onChange={(event) => setBuildingId(event.target.value)}>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
        </label>
        <label className="select-field">
          <span>Location</span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Room, lab, or landmark"
            required
          />
        </label>
        <label className="select-field">
          <span>Priority</span>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as IssuePriority)}
          >
            {ISSUE_PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="select-field form-span">
          <span>Description</span>
          <textarea
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </label>
        <label className="select-field form-span">
          <span>Photo (optional)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => void onFile(event.target.files?.[0])}
          />
        </label>
        {preview ? (
          <img className="preview" src={preview} alt="Issue preview" />
        ) : null}
        {errors.length > 0 ? (
          <ul className="notice notice--error">
            {errors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {saving ? 'Submitting…' : 'Submit issue'}
        </button>
      </form>
    </div>
  )
}
