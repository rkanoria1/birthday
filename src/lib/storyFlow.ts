export const STORY_ORDER = [
  'passcode', 'mandalaIntro', 'hero', 'mosaic', 'observations', 'balloons',
  'wish', 'meaning', 'future', 'finalLetter',
] as const

export type StoryId = (typeof STORY_ORDER)[number]
export const storyIndex = (story: StoryId) => STORY_ORDER.indexOf(story)
export const nextStory = (story: StoryId): StoryId => STORY_ORDER[Math.min(storyIndex(story) + 1, STORY_ORDER.length - 1)]
export const prevStory = (story: StoryId): StoryId => STORY_ORDER[Math.max(storyIndex(story) - 1, 0)]
export const canAdvance = (story: StoryId) => story !== STORY_ORDER.at(-1)
export const canRetreat = (story: StoryId) => storyIndex(story) > 1
