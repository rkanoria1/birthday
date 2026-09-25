import { beforeEach, describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BackgroundAudio } from '@/components/BackgroundAudio'

describe('BackgroundAudio', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  it('waits for an explicit play action', () => {
    render(<BackgroundAudio src="/audio/song.mp3" />)
    expect(screen.getByRole('button', { name: /play background music/i })).toBeInTheDocument()
  })

  it('plays the audio after the button is clicked', async () => {
    render(<BackgroundAudio src="/audio/song.mp3" />)
    const button = screen.getByRole('button', { name: /play background music/i })
    fireEvent.click(button)
    await waitFor(() => expect(screen.getByRole('button', { name: /pause background music/i })).toBeInTheDocument())
  })

  it('fades the music in when the passcode unlocks', async () => {
    render(<BackgroundAudio src="/audio/song.mp3" />)
    const audio = document.querySelector('audio') as HTMLAudioElement

    window.dispatchEvent(new Event('somya-story:unlock'))

    await waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalled())
    expect(audio.volume).toBeLessThan(1)
    expect(screen.getByRole('button', { name: /pause background music/i })).toBeInTheDocument()
  })

  it('keeps the audio mounted while hiding its control on the passcode screen', () => {
    render(<BackgroundAudio src="/audio/song.mp3" showControl={false} />)
    expect(document.querySelector('audio')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('hides itself if the audio file fails to load', () => {
    render(<BackgroundAudio src="/audio/missing.mp3" />)
    const audio = document.querySelector('audio') as HTMLAudioElement
    fireEvent.error(audio)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
