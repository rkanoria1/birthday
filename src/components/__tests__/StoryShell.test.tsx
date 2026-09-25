import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StoryShell } from '@/components/StoryShell'

describe('StoryShell', () => {
  it('keeps navigation without showing a chapter timeline', () => {
    render(
      <StoryShell onBack={vi.fn()} onNext={vi.fn()} showBack showNext>
        <p>Birthday chapter</p>
      </StoryShell>,
    )

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.queryByText('For Somya')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    expect(screen.queryByText('Continue')).not.toBeInTheDocument()
    const navigation = screen.getByRole('navigation', { name: 'Story navigation' })
    expect(navigation).toHaveAttribute('data-navigation-dock', 'true')
    expect(navigation).toHaveClass('left-1/2', 'w-fit', 'rounded-full')
    expect(screen.getByRole('button', { name: 'Back' })).toHaveClass('h-11', 'w-11')
    expect(screen.getByRole('button', { name: 'Next' })).toHaveClass('h-11', 'w-11')
  })
})
