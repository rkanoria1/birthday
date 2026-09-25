'use client'

import { useState } from 'react'
import { siteContent } from '@/content/site'
import { canAdvance, canRetreat, nextStory, prevStory, type StoryId } from '@/lib/storyFlow'
import { BackgroundAudio } from '@/components/BackgroundAudio'
import { StoryShell } from '@/components/StoryShell'
import { AmbientScene } from '@/components/AmbientScene'
import { ChapterTransition } from '@/components/ChapterTransition'
import { PasscodeChapter } from '@/components/chapters/PasscodeChapter'
import { BirthdayHeroChapter } from '@/components/chapters/BirthdayHeroChapter'
import { MandalaIntroChapter } from '@/components/chapters/MandalaIntroChapter'
import { PhotoMosaicChapter } from '@/components/chapters/PhotoMosaicChapter'
import { ObservationsChapter } from '@/components/chapters/ObservationsChapter'
import { BalloonChapter } from '@/components/chapters/BalloonChapter'
import { WishChapter } from '@/components/chapters/WishChapter'
import { MeaningChapter } from '@/components/chapters/MeaningChapter'
import { FutureChapter } from '@/components/chapters/FutureChapter'
import { FinalLetterChapter } from '@/components/chapters/FinalLetterChapter'

export default function Page() {
  const [story,setStory]=useState<StoryId>('passcode')
  const go=(next:StoryId)=>{
    if(typeof window!=='undefined'&&story==='passcode'&&next==='mandalaIntro') window.dispatchEvent(new Event('somya-story:unlock'))
    setStory(next)
    if(typeof window!=='undefined'&&window.scrollTo) window.scrollTo({top:0})
  }

  const chapter = story==='passcode'?null
    :story==='mandalaIntro'?<MandalaIntroChapter/>
    :story==='hero'?<BirthdayHeroChapter content={siteContent.hero}/>
    :story==='mosaic'?<PhotoMosaicChapter content={siteContent.mosaic}/>
    :story==='observations'?<ObservationsChapter observations={siteContent.observations}/>
    :story==='balloons'?<BalloonChapter title={siteContent.balloons.title} qualities={siteContent.balloons.qualities}/>
    :story==='wish'?<WishChapter title={siteContent.wish.title} message={siteContent.wish.message}/>
    :story==='meaning'?<MeaningChapter content={siteContent.meaning}/>
    :story==='future'?<FutureChapter content={siteContent.future} onContinue={()=>go('finalLetter')}/>
    :<FinalLetterChapter content={siteContent.finalLetter} onReplay={()=>go('mandalaIntro')}/>

  return <>
    <BackgroundAudio src={siteContent.audio.src} title={siteContent.audio.title} showControl={story!=='passcode'}/>
    {story==='passcode'
      ?<PasscodeChapter expected={siteContent.passcode} hint={siteContent.passcodeHint} onUnlock={()=>go('mandalaIntro')} />
      :<><AmbientScene/>
        <StoryShell showBack={canRetreat(story)} showNext={canAdvance(story)&&story!=='future'} continueLabel={story==='mandalaIntro'?'Begin':'Continue'} onBack={()=>go(prevStory(story))} onNext={()=>go(nextStory(story))}>
          <ChapterTransition chapter={story}>{chapter}</ChapterTransition>
        </StoryShell>
      </>}
  </>
}
