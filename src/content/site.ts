import type { LookbookImageData, SiteContent, StoryImageData } from './types'

export const CONTENT_STATUS = 'ready' as const

const image = (number: number, alt: string, focalPoint: `${number}% ${number}%` = '50% 35%', caption?: string): StoryImageData => ({
  src: `/images/digital/somya-digital-${String(number).padStart(2, '0')}.webp`, alt, caption, focalPoint,
})

const look = (number: number, alt: string, editorialCaption: string, palette: LookbookImageData['palette'], focalPoint: `${number}% ${number}%` = '50% 35%'): LookbookImageData => ({
  ...image(number, alt, focalPoint), editorialCaption, palette,
})

export const siteContent: SiteContent = {
  recipientName: 'Somya',
  birthday: '2026-10-06',
  passcode: '0610',
  passcodeHint: 'The day this celebration belongs to',
  audio: {
    src: '/audio/love-acoustic-romantic-hindi-guitar.m4a',
    title: 'Love Acoustic Romantic Hindi Guitar by echoes_of_lumen',
  },
  hero: { kicker: '6 October 2026', title: 'Happy Birthday, Somya ♥', image: image(1, 'A digitally painted portrait of Somya in pink, holding roses with her mehndi-covered hands', '50% 35%') },
  mosaic: {
    title: 'You, in every shade',
    caption: 'Seven moods. Seven colour stories. One unmistakable presence.',
    images: [
      look(2, 'Somya smiling in a midnight-blue embroidered lehenga', 'Midnight, embroidered.', { wash: '#dce5f2', accent: '#173866', ink: '#152541' }, '50% 28%'),
      look(3, 'Somya laughing in a turquoise floral kurta', 'Florals, caught laughing.', { wash: '#d9eee9', accent: '#087f88', ink: '#16464b' }, '50% 24%'),
      look(4, 'Somya enjoying a sunny day at the beach in pink', 'Sea breeze. Rosy light.', { wash: '#f6e0e8', accent: '#d16b91', ink: '#643044' }, '50% 34%'),
      look(6, 'Somya smiling in a vivid red outfit', 'Red, without apology.', { wash: '#f3d9d6', accent: '#c42234', ink: '#5b1b25' }, '52% 27%'),
      look(7, 'Somya dressed in fuchsia for a celebration', 'Fuchsia in full bloom.', { wash: '#f4d7e7', accent: '#d40c68', ink: '#60183d' }, '50% 30%'),
      look(8, 'Somya in a modern neutral look at an arcade', 'Soft tailoring, playful spirit.', { wash: '#eee2d8', accent: '#b68155', ink: '#49372e' }, '50% 30%'),
      look(9, 'Somya holding a soft toy and smiling', 'The softest kind of joy.', { wash: '#f2e8df', accent: '#d68b89', ink: '#5c3b3a' }, '50% 58%'),
    ],
  },
  observations: [
    { text: 'The warmth you bring into a room before you even say a word.', image: image(10, 'Somya sharing a relaxed candid smile', '55% 28%') },
    { text: 'The way your smile makes an ordinary day feel worth remembering.', image: image(11, 'Somya smiling outdoors in a blue floral dress', '50% 28%') },
    { text: 'Your quiet strength—and the kindness that always travels with it.', image: image(12, 'Somya during a peaceful temple visit', '52% 34%') },
  ],
  balloons: { title: 'Four things I see in you', qualities: ['Your kindness', 'Your quiet strength', 'Your smile', 'Your warmth'] },
  wish: { title: 'One wish, just for you', message: 'Whatever you wish for tonight, I hope life gives you that—and more.' },
  meaning: {
    title: 'What knowing you has begun to mean',
    body: 'We are still at the beginning, and perhaps that is what makes this so special. There is so much about you I still get to discover.\n\nWhat I already know is that your warmth, thoughtfulness, and quiet strength make me genuinely excited for everything ahead of us.',
    image: image(13, 'A quiet casual portrait of Somya', '50% 25%'),
  },
  future: {
    title: 'All the firsts waiting for us', noteLabel: 'Open our next chapter',
    body: 'There are first trips, first festivals, ordinary mornings, ridiculous jokes, and many birthdays still waiting for us. I cannot promise every day will be perfect—but I can promise to keep listening, learning, and showing up.',
  },
  finalLetter: {
    body: 'Happy birthday, Somya. This is our first time celebrating your day together, and I wanted it to say something simple: I notice you, I value you, and I feel very lucky that I get to know you better from here.',
    secret: 'A little secret: every version of my future looks better with you in it. ♥ — Rahul',
  },
}
