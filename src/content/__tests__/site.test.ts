import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { siteContent } from '@/content/site'

describe('siteContent', () => {
  it('identifies Somya and her birthday', () => {
    expect(siteContent.recipientName).toBe('Somya')
    expect(siteContent.birthday).toBe('2026-10-06')
    expect(siteContent.mosaic.title).toBe('You, in every shade')
  })

  it('keeps the chapter headings in the approved direct-to-Somya voice', () => {
    expect([
      siteContent.balloons.title,
      siteContent.wish.title,
      siteContent.meaning.title,
      siteContent.future.title,
    ]).toEqual([
      'Four things I see in you',
      'One wish, just for you',
      'What knowing you has begun to mean',
      'All the firsts waiting for us',
    ])
  })

  it('uses the requested private passcode and four balloon qualities', () => {
    expect(siteContent.passcode).toBe('2901')
    expect(siteContent.balloons.qualities).toHaveLength(4)
  })

  it('closes with an honest birthday message for a day spent apart', () => {
    expect(siteContent.finalLetter.body).toBe(
      'Happy birthday, Somya. I may not be beside you today, but I still wanted your day to hold a little piece of me. I hope this small celebration made you smile. I feel very lucky that this is only the beginning of all the moments we will share.',
    )
    expect(siteContent.finalLetter.body).not.toContain('celebrating your day together')
  })

  it('uses the licensed Hindi acoustic track from the local audio library', () => {
    expect(siteContent.audio).toEqual({
      src: '/audio/love-acoustic-romantic-hindi-guitar.m4a',
      title: 'Love Acoustic Romantic Hindi Guitar by echoes_of_lumen',
    })
    expect(existsSync(join(process.cwd(), 'public', siteContent.audio.src))).toBe(true)
  })

  it('provides accessible metadata for the main photographs', () => {
    const images = [
      siteContent.hero.image,
      ...siteContent.mosaic.images,
      ...siteContent.observations.map((item) => item.image),
      siteContent.meaning.image,
    ]
    expect(images.length).toBeGreaterThanOrEqual(11)
    expect(images.every((image) => image.src && image.alt)).toBe(true)
  })

  it('uses 12 distinct, locally optimized photographs', () => {
    const images = [
      siteContent.hero.image,
      ...siteContent.mosaic.images,
      ...siteContent.observations.map((item) => item.image),
      siteContent.meaning.image,
    ]

    expect(images).toHaveLength(12)
    expect(new Set(images.map((image) => image.src)).size).toBe(12)
    expect(images.every((image) => image.focalPoint)).toBe(true)
    expect(images.every((image) => existsSync(join(process.cwd(), 'public', image.src)))).toBe(true)
  })

  it('gives every lookbook portrait its own caption and colour story', () => {
    expect(siteContent.mosaic.images).toHaveLength(7)
    expect(siteContent.mosaic.images.every((image) => image.editorialCaption.length > 0)).toBe(true)
    expect(siteContent.mosaic.images.every((image) => image.palette.wash && image.palette.accent && image.palette.ink)).toBe(true)
  })

  it('does not reveal Rahul’s arrival in the birthday story', () => {
    expect(siteContent.finalLetter).not.toHaveProperty('cta')
    expect(JSON.stringify(siteContent)).not.toContain('Chandler')
  })

  it('does not include the removed time-capsule or future-note chapters', () => {
    expect(siteContent).not.toHaveProperty('timeCapsule')
    expect(siteContent).not.toHaveProperty('futureRahul')
  })

  it('ends with the final letter instead of an extra gallery', () => {
    expect(siteContent).not.toHaveProperty('epilogue')
  })
})
