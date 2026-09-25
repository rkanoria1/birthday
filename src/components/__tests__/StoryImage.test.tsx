import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StoryImage } from '@/components/StoryImage'

describe('StoryImage', () => {
  it('gives every photograph the shared motion treatment', () => {
    render(<StoryImage image={{ src: '/portrait.jpg', alt: 'Somya smiling' }} />)

    expect(screen.getByRole('img', { name: 'Somya smiling' })).toHaveAttribute('data-motion-photo', 'true')
  })

  it('opens and closes an immersive portrait viewer', async () => {
    render(<StoryImage image={{ src: '/portrait.jpg', alt: 'Somya smiling' }} />)

    fireEvent.click(screen.getByRole('button', { name: 'Open Somya smiling' }))
    expect(screen.getByRole('dialog', { name: 'Somya smiling' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close portrait' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
