import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrandMark } from './BrandMark'

describe('BrandMark', () => {
  it('shows app name and subtitle when not collapsed', () => {
    render(<BrandMark />)
    expect(screen.getByText('Bedrock')).toBeInTheDocument()
    expect(screen.getByText('Access Control')).toBeInTheDocument()
  })

  it('hides app name and subtitle when collapsed=true', () => {
    render(<BrandMark collapsed />)
    expect(screen.queryByText('Bedrock')).not.toBeInTheDocument()
    expect(screen.queryByText('Access Control')).not.toBeInTheDocument()
  })

  it('does not use hardcoded fill="white" in SVG', () => {
    const { container } = render(<BrandMark />)
    const svgElements = container.querySelectorAll('[fill="white"]')
    expect(svgElements.length).toBe(0)
  })
})
