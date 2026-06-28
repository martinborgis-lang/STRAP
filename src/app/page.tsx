import { HeroSection } from '@/components/home/HeroSection'
import { MarqueeSection } from '@/components/home/MarqueeSection'
import { ManifestoSection } from '@/components/home/ManifestoSection'
import { VideoImmersive } from '@/components/home/VideoImmersive'
import { CollectionPreview } from '@/components/home/CollectionPreview'
import { VideoSection2 } from '@/components/home/VideoSection2'
import { StorySection } from '@/components/home/StorySection'
import { CompatibilityGuide } from '@/components/home/CompatibilityGuide'
import { SocialProof } from '@/components/home/SocialProof'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <ManifestoSection />
      <VideoImmersive />
      <CollectionPreview />
      <VideoSection2 />
      <StorySection />
      <CompatibilityGuide />
      <SocialProof />
    </>
  )
}
