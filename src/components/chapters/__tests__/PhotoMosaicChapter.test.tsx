import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PhotoMosaicChapter } from '@/components/chapters/PhotoMosaicChapter'

const content = {
  title: 'You, in every shade',
  caption: 'Seven moods, one unmistakable presence.',
  images: [
    { src: '/one.jpg', alt: 'Somya in blue', focalPoint: '50% 30%' as const, editorialCaption: 'Midnight, embroidered.', palette: { wash: '#dce6f5', accent: '#19365f', ink: '#17243b' } },
    { src: '/two.jpg', alt: 'Somya in pink', focalPoint: '50% 30%' as const, editorialCaption: 'Pink, with conviction.', palette: { wash: '#f8dce7', accent: '#b41658', ink: '#50172f' } },
  ],
}

describe('PhotoMosaicChapter', () => {
  it('presents one editorial portrait at a time and moves through the looks', () => {
    render(<PhotoMosaicChapter content={content} />)

    expect(screen.getByRole('img', { name: 'Somya in blue' })).toHaveClass('object-cover')
    expect(screen.getByText('Midnight, embroidered.')).toBeInTheDocument()
    expect(screen.getByText('1 / 2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next look' }))

    expect(screen.getByRole('img', { name: 'Somya in pink' })).toBeInTheDocument()
    expect(screen.getByText('Pink, with conviction.')).toBeInTheDocument()
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
    expect(screen.getByTestId('lookbook-stage')).toHaveStyle({ backgroundColor: '#f8dce7' })
  })

  it('wraps in both directions so every look remains easy to reach', () => {
    render(<PhotoMosaicChapter content={content} />)

    fireEvent.click(screen.getByRole('button', { name: 'Previous look' }))
    expect(screen.getByRole('img', { name: 'Somya in pink' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next look' }))
    expect(screen.getByRole('img', { name: 'Somya in blue' })).toBeInTheDocument()
  })

  it('swipes between portraits and retires the gesture hint after use', () => {
    render(<PhotoMosaicChapter content={content} />)

    const swipeArea = screen.getByTestId('lookbook-swipe-area')
    expect(screen.getByText('Swipe through her colours')).toBeInTheDocument()

    fireEvent.touchStart(swipeArea, { touches: [{ clientX: 260 }] })
    fireEvent.touchEnd(swipeArea, { changedTouches: [{ clientX: 90 }] })

    expect(screen.getByRole('img', { name: 'Somya in pink' })).toBeInTheDocument()
    expect(screen.queryByText('Swipe through her colours')).not.toBeInTheDocument()
  })

  it('preloads the next portrait', () => {
    render(<PhotoMosaicChapter content={content} />)
    expect(document.querySelector('link[rel="preload"][href="/two.jpg"]')).not.toBeNull()
  })
})
