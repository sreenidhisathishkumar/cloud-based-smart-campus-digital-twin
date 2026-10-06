/**
 * CloudWatch is not connected. This logger stays local until Sprint 5 deployment
 * fills VITE_CLOUDWATCH_LOG_GROUP and a Lambda/backend ships logs.
 */
export function recordLocalEvent(name: string, details: Record<string, unknown> = {}) {
  const payload = {
    source: 'northridge-twin',
    name,
    details,
    at: new Date().toISOString(),
    logGroup: import.meta.env.VITE_CLOUDWATCH_LOG_GROUP ?? '',
  }
  if (import.meta.env.DEV) {
    console.info('[local-monitor]', payload)
  }
}
