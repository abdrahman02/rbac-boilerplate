import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Breadcrumb } from './Breadcrumb'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

import { usePathname } from 'next/navigation'

describe('Breadcrumb', () => {
  it('shows Dashboard label for /dashboard', () => {
    vi.mocked(usePathname).mockReturnValue('/dashboard')
    render(<Breadcrumb />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('shows Users label for /users', () => {
    vi.mocked(usePathname).mockReturnValue('/users')
    render(<Breadcrumb />)
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('shows Audit Logs label for /audit-logs', () => {
    vi.mocked(usePathname).mockReturnValue('/audit-logs')
    render(<Breadcrumb />)
    expect(screen.getByText('Audit Logs')).toBeInTheDocument()
  })

  it('shows fallback — for unknown route', () => {
    vi.mocked(usePathname).mockReturnValue('/unknown-page')
    render(<Breadcrumb />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
