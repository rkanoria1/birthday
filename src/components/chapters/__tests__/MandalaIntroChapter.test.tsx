import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MandalaIntroChapter } from '@/components/chapters/MandalaIntroChapter'

describe('MandalaIntroChapter', () => {
  it('introduces Somya through her mandala-inspired artwork', () => {
    render(<MandalaIntroChapter />)

    expect(screen.getByRole('heading', { name: 'A little world, drawn from yours' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Mandala artwork inspired by Somya’s creation' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Illustrated portrait of Somya' })).toBeInTheDocument()
  })
})
