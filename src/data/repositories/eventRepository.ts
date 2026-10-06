import type { CampusEvent } from '../../domain/models'
import { events as seedEvents } from '../local/opsSeed'

function delay(ms = 120): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const localEventRepository = {
  async listEvents(): Promise<CampusEvent[]> {
    await delay()
    return seedEvents.map((item) => ({ ...item }))
  },
}
