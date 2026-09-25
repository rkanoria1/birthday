import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ObservationsChapter } from '@/components/chapters/ObservationsChapter'

describe('ObservationsChapter', () => {
  it('uses composition-matched, edge-to-edge portrait frames', () => {
    render(
      <ObservationsChapter observations={[
        { text: 'First', image: { src: '/one.jpg', alt: 'One' } },
        { text: 'Second', image: { src: '/two.jpg', alt: 'Two' } },
        { text: 'Third', image: { src: '/three.jpg', alt: 'Three' } },
      ]} />,
    )

    expect(screen.getByRole('heading', { name: 'The details that stay with me' })).toBeInTheDocument()

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(3)
    expect(images[0]).toHaveClass('object-cover')
    expect(images[1]).toHaveClass('object-cover')
    expect(images[2]).toHaveClass('object-cover')
    expect(images.every((image) => !image.classList.contains('object-contain'))).toBe(true)
    expect(screen.getByRole('button', { name: 'Open One' })).toHaveClass('aspect-[927/1697]')
    expect(screen.getByRole('button', { name: 'Open Two' })).toHaveClass('aspect-[1218/1291]')
    expect(screen.getByRole('button', { name: 'Open Three' })).toHaveClass('aspect-[1120/1404]')
  })
})
