import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { User, UserRole } from '../domain/models'
import { users } from '../data/local/opsSeed'

const STORAGE_KEY = 'northridge-role'

interface SessionValue {
  user: User
  setRole: (role: UserRole) => void
}

const SessionContext = createContext<SessionValue | null>(null)

function userFor(role: UserRole): User {
  if (role === 'admin') return users.find((item) => item.role === 'admin') ?? users[1]
  if (role === 'staff') return users.find((item) => item.role === 'staff') ?? users[2]
  return users.find((item) => item.role === 'student') ?? users[0]
}

function readRole(): UserRole {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored === 'admin' || stored === 'staff' || stored === 'student') return stored
  } catch {
    return 'student'
  }
  return 'student'
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(readRole)

  const value = useMemo<SessionValue>(
    () => ({
      user: userFor(role),
      setRole: (next) => {
        try {
          sessionStorage.setItem(STORAGE_KEY, next)
        } catch {
          /* ignore */
        }
        setRoleState(next)
      },
    }),
    [role],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside SessionProvider')
  return ctx
}
