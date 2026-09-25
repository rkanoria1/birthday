import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PasscodeChapter } from '@/components/chapters/PasscodeChapter'

describe('PasscodeChapter keyboard entry', () => {
  it('unlocks when the expected digits are typed on a keyboard', () => {
    const onUnlock = vi.fn()
    render(<PasscodeChapter expected="0610" hint="Birthday date" onUnlock={onUnlock} />)

    for (const key of ['0', '6', '1', '0']) fireEvent.keyDown(window, { key })

    expect(onUnlock).toHaveBeenCalledOnce()
  })

  it('allows the last digit to be corrected with Backspace', () => {
    const onUnlock = vi.fn()
    render(<PasscodeChapter expected="0610" hint="Birthday date" onUnlock={onUnlock} />)

    for (const key of ['0', '6', '2', 'Backspace', '1', '0']) fireEvent.keyDown(window, { key })

    expect(onUnlock).toHaveBeenCalledOnce()
  })

  it('centers zero and does not reveal the birthday-date hint after a wrong code', () => {
    render(<PasscodeChapter expected="0610" hint="The day this celebration belongs to" onUnlock={vi.fn()} />)

    expect(screen.getByRole('button', { name: '0' })).toHaveClass('col-start-2')
    for (const key of ['1', '2', '3', '4']) fireEvent.click(screen.getByRole('button', { name: key }))

    expect(screen.getByRole('alert')).toHaveTextContent("That code didn't open it. Try again.")
    expect(screen.queryByText(/try the birthday date/i)).not.toBeInTheDocument()
  })
})
