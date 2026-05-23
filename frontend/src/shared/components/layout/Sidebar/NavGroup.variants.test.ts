import { describe, it, expect } from 'vitest'
import { navGroupTriggerVariants, navGroupChildVariants } from './NavGroup.variants'

describe('navGroupTriggerVariants', () => {
  it('applies sidebar-primary/18 bg when activeParent=true', () => {
    const result = navGroupTriggerVariants({ activeParent: true, collapsed: false })
    expect(result).toContain('bg-sidebar-primary')
    expect(result).toContain('text-sidebar-primary')
  })

  it('applies sidebar-foreground text when activeParent=false', () => {
    const result = navGroupTriggerVariants({ activeParent: false, collapsed: false })
    expect(result).toContain('text-sidebar-foreground')
  })

  it('applies justify-center when collapsed=true', () => {
    const result = navGroupTriggerVariants({ activeParent: false, collapsed: true })
    expect(result).toContain('justify-center')
  })

  it('applies justify-start when collapsed=false', () => {
    const result = navGroupTriggerVariants({ activeParent: false, collapsed: false })
    expect(result).toContain('justify-start')
  })
})

describe('navGroupChildVariants', () => {
  it('applies bg-sidebar-primary when active=true', () => {
    const result = navGroupChildVariants({ active: true })
    expect(result).toContain('bg-sidebar-primary')
    expect(result).toContain('text-sidebar-primary-foreground')
  })

  it('applies sidebar-foreground/70 text when active=false', () => {
    const result = navGroupChildVariants({ active: false })
    expect(result).toContain('text-sidebar-foreground')
  })
})
