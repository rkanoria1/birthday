import { StoryImage } from '@/components/StoryImage'
import type { SiteContent } from '@/content/types'

export function MeaningChapter({ content }: { content: SiteContent['meaning'] }) {
  return (
    <section className="chapter-frame grid items-center gap-10 md:grid-cols-[minmax(17rem,28rem)_minmax(0,1fr)] md:gap-16">
      <StoryImage
        image={content.image}
        className="photo-depth aspect-[927/1697] w-full max-w-[28rem] justify-self-center rounded-[7rem_1.75rem_1.75rem_1.75rem] border-4 border-white"
        sizes="(min-width:768px) 28rem, 100vw"
      />
      <div>
        <h1 className="font-display text-5xl font-semibold text-[#591c2d] sm:text-6xl">{content.title}</h1>
        {content.body.split('\n\n').map((paragraph) => (
          <p key={paragraph} className="mt-5 max-w-xl text-lg leading-8">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}
