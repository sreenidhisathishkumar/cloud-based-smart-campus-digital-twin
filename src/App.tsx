import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAdmin } from './components/auth/RequireAdmin'
import { AppShell } from './components/layout/AppShell'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminIssuePage } from './pages/AdminIssuePage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { BuildingDetailPage } from './pages/BuildingDetailPage'
import { BuildingsPage } from './pages/BuildingsPage'
import { CampusPage } from './pages/CampusPage'
import { CloudStatusPage } from './pages/CloudStatusPage'
import { EventsPage } from './pages/EventsPage'
import { FacilitiesPage } from './pages/FacilitiesPage'
import { FacilityDetailPage } from './pages/FacilityDetailPage'
import { IssueDetailPage } from './pages/IssueDetailPage'
import { IssuesPage } from './pages/IssuesPage'
import { ReportIssuePage } from './pages/ReportIssuePage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<CampusPage />} />
        <Route path="/buildings" element={<BuildingsPage />} />
        <Route path="/buildings/:buildingId" element={<BuildingDetailPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/facilities/:facilityId" element={<FacilityDetailPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/issues/:issueId" element={<IssueDetailPage />} />
        <Route path="/report" element={<ReportIssuePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/cloud" element={<CloudStatusPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboardPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/issues/:issueId"
          element={
            <RequireAdmin>
              <AdminIssuePage />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
