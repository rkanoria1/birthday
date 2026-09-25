import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChapterTransition } from '@/components/ChapterTransition'

describe('ChapterTransition', () => {
  it('draws a decorative mandala during the chapter reveal', () => {
    render(<ChapterTransition chapter="hero"><h1>Chapter</h1></ChapterTransition>)

    expect(screen.getByTestId('mandala-transition')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Chapter' })).toBeInTheDocument()
  })
})
