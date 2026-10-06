export interface AppNotification {
  id: string
  title: string
  body: string
  at: string
}

const inbox: AppNotification[] = []

/** In-app notices. Replace with SNS/SES in a real AWS deployment. */
export function notify(title: string, body: string): AppNotification {
  const item: AppNotification = {
    id: `ntf-${Date.now()}`,
    title,
    body,
    at: new Date().toISOString(),
  }
  inbox.unshift(item)
  return item
}

export function listNotifications(): AppNotification[] {
  return [...inbox]
}
