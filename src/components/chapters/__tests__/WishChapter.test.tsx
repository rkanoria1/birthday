import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WishChapter } from '@/components/chapters/WishChapter'

describe('WishChapter', () => {
  it('replaces the flame with a central heart and releases independent hearts', () => {
    render(<WishChapter title="Make a wish" message="May it come true." />)

    expect(screen.getByTestId('candle-flame')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Blow out the birthday candle' }))

    expect(screen.queryByTestId('candle-flame')).not.toBeInTheDocument()
    expect(screen.getByTestId('candle-heart')).toBeInTheDocument()
    expect(screen.getAllByTestId('wish-heart-particle')).toHaveLength(9)
    expect(screen.getByText('May it come true.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Relight the birthday candle' })).toBeInTheDocument()
  })
})
