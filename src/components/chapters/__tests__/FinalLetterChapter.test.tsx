import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FinalLetterChapter } from '@/components/chapters/FinalLetterChapter'

describe('FinalLetterChapter', () => {
  it('reveals the final letter as separate handwritten lines', () => {
    render(<FinalLetterChapter content={{ body: 'Happy birthday, Somya. I notice you. I value you.', secret: 'My private message.' }} onReplay={vi.fn()} />)

    expect(screen.getAllByTestId('letter-line')).toHaveLength(4)
    expect(screen.getByText('Happy birthday,')).toBeInTheDocument()
    expect(screen.getByText('Somya.')).toBeInTheDocument()
  })

  it('reveals a private message after three heart taps and can replay', () => {
    const onReplay = vi.fn()
    render(<FinalLetterChapter content={{ body: 'Happy birthday, Somya.', secret: 'My private message.' }} onReplay={onReplay} />)

    const heart = screen.getByRole('button', { name: 'Reveal a secret for Somya' })
    fireEvent.click(heart)
    fireEvent.click(heart)
    expect(screen.queryByText('My private message.')).not.toBeInTheDocument()
    fireEvent.click(heart)
    expect(screen.getByText('My private message.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Experience it again' }))
    expect(onReplay).toHaveBeenCalledOnce()
  })
})
