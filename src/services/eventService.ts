import { localEventRepository } from '../data/repositories/eventRepository'
import type { CampusEvent } from '../domain/models'

export async function getEvents(): Promise<CampusEvent[]> {
  return localEventRepository.listEvents()
}
