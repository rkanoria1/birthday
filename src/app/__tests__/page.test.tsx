import { beforeEach, describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Page from '@/app/page'
import { siteContent } from '@/content/site'

function enterPasscode() {
  for (const digit of siteContent.passcode.split('')) {
    fireEvent.click(screen.getByRole('button', { name: digit }))
  }
}

describe('Page', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
  })
  it('starts on the passcode step', () => {
    render(<Page />)
    expect(screen.getByRole('heading', { name: 'Something made only for you' })).toBeInTheDocument()
  })

  it('walks through the full flow to the final letter', async () => {
    const unlockListener = vi.fn()
    window.addEventListener('somya-story:unlock', unlockListener)
    render(<Page />)
    enterPasscode()
    expect(unlockListener).toHaveBeenCalledOnce()
    expect(screen.getByRole('heading', { name: 'A little world, drawn from yours' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }))
    expect(unlockListener).toHaveBeenCalledOnce()
    expect(screen.getByRole('heading', { name: 'Happy Birthday, Somya ♥' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByRole('heading', { name: siteContent.mosaic.title })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open our next chapter' }))
    fireEvent.click(screen.getByRole('button', { name: 'Read the final letter' }))
    expect(screen.getByLabelText(siteContent.finalLetter.body)).toBeInTheDocument()
    expect(screen.queryByText(/Chandler/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Experience it again' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'One more thing…' })).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'More moments with Somya' })).not.toBeInTheDocument()
  })
})
