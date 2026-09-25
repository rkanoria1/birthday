export interface StoryImageData {
  src: string
  alt: string
  caption?: string
  date?: string
  focalPoint?: `${number}% ${number}%`
}

export interface LookbookImageData extends StoryImageData {
  editorialCaption: string
  palette: { wash: string; accent: string; ink: string }
}

export interface ObservationData {
  text: string
  image: StoryImageData
}

export interface SiteContent {
  recipientName: string
  birthday: '2026-10-06'
  passcode: string
  passcodeHint: string
  audio: { src: string; title: string }
  hero: { kicker: string; title: string; image: StoryImageData }
  mosaic: { title: string; caption: string; images: LookbookImageData[] }
  observations: ObservationData[]
  balloons: { title: string; qualities: [string, string, string, string] }
  wish: { title: string; message: string }
  meaning: { title: string; body: string; image: StoryImageData }
  future: { title: string; body: string; noteLabel: string }
  finalLetter: { body: string; secret: string }
}
