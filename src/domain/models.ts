export type FacilityStatus = 'operational' | 'maintenance' | 'unavailable'
export type FacilityType = 'room' | 'lab' | 'facility'
export type IssueStatus =
  | 'reported'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical'
export type UserRole = 'student' | 'staff' | 'admin'

export interface Building {
  id: string
  name: string
  code: string
  description: string
  zone: string
  floors: number
  status: FacilityStatus
  imageLabel: string
  mapX: number
  mapY: number
  facilityCounts: {
    rooms: number
    labs: number
    facilities: number
  }
}

export interface Facility {
  id: string
  name: string
  type: FacilityType
  buildingId: string
  location: string
  status: FacilityStatus
  description: string
}

export interface Issue {
  id: string
  title: string
  description: string
  category: string
  buildingId: string
  location: string
  priority: IssuePriority
  status: IssueStatus
  imageDataUrl?: string
  assignedTo?: string
  resolutionNotes?: string
  createdAt: string
  updatedAt: string
}

export interface CampusEvent {
  id: string
  name: string
  date: string
  time: string
  location: string
  description: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface CampusOverview {
  name: string
  tagline: string
  totalBuildings: number
  operationalBuildings: number
  maintenanceBuildings: number
  totalFacilities: number
}
