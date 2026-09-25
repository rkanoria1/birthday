import { describe, expect, it } from 'vitest'
import { STORY_ORDER, canAdvance, canRetreat, nextStory, prevStory } from '@/lib/storyFlow'

describe('storyFlow', () => {
  it('uses the approved chapter order', () => {
    expect(STORY_ORDER).toEqual([
      'passcode', 'mandalaIntro', 'hero', 'mosaic', 'observations', 'balloons',
      'wish', 'meaning', 'future', 'finalLetter',
    ])
  })

  it('clamps navigation at both ends', () => {
    expect(prevStory('passcode')).toBe('passcode')
    expect(nextStory('finalLetter')).toBe('finalLetter')
    expect(canRetreat('passcode')).toBe(false)
    expect(canAdvance('finalLetter')).toBe(false)
  })

  it('moves between adjacent chapters', () => {
    expect(nextStory('mandalaIntro')).toBe('hero')
    expect(nextStory('hero')).toBe('mosaic')
    expect(prevStory('mosaic')).toBe('hero')
  })
})
