import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MeaningChapter } from '@/components/chapters/MeaningChapter'

describe('MeaningChapter', () => {
  it('fills a frame matched to the portrait artwork', () => {
    render(
      <MeaningChapter content={{
        title: 'What knowing you has begun to mean',
        body: 'A beginning.',
        image: { src: '/portrait.jpg', alt: 'Somya' },
      }} />,
    )

    const image = screen.getByRole('img', { name: 'Somya' })
    expect(image).toHaveClass('object-cover')
    expect(image).not.toHaveClass('object-contain', 'h-[55svh]')
    expect(screen.getByRole('button', { name: 'Open Somya' })).toHaveClass('aspect-[927/1697]')
  })
})
