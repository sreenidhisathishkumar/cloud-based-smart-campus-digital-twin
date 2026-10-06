export function LoadingState({ label = 'Loading campus data…' }: { label?: string }) {
  return (
    <div className="state-panel" role="status">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="state-panel state-panel--error" role="alert">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="state-panel">
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  )
}
