import { describe, it, expect } from 'vitest'
import { navItemVariants, navBadgeVariants } from './NavItem.variants'

describe('navItemVariants', () => {
  it('applies sidebar-primary bg when active', () => {
    const result = navItemVariants({ active: true, collapsed: false })
    expect(result).toContain('bg-sidebar-primary')
    expect(result).toContain('text-sidebar-primary-foreground')
  })

  it('applies sidebar-foreground text when inactive', () => {
    const result = navItemVariants({ active: false, collapsed: false })
    expect(result).toContain('text-sidebar-foreground')
  })

  it('applies justify-center when collapsed', () => {
    const result = navItemVariants({ active: false, collapsed: true })
    expect(result).toContain('justify-center')
  })

  it('applies justify-start when expanded', () => {
    const result = navItemVariants({ active: false, collapsed: false })
    expect(result).toContain('justify-start')
  })
})

describe('navBadgeVariants', () => {
  it('applies white background when active', () => {
    const result = navBadgeVariants({ active: true })
    expect(result).toContain('bg-white')
  })

  it('applies muted background when inactive', () => {
    const result = navBadgeVariants({ active: false })
    expect(result).toContain('bg-muted')
  })
})
