import { StoryImage } from '@/components/StoryImage'
import type { ObservationData } from '@/content/types'

const frameRatios = ['aspect-[927/1697]', 'aspect-[1218/1291]', 'aspect-[1120/1404]']

export function ObservationsChapter({ observations }: { observations: ObservationData[] }) {
  return (
    <section className="chapter-frame">
      <h1 className="font-display mb-12 max-w-xl text-5xl font-semibold text-[#591c2d] sm:text-6xl">
        The details that stay with me
      </h1>

      <ul className="space-y-16 md:space-y-24">
        {observations.map((item, index) => {
          const imageOrder = index % 2 ? 'md:order-2' : ''
          const copyAlignment = index % 2 ? 'md:text-right' : ''

          return (
            <li
              key={item.image.src}
              className="grid items-center gap-7 md:grid-cols-[minmax(16rem,28rem)_minmax(0,1fr)] md:gap-12"
            >
              <StoryImage
                image={item.image}
                className={`${frameRatios[index] ?? 'aspect-[4/5]'} ${imageOrder} photo-depth w-full rounded-[1.5rem] border-4 border-white`}
                sizes="(min-width:768px) 28rem, 100vw"
              />
              <p className={`font-hand px-3 text-3xl leading-tight text-[#591c2d] sm:text-4xl ${copyAlignment}`}>
                {item.text}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
